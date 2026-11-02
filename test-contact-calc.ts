// 상담 신청 API — 계산 결과 요약이 문자·메일에 붙는지 점검 (실제 발송 없음: fetch를 가로챔)
// 실행: npx tsx test-contact-calc.ts
process.env.ALIGO_API_KEY = "test";
process.env.ALIGO_USER_ID = "test";
process.env.ALIGO_SENDER = "0200000000";
process.env.ALIGO_RECEIVER = "01000000000";
process.env.RESEND_API_KEY = "test";
process.env.CONTACT_EMAIL_TO = "test@example.com";

const sent: { url: string; body: string }[] = [];
globalThis.fetch = (async (url: string, init?: RequestInit) => {
  sent.push({ url, body: String(init?.body ?? "") });
  if (url.includes("aligo")) return new Response(JSON.stringify({ result_code: "1", message: "ok" }));
  return new Response("{}", { status: 200 });
}) as typeof fetch;

async function main() {
  const { POST } = await import("./src/app/api/contact/route");
  const calcSummary = "[증여세 계산기]\n관계: 직계존속 → 성년자녀 (5천만)\n증여 금액: 3억 원\n예상 증여세: 3,880만 원";
  const res = await POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "테스트", phone: "01012345678", taxType: "증여세", memo: "", calcSummary }),
    }),
  );
  const sms = new URLSearchParams(sent.find((s) => s.url.includes("aligo"))!.body).get("msg") ?? "";
  const mail = JSON.parse(sent.find((s) => s.url.includes("resend"))!.body).html as string;
  const checks = {
    status200: res.status === 200,
    smsHasSummary: sms.includes("계산 결과\n[증여세 계산기]") && sms.includes("예상 증여세: 3,880만 원"),
    mailHasSummary: mail.includes("계산 결과") && mail.includes("예상 증여세: 3,880만 원"),
    mailEscaped: !mail.includes("<증여"),
  };
  console.log(sms);
  console.log(checks);
  if (Object.values(checks).some((v) => !v)) process.exit(1);
}
main();
