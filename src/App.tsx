import { useState } from 'react';
import {
  Calculator,
  Clock,
  Award,
  Users,
  Home,
  Repeat,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NumberField } from '@/components/Fields';
import { FamilyMembers } from '@/components/FamilyMembers';
import {
  calculate,
  type CalcInput,
  type CalcResult,
  type FamilyMember,
} from '@/lib/calc';

const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2));

function SectionCard({
  index,
  icon: Icon,
  title,
  subtitle,
  children,
  defaultOpen = true,
}: {
  index: string;
  icon: typeof Clock;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-sky-500">{index}</span>
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          </div>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-slate-100 px-5 py-5">{children}</div>}
    </section>
  );
}

function ResultRow({
  label,
  result,
  emphasize,
  positive,
}: {
  label: string;
  result: { points: number; detail: string };
  emphasize?: boolean;
  positive?: boolean;
}) {
  const pointColor = positive
    ? 'text-emerald-600'
    : result.points < 0
      ? 'text-rose-500'
      : 'text-slate-800';
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
        emphasize ? 'bg-sky-50/70 ring-1 ring-sky-100' : ''
      }`}
    >
      <div className="min-w-0">
        <p className={`text-sm font-medium ${emphasize ? 'text-slate-800' : 'text-slate-600'}`}>
          {label}
        </p>
        <p className="truncate text-xs text-slate-400">{result.detail}</p>
      </div>
      <p className={`flex-shrink-0 text-lg font-bold tabular-nums ${pointColor}`}>
        {fmt(result.points)}
      </p>
    </div>
  );
}

let propCounter = 0;
const newPropId = () => `prop_${Date.now()}_${propCounter++}`;

function App() {
  const [yearsOfService, setYearsOfService] = useState(0);
  const [monthsOfService, setMonthsOfService] = useState(0);
  const [baseSalary, setBaseSalary] = useState(0);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [hasRestrictedProperty, setHasRestrictedProperty] = useState(false);
  const [priorBorrowCount, setPriorBorrowCount] = useState(0);

  const input: CalcInput = {
    yearsOfService,
    monthsOfService,
    baseSalary,
    familyMembers,
    hasRestrictedProperty,
    priorBorrowCount,
  };

  const result: CalcResult = calculate(input);

  const reset = () => {
    setYearsOfService(0);
    setMonthsOfService(0);
    setBaseSalary(0);
    setFamilyMembers([]);
    setHasRestrictedProperty(false);
    setPriorBorrowCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-sky-50/40">
      {/* Header */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200">
              <Calculator size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">宿舍申請積點試算</h1>
              <p className="text-xs text-slate-400">Dormitory Application Points Calculator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">重填</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Input form */}
          <div className="flex flex-col gap-5">
            <SectionCard
              index="A1"
              icon={Clock}
              title="服務年資"
              subtitle="本院編制內年資，每滿半年 1 點"
            >
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  label="任職年數"
                  value={yearsOfService}
                  onChange={setYearsOfService}
                  min={0}
                  suffix="年"
                  placeholder="0"
                />
                <NumberField
                  label="任職月數"
                  value={monthsOfService}
                  onChange={setMonthsOfService}
                  min={0}
                  max={11}
                  suffix="月"
                  placeholder="0"
                  hint="不滿半年者不計"
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                年資計算至今年 12 月 31 日止；年資中斷者前後得合併計算。
              </p>
            </SectionCard>

            <SectionCard
              index="A2"
              icon={Award}
              title="職級"
              subtitle="按本俸每千元 1 點（小數點不計）"
            >
              <NumberField
                label="本俸金額"
                value={baseSalary}
                onChange={setBaseSalary}
                min={0}
                suffix="元"
                placeholder="0"
              />
            </SectionCard>

            <SectionCard
              index="A3"
              icon={Users}
              title="眷口"
              subtitle="配偶、未成年子女、扶養之成年身心障礙子女、父母（以一方為限），每口 4 點"
            >
              <FamilyMembers members={familyMembers} onChange={setFamilyMembers} />
              <p className="mt-3 text-xs text-slate-400">
                需檢附申請期限 6 個月內之戶籍謄本；外籍人士附外僑居留證影本。
              </p>
            </SectionCard>

            <SectionCard
              index="B"
              icon={Home}
              title="自有住宅 / 借用次數"
              subtitle="位於限制區域內之自有住宅或曾借用宿舍將扣點"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasRestrictedProperty}
                  onChange={(e) => setHasRestrictedProperty(e.target.checked)}
                  className="h-5 w-5 rounded-md border-slate-300 text-sky-500 focus:ring-sky-300"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    申請人或配偶名下有自有住宅（限制區域內）
                  </p>
                  <p className="text-xs text-slate-400">
                    文山、大安、中正、中山、萬華、大同區、深坑、汐止等地 → 點數減半
                  </p>
                </div>
              </label>

              <div className="mt-4">
                <NumberField
                  label="曾借用一般多房間職務宿舍次數"
                  value={priorBorrowCount}
                  onChange={setPriorBorrowCount}
                  min={0}
                  suffix="次"
                  placeholder="0"
                  hint="自民國 92 年起算；1 次扣 1/2，2 次以上扣 2/3"
                />
              </div>
            </SectionCard>
          </div>

          {/* Right: Result panel */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 to-cyan-50/40 px-5 py-4">
                <Sparkles size={18} className="text-sky-500" />
                <h2 className="text-base font-semibold text-slate-800">試算結果</h2>
              </div>

              <div className="flex flex-col gap-2 p-4">
                <p className="px-1 text-xs font-semibold uppercase tracking-wider text-sky-500">
                  加項 A
                </p>
                <ResultRow label="A1 服務年資" result={result.A1} positive />
                <ResultRow label="A2 職級" result={result.A2} positive />
                <ResultRow label="A3 眷口" result={result.A3} positive />
                <ResultRow label="A 加項合計" result={result.A} emphasize positive />

                <div className="my-1 h-px bg-slate-100" />

                <p className="px-1 text-xs font-semibold uppercase tracking-wider text-rose-400">
                  減項 B
                </p>
                <ResultRow label="B1 自有住宅" result={result.B1} />
                <ResultRow label="B2 借用次數" result={result.B2} />
                <ResultRow label="B 減項合計" result={result.B} />

                <div className="my-1 h-px bg-slate-100" />

                <div className="rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 p-4 text-white shadow-lg shadow-sky-200">
                  <div className="flex items-center gap-2">
                    <Repeat size={16} className="opacity-90" />
                    <p className="text-sm font-medium opacity-90">合計積點 C = A − B</p>
                  </div>
                  <p className="mt-2 text-4xl font-bold tabular-nums">
                    {fmt(result.C.points)}
                    <span className="ml-1.5 text-base font-normal opacity-80">點</span>
                  </p>
                  <p className="mt-1 text-xs opacity-80">{result.C.detail}</p>
                </div>
              </div>
            </div>

            <p className="mt-3 px-2 text-center text-xs text-slate-400">
              本試算結果僅供參考，實際積點以宿舍管理委員會審核為準。
            </p>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400">
        宿舍申請積點試算工具 · 依宿舍管委會積點標準製作
      </footer>
    </div>
  );
}

export default App;
