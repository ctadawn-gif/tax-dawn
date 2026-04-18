// 종합소득세 계산 로직 테스트 (독립 실행)

const TAX_BRACKETS = [
  { limit: 1400, rate: 0.06, deduction: 0 },
  { limit: 5000, rate: 0.15, deduction: 126 },
  { limit: 8800, rate: 0.24, deduction: 576 },
  { limit: 15000, rate: 0.35, deduction: 1544 },
  { limit: 30000, rate: 0.38, deduction: 1994 },
  { limit: 50000, rate: 0.40, deduction: 2594 },
  { limit: 100000, rate: 0.42, deduction: 3594 },
  { limit: Infinity, rate: 0.45, deduction: 6594 },
];

function calcEarnedIncomeDeduction(s) {
  if (s <= 500) return s * 0.7;
  if (s <= 1500) return 350 + (s - 500) * 0.4;
  if (s <= 4500) return 750 + (s - 1500) * 0.15;
  if (s <= 10000) return 1200 + (s - 4500) * 0.05;
  return Math.min(2000, 1475 + (s - 10000) * 0.02);
}

function calcEarnedIncomeTaxCredit(tax, salary) {
  let credit = tax <= 130 ? tax * 0.55 : 71.5 + (tax - 130) * 0.3;
  let limit;
  if (salary <= 3300) limit = 74;
  else if (salary <= 7000) limit = Math.max(66, 74 - (salary - 3300) * 0.008);
  else if (salary <= 12000) limit = Math.max(50, 66 - (salary - 7000) * 0.5 / 100);
  else limit = 50;
  return Math.min(credit, limit);
}

function calcTax(ti) {
  if (ti <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (ti <= b.limit) return ti * b.rate - b.deduction;
  }
  return 0;
}

function calcExpense(rev, rate, method) {
  if (method === "standard") return rev * (rate.standardRate / 100);
  if (rate.excessRate != null && rev > 4000) {
    return 4000 * (rate.simpleRate / 100) + (rev - 4000) * (rate.excessRate / 100);
  }
  return rev * (rate.simpleRate / 100);
}

function run(name, p) {
  // 사업소득
  let bizExp = 0, bizInc = 0;
  if (p.bizRev > 0) {
    if (p.expMethod === "book") bizExp = p.bookExp;
    else if (p.rate) bizExp = calcExpense(p.bizRev, p.rate, p.expMethod);
    else bizExp = p.bizRev * (p.manualRate / 100);
    bizInc = Math.max(0, p.bizRev - bizExp);
  }

  // 근로소득
  let salDed = 0, salInc = 0;
  if (p.salRev > 0) {
    salDed = calcEarnedIncomeDeduction(p.salRev);
    salInc = Math.max(0, p.salRev - salDed);
  }

  const totalInc = bizInc + salInc;
  const persDed = 150 + (p.spouse ? 150 : 0) + p.dep * 150 + p.eld * 100 + p.dis * 200;
  const totalDed = persDed + p.socIns;
  const taxable = Math.max(0, totalInc - totalDed);
  const computed = calcTax(taxable);

  let credit = 0;
  if (p.type === "salary") {
    credit = calcEarnedIncomeTaxCredit(computed, p.salRev);
  } else if (p.type === "combined" && p.salRev > 0) {
    const portion = salInc / (totalInc || 1);
    credit = calcEarnedIncomeTaxCredit(computed * portion, p.salRev) + 7;
  } else {
    credit = 7;
  }

  const determined = Math.max(0, computed - credit);
  const local = determined * 0.1;
  const total = determined + local;
  let prepaid = p.prepaid;
  if (p.withholding && p.bizRev > 0 && prepaid === 0) prepaid = p.bizRev * 0.033;
  const final_ = total - prepaid;

  let rate = "0%";
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.limit) { rate = `${b.rate * 100}%`; break; }
  }

  console.log("━".repeat(50));
  console.log(name);
  console.log("━".repeat(50));
  if (p.bizRev > 0) console.log(`사업수입: ${p.bizRev} → 필요경비: ${Math.round(bizExp)} → 사업소득: ${Math.round(bizInc)}`);
  if (p.salRev > 0) console.log(`총급여: ${p.salRev} → 근로소득공제: ${Math.round(salDed)} → 근로소득: ${Math.round(salInc)}`);
  console.log(`종합소득금액: ${Math.round(totalInc)}`);
  console.log(`소득공제: ${totalDed} (인적: ${persDed}, 사회보험: ${p.socIns})`);
  console.log(`과세표준: ${Math.round(taxable)} | 적용세율: ${rate}`);
  console.log(`산출세액: ${(Math.round(computed*10)/10)} → 세액공제: ${(Math.round(credit*10)/10)} → 결정세액: ${(Math.round(determined*10)/10)}`);
  console.log(`지방소득세: ${(Math.round(local*10)/10)}`);
  console.log(`총 납부세액: ${(Math.round(total*10)/10)}`);
  if (prepaid > 0) console.log(`기납부세액: ${(Math.round(prepaid*10)/10)} → 최종: ${(Math.round(final_*10)/10)} ${final_ < 0 ? "(환급)" : "(추가납부)"}`);
  console.log("");
}

// 케이스1: 사업소득 5000만, 단순경비율 64.1%, 본인만
run("케이스1: 사업소득 5,000만원 / 단순 64.1% / 본인만", {
  type: "business", bizRev: 5000, expMethod: "simple", rate: null, manualRate: 64.1, bookExp: 0,
  withholding: false, salRev: 0, spouse: false, dep: 0, eld: 0, dis: 0, socIns: 0, prepaid: 0
});

// 케이스2: 근로소득 4000만, 본인만
run("케이스2: 근로소득 4,000만원 / 본인만", {
  type: "salary", bizRev: 0, expMethod: "simple", rate: null, manualRate: 0, bookExp: 0,
  withholding: false, salRev: 4000, spouse: false, dep: 0, eld: 0, dis: 0, socIns: 0, prepaid: 0
});

// 케이스3: 프리랜서 940909 3000만, 단순경비율, 3.3% 원천징수
run("케이스3: 프리랜서(940909) 3,000만원 / 단순 / 3.3% 원천징수", {
  type: "business", bizRev: 3000, expMethod: "simple",
  rate: { simpleRate: 64.1, excessRate: 49.7, standardRate: 17.4 },
  manualRate: 0, bookExp: 0, withholding: true, salRev: 0,
  spouse: false, dep: 0, eld: 0, dis: 0, socIns: 0, prepaid: 0
});

// 케이스4: 프리랜서 940909 6000만, 단순경비율(초과율 적용), 3.3%
run("케이스4: 프리랜서(940909) 6,000만원 / 단순(초과율) / 3.3%", {
  type: "business", bizRev: 6000, expMethod: "simple",
  rate: { simpleRate: 64.1, excessRate: 49.7, standardRate: 17.4 },
  manualRate: 0, bookExp: 0, withholding: true, salRev: 0,
  spouse: false, dep: 0, eld: 0, dis: 0, socIns: 0, prepaid: 0
});

// 케이스5: 종합 - 사업3000(단순64.1%) + 근로5000, 배우자+부양1+사회보험200
run("케이스5: 종합 / 사업 3,000만 + 근로 5,000만 / 배우자+부양1", {
  type: "combined", bizRev: 3000, expMethod: "simple", rate: null, manualRate: 64.1, bookExp: 0,
  withholding: false, salRev: 5000, spouse: true, dep: 1, eld: 0, dis: 0, socIns: 200, prepaid: 0
});

// 케이스6: 근로소득 8000만, 배우자+부양2+경로1
run("케이스6: 근로소득 8,000만원 / 배우자+부양2+경로1", {
  type: "salary", bizRev: 0, expMethod: "simple", rate: null, manualRate: 0, bookExp: 0,
  withholding: false, salRev: 8000, spouse: true, dep: 2, eld: 1, dis: 0, socIns: 300, prepaid: 0
});

// 케이스7: 사업소득 1억, 기준경비율 17.4%, 본인+배우자
run("케이스7: 사업소득 1억 / 기준경비율 17.4% / 본인+배우자", {
  type: "business", bizRev: 10000, expMethod: "standard",
  rate: { simpleRate: 64.1, excessRate: 49.7, standardRate: 17.4 },
  manualRate: 0, bookExp: 0, withholding: false, salRev: 0,
  spouse: true, dep: 0, eld: 0, dis: 0, socIns: 400, prepaid: 0
});
