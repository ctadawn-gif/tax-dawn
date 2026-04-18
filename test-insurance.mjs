const NPS_RATE = 0.095, NPS_MIN = 400000, NPS_MAX = 6370000;
const HI_RATE = 0.0719, HI_MIN = 280528, HI_MAX = 127725730;
const LTC = 0.009448 / 0.0719;
const EI_U = 0.009;
const EI_S = { under150: 0.0025, over150priority: 0.0045, "150to1000": 0.0065, over1000: 0.0085 };
const f = v => Math.floor(v);
const fmt = v => v.toLocaleString("ko-KR");

function calc(salary, size) {
  const npsB = Math.max(NPS_MIN, Math.min(NPS_MAX, salary));
  const npsT = f(npsB * NPS_RATE), npsE = f(npsB * NPS_RATE / 2), npsR = npsT - npsE;
  const hiB = Math.max(HI_MIN, Math.min(HI_MAX, salary));
  const hiT = f(hiB * HI_RATE), hiE = f(hiB * HI_RATE / 2), hiR = hiT - hiE;
  const ltcT = f(hiT * LTC), ltcE = f(ltcT / 2), ltcR = ltcT - ltcE;
  const eiE = f(salary * EI_U), eiR = f(salary * (EI_U + EI_S[size])), eiT = eiE + eiR;
  const tE = npsE + hiE + ltcE + eiE, tR = npsR + hiR + ltcR + eiR;
  return { npsT, npsE, npsR, hiT, hiE, hiR, ltcT, ltcE, ltcR, eiT, eiE, eiR, tE, tR, total: tE + tR };
}

function print(name, salary, size) {
  const r = calc(salary, size);
  console.log(`━━━ ${name} (월급 ${fmt(salary)}원, ${size}) ━━━`);
  console.log(`국민연금:    총 ${fmt(r.npsT)} | 근로자 ${fmt(r.npsE)} | 사업주 ${fmt(r.npsR)}`);
  console.log(`건강보험:    총 ${fmt(r.hiT)} | 근로자 ${fmt(r.hiE)} | 사업주 ${fmt(r.hiR)}`);
  console.log(`장기요양:    총 ${fmt(r.ltcT)} | 근로자 ${fmt(r.ltcE)} | 사업주 ${fmt(r.ltcR)}`);
  console.log(`고용보험:    총 ${fmt(r.eiT)} | 근로자 ${fmt(r.eiE)} | 사업주 ${fmt(r.eiR)}`);
  console.log(`합계:        총 ${fmt(r.total)} | 근로자 ${fmt(r.tE)} | 사업주 ${fmt(r.tR)}`);
  console.log("");
}

print("케이스1: 월급 300만원", 3000000, "under150");
print("케이스2: 월급 500만원", 5000000, "under150");
print("케이스3: 월급 200만원", 2000000, "under150");
print("케이스4: 월급 700만원 (국민연금 상한)", 7000000, "150to1000");
print("케이스5: 월급 30만원 (국민연금 하한)", 300000, "under150");
