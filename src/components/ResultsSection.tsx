import { useEffect, useState } from 'react'

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

const ADVANCED_FIELDS = [
  { id: 'selicEfetiva', label: 'Selic efetiva (% a.a)', defaultValue: '10.50', bcbSeriesId: 11 },
  { id: 'cdi', label: 'CDI (% a.a)', defaultValue: '10.40', bcbSeriesId: 12 },
  { id: 'ipca', label: 'IPCA (% a.a)', defaultValue: '4.20', bcbSeriesId: 433 },
  { id: 'tr', label: 'TR (% a.a)', defaultValue: '1.60', bcbSeriesId: 226 },
  { id: 'tesouroPrefixado', label: 'Juro nominal do Tesouro Prefixado (% a.a)', defaultValue: '11.20' },
  { id: 'taxaCustodiaB3', label: 'Taxa de custodia da B3 (% a.a)', defaultValue: '0.20' },
  { id: 'tesouroIpca', label: 'Juro real do Tesouro IPCA+ (% a.a)', defaultValue: '5.30' },
  { id: 'taxaAdmFundoDi', label: 'Taxa de administracao do Fundo DI (% a.a)', defaultValue: '0.40' },
  { id: 'rentabilidadeCdb', label: 'Rentabilidade do CDB (% a.a)', defaultValue: '12.10' },
  { id: 'rentabilidadeFundoDi', label: 'Rentabilidade do Fundo DI (% a.a)', defaultValue: '10.20' },
  { id: 'rentabilidadeLciLca', label: 'Rentabilidade da LCI/LCA (% a.a)', defaultValue: '9.80' },
  { id: 'rentabilidadePoupanca', label: 'Rentabilidade da Poupanca (% a.a)', defaultValue: '6.20' },
]

const BCB_CACHE_KEY = 'bcb-series-cache'
const BCB_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000

function ResultsSection({
  isDark,
  submitted,
  displayedQuestion,
  chartItems,
  advancedOpen,
  onToggleAdvanced,
}: ResultsSectionProps) {
  const [advancedValues, setAdvancedValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(ADVANCED_FIELDS.map((field) => [field.id, field.defaultValue])),
  )

  useEffect(() => {
    const loadBcbSeries = async () => {
      const fieldsFromBcb = ADVANCED_FIELDS.filter((field) => field.bcbSeriesId)
      if (fieldsFromBcb.length === 0) {
        return
      }

      try {
        const cachedRaw = localStorage.getItem(BCB_CACHE_KEY)
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as {
            timestamp?: number
            values?: Record<string, string>
          }
          if (
            cached.timestamp &&
            Date.now() - cached.timestamp < BCB_CACHE_TTL_MS &&
            cached.values
          ) {
            setAdvancedValues((prev) => ({
              ...prev,
              ...cached.values,
            }))
            return
          }
        }

        const responses = await Promise.all(
          fieldsFromBcb.map(async (field) => {
            const response = await fetch(
              `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${field.bcbSeriesId}/dados/ultimos/1?formato=json`,
            )
            if (!response.ok) {
              throw new Error(`BCB ${field.bcbSeriesId} fetch failed`)
            }
            const data = (await response.json()) as Array<{ valor?: string }>
            const rawValue = data?.[0]?.valor
            if (!rawValue) {
              throw new Error(`BCB ${field.bcbSeriesId} missing value`)
            }
            const parsedValue = Number(rawValue.replace(',', '.'))
            if (Number.isNaN(parsedValue)) {
              throw new Error(`BCB ${field.bcbSeriesId} invalid value`)
            }
            return { id: field.id, value: parsedValue.toFixed(2) }
          }),
        )

        const cacheValues = Object.fromEntries(
          responses.map((item) => [item.id, item.value]),
        ) as Record<string, string>
        if (Object.keys(cacheValues).length > 0) {
          setAdvancedValues((prev) => ({
            ...prev,
            ...cacheValues,
          }))
          localStorage.setItem(
            BCB_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), values: cacheValues }),
          )
        }
      } catch (error) {
        console.warn('BCB fetch failed', error)
      }
    }

    void loadBcbSeries()
  }, [])

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
          className={`mt-4 text-balance font-display text-2xl sm:text-3xl ${
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
              <div className="flex justify-between items-center w-full">
                  <p
                      className={`text-xs font-semibold uppercase tracking-[0.32em] ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                  >
                      Valor estimado
                  </p>
                  <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                          isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                      }`}
                  >
                    CDB
                  </span>
              </div>

              <div className="flex items-start justify-between gap-4 w-full">

                <div>

                <p
                  className={`mt-4 text-6xl font-semibold ${
                    isDark ? 'text-emerald-200' : 'text-emerald-700'
                  }`}
                >
                  R$ 182.450
                </p>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Resultado considerando reinvestimento e taxas atuais.
                </p>
              </div>
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
                advancedOpen
                  ? 'max-h-[20vh] opacity-100 overflow-y-auto pr-2'
                  : 'max-h-0 opacity-0'
              }`}
            >
              {ADVANCED_FIELDS.map((field) => (
                <div key={field.label} className="grid gap-2 sm:grid-cols-2">
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={advancedValues[field.id]}
                    onChange={(event) =>
                      setAdvancedValues((prev) => ({
                        ...prev,
                        [field.id]: event.target.value,
                      }))
                    }
                    step="0.01"
                    className={`rounded-xl border px-3 py-2 text-sm outline-none ${
                      isDark
                        ? 'border-white/10 bg-slate-950/40 text-slate-100'
                        : 'border-slate-200 bg-white/80 text-slate-800'
                    }`}
                  />
                </div>
              ))}
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
