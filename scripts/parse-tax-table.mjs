// 근로소득 간이세액표 파서
// 사용자가 제공한 마크다운 → src/lib/incomeTaxTable.ts 생성
import fs from "node:fs";
import path from "node:path";

const mdPath = process.argv[2];
const outPath = process.argv[3];

if (!mdPath || !outPath) {
  console.error("사용법: node parse-tax-table.mjs <input.md> <output.ts>");
  process.exit(1);
}

const md = fs.readFileSync(mdPath, "utf8");
const lines = md.split("\n");

// 테이블 행 파싱: "| 3,000 ~ 3,020 | 74,350 | 56,850 | ... |"
const rows = [];
const rowRegex = /^\|\s*([\d,]+)\s*~\s*([\d,]+)\s*\|\s*(.+?)\s*\|\s*$/;

for (const line of lines) {
  const m = line.match(rowRegex);
  if (!m) continue;
  const minK = Number(m[1].replace(/,/g, ""));
  const maxK = Number(m[2].replace(/,/g, ""));
  const cells = m[3].split("|").map((c) => c.trim());
  if (cells.length !== 11) continue;
  const values = cells.map((c) => (c === "-" ? 0 : Number(c.replace(/,/g, ""))));
  if (values.some((v) => isNaN(v))) continue;
  rows.push({ minK, maxK, values });
}

console.log(`파싱된 행 수: ${rows.length}`);

// TypeScript 파일 생성
const ts = `// 자동 생성 파일 - 수정 금지
// 출처: 근로소득 간이세액표 (2026.2.27. 개정, 소득세법 시행령 별표 2)
// 행 수: ${rows.length}
// 월급여 단위: 천원 (이상 ~ 미만)
// 값: 원 (공제대상가족 1~11인별 세액)

export type TaxRow = readonly [minK: number, values: readonly number[]];

export const TAX_TABLE: readonly TaxRow[] = [
${rows.map((r) => `  [${r.minK}, [${r.values.join(", ")}]],`).join("\n")}
];

/** 10,000천원 초과 구간 계산식 — "10,000천원 기준 세액" (공제대상가족 1~11인) */
export const OVER_10M_BASE: readonly number[] = [
  1507400, 1431570, 1200840, 1170840, 1140840, 1110840, 1080840, 1050840, 1020840, 990840, 960840,
];

/** 8세 이상 20세 이하 자녀 공제 */
export function childCredit(childCount: number): number {
  if (childCount <= 0) return 0;
  if (childCount === 1) return 20830;
  if (childCount === 2) return 45830;
  return 45830 + (childCount - 2) * 33330;
}

/**
 * 월급여액(비과세·학자금 제외) → 간이세액표 기본 세액 (공제대상가족 수별)
 * @param salaryWon 월급여액 (원 단위)
 * @param dependents 공제대상가족 수 (본인 + 배우자 + 부양가족)
 * @returns 기본 세액 (원)
 */
export function lookupBaseTax(salaryWon: number, dependents: number): number {
  const sk = Math.floor(salaryWon / 1000); // 천원 단위
  if (sk < ${rows.length > 0 ? rows[0].minK : 770}) return 0;
  const depIdx = Math.max(0, Math.min(10, dependents - 1)); // 0-indexed

  // 1) 일반 구간 (테이블 범위 내)
  if (sk <= 10000) {
    // 이분 탐색
    let lo = 0;
    let hi = TAX_TABLE.length - 1;
    let ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (TAX_TABLE[mid][0] <= sk) {
        ans = TAX_TABLE[mid][1][depIdx];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }

  // 2) 10,000천원 초과 계산식
  const base10M = OVER_10M_BASE[depIdx];
  if (sk <= 14000) {
    // (10,000 세액) + (10,000 초과분 × 98% × 35%) + 25,000
    return base10M + (sk - 10000) * 1000 * 0.98 * 0.35 + 25000;
  }
  if (sk <= 28000) {
    return base10M + 1397000 + (sk - 14000) * 1000 * 0.98 * 0.38;
  }
  if (sk <= 30000) {
    return base10M + 6610600 + (sk - 28000) * 1000 * 0.98 * 0.4;
  }
  if (sk <= 45000) {
    return base10M + 7394600 + (sk - 30000) * 1000 * 0.4;
  }
  if (sk <= 87000) {
    return base10M + 13394600 + (sk - 45000) * 1000 * 0.42;
  }
  return base10M + 31034600 + (sk - 87000) * 1000 * 0.45;
}

/** 최종 월 소득세 (자녀공제 적용 + 10원 절사) */
export function calcMonthlyIncomeTaxFromTable(
  salaryWon: number,
  dependents: number,
  childrenCount: number = 0,
): number {
  const base = lookupBaseTax(salaryWon, dependents);
  const afterChild = Math.max(0, base - childCredit(childrenCount));
  return Math.floor(afterChild / 10) * 10;
}
`;

fs.writeFileSync(outPath, ts);
console.log(`생성 완료: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
