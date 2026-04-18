export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white/70 px-6 py-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="text-white font-extrabold text-lg mb-3">세무회계 새벽</div>
            <div className="text-[13px] leading-[2] space-y-0">
              <p>대표자: 김근량, 고유빈 &nbsp;|&nbsp; 사업자등록번호: 653-09-02917</p>
              <p>서울 송파구 위례서로 252, 유원플러스송파 610호</p>
              <p>Tel. 010-3262-3295</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <a href="https://blog.naver.com/tax_dawn" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">블로그</a>
            <a href="https://naver.me/5yP5BKUk" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">네이버 플레이스</a>
            <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">톡톡 문의</a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-[11px] text-white/30 leading-relaxed">
            본 사이트의 계산기는 참고용이며, 실제 세액과 다를 수 있습니다. 정확한 세금 산출은 개별 상황에 따라 달라지므로 반드시 세무사와 상담하시기 바랍니다.
          </p>
          <p className="text-[11px] text-white/20 mt-3">
            © 2026 세무회계 새벽. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
