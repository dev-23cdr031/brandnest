import type { LucideIcon } from 'lucide-react'

type TabItem = {
  id: string
  label: string
  icon: LucideIcon
}

type TabsProps = {
  tabs: readonly TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`mt-8 grid gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 ${className}`}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === id ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'text-white/65 hover:bg-white/8'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}