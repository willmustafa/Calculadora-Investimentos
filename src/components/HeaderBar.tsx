type HeaderBarProps = {
  isDark: boolean
  onToggleTheme: () => void
}

function HeaderBar({ isDark, onToggleTheme }: HeaderBarProps) {
  return (
    <header className="absolute z-10 inset-x-0 top-6">
      <div className="flex items-center justify-between max-w-3/4 mx-auto">
          <span
              className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                  isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'
              }`}
          >
        Calculadora de Investimentos
      </span>
          <button
              type="button"
              onClick={onToggleTheme}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                  isDark
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20'
                      : 'border-slate-200 bg-white/80 text-slate-700 hover:border-emerald-200 hover:text-emerald-700'
              }`}
          >
              {isDark ? 'Tema claro' : 'Tema escuro'}
          </button>
      </div>
    </header>
  )
}

export default HeaderBar
