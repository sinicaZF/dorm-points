export type FamilyMemberKind =
  | 'spouse'
  | 'father'
  | 'mother'
  | 'child';

export interface FamilyMember {
  id: string;
  kind: FamilyMemberKind;
  name: string;
}

export interface OwnProperty {
  id: string;
  owner: string;
  address: string;
}

export interface CalcInput {
  // A1 — 服務年資
  yearsOfService: number;
  monthsOfService: number;
  // A2 — 職級 (本俸)
  baseSalary: number;
  // A3 — 眷口
  familyMembers: FamilyMember[];
  // B1 — 自有住宅 (扣點半徑區域內)
  hasRestrictedProperty: boolean;
  // B2 — 借用次數 (一般多房間職務宿舍, since 民國92年)
  priorBorrowCount: number;
}

export interface CalcSectionResult {
  label: string;
  points: number;
  detail: string;
}

export interface CalcResult {
  A1: CalcSectionResult; // 服務年資點
  A2: CalcSectionResult; // 職級點
  A3: CalcSectionResult; // 眷口點
  A: CalcSectionResult; // 自填加項合計
  B1: CalcSectionResult; // 自有住宅扣點
  B2: CalcSectionResult; // 借用次數扣點
  B: CalcSectionResult; // 自填減項合計
  C: CalcSectionResult; // 合計積點
}

export const POINTS_PER_YEAR = 2;
export const POINTS_PER_HALF_YEAR = 1;
export const POINTS_PER_FAMILY_MEMBER = 4;
export const POINTS_PER_THOUSAND_SALARY = 1;

export function calcServiceYears(
  years: number,
  months: number,
): { points: number; totalMonths: number } {
  const totalMonths = years * 12 + months;
  const halfYears = Math.floor(totalMonths / 6);
  const points = halfYears * POINTS_PER_HALF_YEAR;
  return { points, totalMonths };
}

export function calcRankPoints(baseSalary: number): number {
  if (!baseSalary || baseSalary <= 0) return 0;
  return Math.floor(baseSalary / 1000);
}

export function calcFamilyPoints(members: FamilyMember[]): {
  points: number;
  validCount: number;
} {
  // 父母 only counted once for applicant or spouse (以一方為限) — handled by UI
  // 簡化: 配偶 1, 父 1, 母 1, 子女 each
  const valid = members.filter((m) => m.name.trim().length > 0);
  const points = valid.length * POINTS_PER_FAMILY_MEMBER;
  return { points, validCount: valid.length };
}

export function calculate(input: CalcInput): CalcResult {
  const a1 = calcServiceYears(input.yearsOfService, input.monthsOfService);
  const a1Points = a1.points;

  const a2Points = calcRankPoints(input.baseSalary);

  const family = calcFamilyPoints(input.familyMembers);
  const a3Points = family.points;

  const aTotal = a1Points + a2Points + a3Points;

  // B1: 自有住宅位於限制區域內 => 點數減半 (-1/2 A)
  let b1Points = 0;
  if (input.hasRestrictedProperty) {
    b1Points = -aTotal / 2;
  }

  // B2: 借用次數
  // 無自有住宅: B2 = -1/2 A (1次) or -2/3 A (2次以上)
  // 有自有住宅: B2 = 1/2 * (B1) or 2/3 * (B1)
  let b2Points = 0;
  if (input.priorBorrowCount >= 1) {
    const factor = input.priorBorrowCount >= 2 ? 2 / 3 : 1 / 2;
    if (input.hasRestrictedProperty) {
      // 有自有住宅: 扣點基於 B1 (B1 已為負值)
      b2Points = factor * b1Points;
    } else {
      // 無自有住宅: 扣點基於 A
      b2Points = -factor * aTotal;
    }
  }

  const bTotal = b1Points + b2Points;
  const cTotal = aTotal + bTotal;

  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2));

  return {
    A1: {
      label: '服務年資',
      points: a1Points,
      detail: `${input.yearsOfService} 年 ${input.monthsOfService} 月 → 每 6 個月 1 點`,
    },
    A2: {
      label: '職級',
      points: a2Points,
      detail: `本俸 ${input.baseSalary.toLocaleString()} 元 → 每千元 1 點`,
    },
    A3: {
      label: '眷口',
      points: a3Points,
      detail: `有效眷口 ${family.validCount} 口 → 每口 ${POINTS_PER_FAMILY_MEMBER} 點`,
    },
    A: {
      label: '加項合計 (A)',
      points: aTotal,
      detail: `${fmt(a1Points)} + ${fmt(a2Points)} + ${fmt(a3Points)} = ${fmt(aTotal)}`,
    },
    B1: {
      label: '自有住宅 (B1)',
      points: b1Points,
      detail: input.hasRestrictedProperty
        ? `位於限制區域內 → 點數減半 (-1/2 × A)`
        : `非限制區域 → 不扣點`,
    },
    B2: {
      label: '借用次數 (B2)',
      points: b2Points,
      detail:
        input.priorBorrowCount === 0
          ? `未曾借用 → 不扣點`
          : input.priorBorrowCount === 1
            ? `借用 1 次 → ${input.hasRestrictedProperty ? '1/2 × B1' : '-1/2 × A'}`
            : `借用 ${input.priorBorrowCount} 次 → ${input.hasRestrictedProperty ? '2/3 × B1' : '-2/3 × A'}`,
    },
    B: {
      label: '減項合計 (B)',
      points: bTotal,
      detail: `${fmt(b1Points)} + ${fmt(b2Points)} = ${fmt(bTotal)}`,
    },
    C: {
      label: '合計積點 (C = A − B)',
      points: cTotal,
      detail: `${fmt(aTotal)} − ${fmt(Math.abs(bTotal))} = ${fmt(cTotal)}`,
    },
  };
}
