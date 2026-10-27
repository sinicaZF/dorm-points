import { Plus, Trash2, User, Heart, Users } from 'lucide-react';
import type { FamilyMember, FamilyMemberKind } from '@/lib/calc';

interface FamilyMembersProps {
  members: FamilyMember[];
  onChange: (members: FamilyMember[]) => void;
}

const KIND_LABELS: Record<FamilyMemberKind, string> = {
  spouse: '配偶',
  father: '父',
  mother: '母',
  child: '子女',
};

const KIND_OPTIONS: { value: FamilyMemberKind; label: string }[] = [
  { value: 'spouse', label: '配偶' },
  { value: 'father', label: '父' },
  { value: 'mother', label: '母' },
  { value: 'child', label: '子女' },
];

const KIND_ICONS: Record<FamilyMemberKind, typeof User> = {
  spouse: Heart,
  father: User,
  mother: User,
  child: Users,
};

let counter = 0;
const newId = () => `fm_${Date.now()}_${counter++}`;

export function FamilyMembers({ members, onChange }: FamilyMembersProps) {
  const addMember = () => {
    onChange([...members, { id: newId(), kind: 'child', name: '' }]);
  };
  const removeMember = (id: string) => {
    onChange(members.filter((m) => m.id !== id));
  };
  const updateMember = (id: string, patch: Partial<FamilyMember>) => {
    onChange(members.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  return (
    <div className="flex flex-col gap-3">
      {members.length === 0 && (
        <p className="text-sm text-slate-400">尚無眷口資料，點擊下方新增。</p>
      )}
      {members.map((m) => {
        const Icon = KIND_ICONS[m.kind];
        return (
          <div
            key={m.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-2 text-sky-500">
              <Icon size={18} />
              <select
                value={m.kind}
                onChange={(e) =>
                  updateMember(m.id, { kind: e.target.value as FamilyMemberKind })
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={m.name}
              placeholder="姓名"
              onChange={(e) => updateMember(m.id, { name: e.target.value })}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => removeMember(m.id)}
              className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
              aria-label={`移除${KIND_LABELS[m.kind]}`}
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">移除</span>
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={addMember}
        className="flex items-center justify-center gap-2 self-start rounded-xl border border-dashed border-sky-300 bg-sky-50/50 px-4 py-2.5 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-50"
      >
        <Plus size={16} />
        新增眷口
      </button>
    </div>
  );
}
