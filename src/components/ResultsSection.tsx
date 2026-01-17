type ChartItem = {
  label: string
  value: number
}

type ResultsSectionProps = {
  isDark: boolean
  submitted: boolean
  displayedQuestion: string
  chartItems: ChartItem[]
  advancedOpen: boolean
  onToggleAdvanced: () => void
}

function ResultsSection({
  isDark,
  submitted,
  displayedQuestion,
  chartItems,
  advancedOpen,
  onToggleAdvanced,
}: ResultsSectionProps) {
  if (!submitted) {
    return null
  }

  return (
    <>
      <div className="absolute inset-x-0 top-24 flex flex-col items-center text-center transition-all duration-400 translate-y-0 opacity-100">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.4em] ${
            isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'
          }`}
        >
          Pergunta enviada
        </p>
        <h2
          className={`mt-3 max-w-2xl text-balance font-display text-2xl sm:text-3xl ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {displayedQuestion}
        </h2>
      </div>

      <div className="absolute inset-x-0 top-40 transition-all duration-400 translate-y-0 opacity-100">
        <div className="mx-auto grid max-w-5xl gap-6 pt-16 sm:grid-cols-[1.1fr_0.9fr]">
          <div
            className={`rounded-[28px] border p-6 shadow-[0_24px_50px_rgba(15,23,42,0.2)] ${
              isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/70 bg-white/80'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.32em] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Valor estimado
                </p>
                <p
                  className={`mt-3 text-4xl font-semibold ${
                    isDark ? 'text-emerald-200' : 'text-emerald-700'
                  }`}
                >
                  R$ 182.450
                </p>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Resultado considerando reinvestimento e taxas atuais.
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                8,7% a.a
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleAdvanced}
              className={`mt-6 flex w-full items-center justify-between border-b pb-2 text-left text-xs font-semibold uppercase tracking-[0.28em] transition ${
                isDark
                  ? 'border-white/10 text-slate-400 hover:text-emerald-200'
                  : 'border-slate-200 text-slate-500 hover:text-emerald-700'
              }`}
            >
              Configurações avançadas
              <span aria-hidden="true">{advancedOpen ? '−' : '+'}</span>
            </button>

            <div
              className={`grid gap-4 overflow-hidden pt-4 text-sm transition-all duration-500 ${
                advancedOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Taxa de juros (% a.a)
                </label>
                <input
                  type="number"
                  defaultValue={8.7}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDark
                      ? 'border-white/10 bg-slate-950/40 text-slate-100'
                      : 'border-slate-200 bg-white/80 text-slate-800'
                  }`}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  CDI (% a.a)
                </label>
                <input
                  type="number"
                  defaultValue={11.1}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDark
                      ? 'border-white/10 bg-slate-950/40 text-slate-100'
                      : 'border-slate-200 bg-white/80 text-slate-800'
                  }`}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Inflação (% a.a)
                </label>
                <input
                  type="number"
                  defaultValue={4.2}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDark
                      ? 'border-white/10 bg-slate-950/40 text-slate-100'
                      : 'border-slate-200 bg-white/80 text-slate-800'
                  }`}
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Taxa de administração (%)
                </label>
                <input
                  type="number"
                  defaultValue={0.5}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                    isDark
                      ? 'border-white/10 bg-slate-950/40 text-slate-100'
                      : 'border-slate-200 bg-white/80 text-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-[28px] border p-6 shadow-[0_24px_50px_rgba(15,23,42,0.2)] ${
              isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/70 bg-white/80'
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.32em] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Comparativo
            </p>
            <h3
              className={`mt-2 text-lg font-semibold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Tipos de investimento
            </h3>
            <div className="mt-6 space-y-4">
              {chartItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className={`h-3 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultsSection
