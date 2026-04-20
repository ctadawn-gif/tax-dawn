import { NextResponse } from "next/server";

/**
 * 상담 신청 폼 → SMS(알리고) + 이메일(Resend) 동시 발송
 *
 * 필요한 환경변수 (Vercel 환경변수에 등록):
 *   ALIGO_API_KEY      알리고 API 키
 *   ALIGO_USER_ID      알리고 사용자 ID
 *   ALIGO_SENDER       발신번호 (사전 등록된 번호, 하이픈 없이)
 *   ALIGO_RECEIVER     수신번호 (대표님 핸드폰, 하이픈 없이, 여러 개면 콤마로 구분)
 *   RESEND_API_KEY     Resend API 키 (선택: 있으면 이메일도 발송)
 *   CONTACT_EMAIL_TO   상담 접수 알림을 받을 이메일 (선택)
 *   CONTACT_EMAIL_FROM 보내는 사람 이메일 (Resend 검증된 도메인, 선택)
 */

type ContactPayload = {
  name?: string;
  phone?: string;
  taxType?: string;
  memo?: string;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPhone(digits: string) {
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return digits;
}

async function sendSms(message: string) {
  const { ALIGO_API_KEY, ALIGO_USER_ID, ALIGO_SENDER, ALIGO_RECEIVER } = process.env;

  if (!ALIGO_API_KEY || !ALIGO_USER_ID || !ALIGO_SENDER || !ALIGO_RECEIVER) {
    console.warn("[contact] ALIGO env variables missing — SMS not sent");
    return { skipped: true };
  }

  const body = new URLSearchParams({
    key: ALIGO_API_KEY,
    user_id: ALIGO_USER_ID,
    sender: ALIGO_SENDER,
    receiver: ALIGO_RECEIVER,
    msg: message,
    msg_type: message.length > 90 ? "LMS" : "SMS",
    title: "세무회계 새벽 상담신청",
    testmode_yn: process.env.ALIGO_TEST_MODE === "true" ? "Y" : "N",
  });

  const res = await fetch("https://apis.aligo.in/send/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await res.json()) as { result_code: string; message: string };

  // 알리고 result_code: "1" = 성공, 그 외 = 실패
  if (data.result_code !== "1") {
    throw new Error(`알리고 SMS 전송 실패: ${data.message}`);
  }

  return { skipped: false, response: data };
}

async function sendEmail(subject: string, html: string) {
  const { RESEND_API_KEY, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM } = process.env;

  if (!RESEND_API_KEY || !CONTACT_EMAIL_TO) {
    console.warn("[contact] Resend env variables missing — email not sent");
    return { skipped: true };
  }

  // 콤마(,) 또는 세미콜론(;)으로 구분된 여러 이메일 지원
  const recipients = CONTACT_EMAIL_TO.split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("[contact] No valid recipient in CONTACT_EMAIL_TO");
    return { skipped: true };
  }

  const from = CONTACT_EMAIL_FROM || "세무회계 새벽 <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend 이메일 전송 실패: ${errText}`);
  }

  return { skipped: false };
}

export async function POST(req: Request) {
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = (payload.name || "").trim().slice(0, 50);
  const phoneDigits = (payload.phone || "").replace(/\D/g, "");
  const taxType = (payload.taxType || "").trim().slice(0, 50);
  const memo = (payload.memo || "").trim().slice(0, 500);

  // 기본 검증
  if (!name) return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  if (phoneDigits.length < 10 || phoneDigits.length > 11 || !phoneDigits.startsWith("01")) {
    return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해주세요." }, { status: 400 });
  }

  const phone = formatPhone(phoneDigits);
  const nowKst = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // SMS 메시지 (LMS 대비 2000바이트 이내)
  const smsMessage = [
    "[세무회계 새벽] 신규 상담 신청",
    ``,
    `이름: ${name}`,
    `연락처: ${phone}`,
    taxType ? `유형: ${taxType}` : null,
    memo ? `메모: ${memo}` : null,
    ``,
    `접수: ${nowKst}`,
  ]
    .filter(Boolean)
    .join("\n");

  // 이메일 HTML
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #f8fafc;">
      <div style="background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
        <h2 style="margin: 0 0 20px; font-size: 20px; color: #0f172a;">📬 신규 상담 신청</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #334155;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 100px; color: #64748b; font-weight: 600;">이름</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong style="color:#0f172a">${escapeHtml(name)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">연락처</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="tel:${phoneDigits}" style="color:#0052FF; font-weight:700; text-decoration:none;">${escapeHtml(phone)}</a></td>
          </tr>
          ${
            taxType
              ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">신고 유형</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(taxType)}</td></tr>`
              : ""
          }
          ${
            memo
              ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; vertical-align: top;">메모</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(memo)}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">접수 시각</td>
            <td style="padding: 10px 0; color: #64748b;">${nowKst}</td>
          </tr>
        </table>
      </div>
      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 16px;">
        세무회계 새벽 — 종합소득세 신고대행 상담 접수 알림
      </p>
    </div>
  `;

  // SMS + 이메일 병렬 발송
  const results = await Promise.allSettled([
    sendSms(smsMessage),
    sendEmail(`[신규 상담] ${name} (${phone})`, emailHtml),
  ]);

  const smsResult = results[0];
  const emailResult = results[1];

  const smsFailed = smsResult.status === "rejected";
  const emailFailed = emailResult.status === "rejected";

  // 둘 다 실패 시 에러 반환
  if (smsFailed && emailFailed) {
    console.error("[contact] Both SMS and email failed", {
      sms: smsResult.reason,
      email: emailResult.reason,
    });
    return NextResponse.json(
      { error: "전송 실패. 톡톡이나 전화로 직접 연락주세요." },
      { status: 500 }
    );
  }

  // 하나만 실패해도 접수는 성공으로 처리 (로그만 남김)
  if (smsFailed) console.error("[contact] SMS failed:", smsResult.reason);
  if (emailFailed) console.error("[contact] Email failed:", emailResult.reason);

  return NextResponse.json({ ok: true });
}
