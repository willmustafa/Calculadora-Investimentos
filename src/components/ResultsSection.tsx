import { useEffect, useMemo, useState } from 'react'
import { questionGroups } from '../data/questionGroups'

type ChartItem = {
  label: string
  value: number
}

type ResultsSectionProps = {
  isDark: boolean
  submitted: boolean
  displayedQuestion: string
  isPresetQuestion: boolean
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
const QUESTION_VALUE_REGEX = /\d[\d.]*([,]\d+)?/g

const FLAT_PRESET_QUESTIONS = questionGroups.flatMap((group) => group.questions)

type CalculationResult = {
  label: string
  value: string
}

const parseNumberBR = (value: string): number => {
  const normalized = value.replace(/\./g, '').replace(',', '.')
  return Number(normalized)
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)

const formatDurationMonths = (months: number): string => {
  if (!Number.isFinite(months) || months <= 0) {
    return '—'
  }
  const rounded = Math.ceil(months)
  const monthLabel = rounded === 1 ? 'mês' : 'meses'
  if (rounded < 12) {
    return `${rounded} ${monthLabel}`
  }
  const years = rounded / 12
  const yearsLabel = years >= 1.5 ? 'anos' : 'ano'
  const yearsFormatted = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(years)
  return `${rounded} ${monthLabel} (~${yearsFormatted} ${yearsLabel})`
}

type QuestionToken = { type: 'text'; value: string } | { type: 'value'; value: string }

const splitQuestionTokens = (question: string): QuestionToken[] => {
  if (!question) {
    return []
  }

  const tokens: QuestionToken[] = []
  QUESTION_VALUE_REGEX.lastIndex = 0
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = QUESTION_VALUE_REGEX.exec(question)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: question.slice(lastIndex, match.index) })
    }
    tokens.push({ type: 'value', value: match[0] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < question.length) {
    tokens.push({ type: 'text', value: question.slice(lastIndex) })
  }

  return tokens
}

function ResultsSection({
  isDark,
  submitted,
  displayedQuestion,
  isPresetQuestion,
  chartItems,
  advancedOpen,
  onToggleAdvanced,
}: ResultsSectionProps) {
  const [advancedValues, setAdvancedValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(ADVANCED_FIELDS.map((field) => [field.id, field.defaultValue])),
  )
  const questionTokens = useMemo(
    () => (isPresetQuestion ? splitQuestionTokens(displayedQuestion) : []),
    [displayedQuestion, isPresetQuestion],
  )
  const [questionValues, setQuestionValues] = useState<string[]>([])

  useEffect(() => {
    if (!isPresetQuestion) {
      setQuestionValues([])
      return
    }
    const values = questionTokens
      .filter((token) => token.type === 'value')
      .map((token) => token.value)
    setQuestionValues(values)
  }, [isPresetQuestion, questionTokens])

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

  const calculationResult = useMemo<CalculationResult>(() => {
    const fallback: CalculationResult = {
      label: 'Resultado estimado',
      value: '—',
    }

    if (!isPresetQuestion) {
      return fallback
    }

    const questionIndex = FLAT_PRESET_QUESTIONS.indexOf(displayedQuestion)
    if (questionIndex === -1) {
      return fallback
    }

    const parsedValues = questionValues.map(parseNumberBR)
    const annualRate = parseNumberBR(advancedValues.rentabilidadeCdb ?? '0')
    const monthlyRate =
      Number.isFinite(annualRate) && annualRate > -100
        ? Math.pow(1 + annualRate / 100, 1 / 12) - 1
        : 0
    const rate = Number.isFinite(monthlyRate) ? monthlyRate : 0

    const futureValue = (pv: number, pmt: number, months: number) => {
      if (rate === 0) {
        return pv + pmt * months
      }
      const factor = Math.pow(1 + rate, months)
      return pv * factor + pmt * ((factor - 1) / rate)
    }

    const presentValueFromPayment = (pmt: number, months: number) => {
      if (rate === 0) {
        return pmt * months
      }
      return pmt * ((1 - Math.pow(1 + rate, -months)) / rate)
    }

    const paymentFromPresentValue = (pv: number, months: number) => {
      if (rate === 0) {
        return pv / months
      }
      return (pv * rate) / (1 - Math.pow(1 + rate, -months))
    }

    switch (questionIndex) {
      case 0: {
        const [pv, months] = parsedValues
        if (!Number.isFinite(pv) || !Number.isFinite(months)) {
          return fallback
        }
        const fv = futureValue(pv, 0, months)
        return { label: 'Valor final', value: formatCurrency(fv) }
      }
      case 1: {
        const [fvTarget, years] = parsedValues
        if (!Number.isFinite(fvTarget) || !Number.isFinite(years)) {
          return fallback
        }
        const months = years * 12
        const pv =
          rate === 0 ? fvTarget : fvTarget / Math.pow(1 + rate, months)
        return { label: 'Aplicação inicial', value: formatCurrency(pv) }
      }
      case 2: {
        const [pv, fvTarget] = parsedValues
        if (!Number.isFinite(pv) || !Number.isFinite(fvTarget)) {
          return fallback
        }
        if (rate === 0) {
          const months = fvTarget <= pv ? 0 : Number.NaN
          return { label: 'Tempo estimado', value: formatDurationMonths(months) }
        }
        const months = Math.log(fvTarget / pv) / Math.log(1 + rate)
        return { label: 'Tempo estimado', value: formatDurationMonths(months) }
      }
      case 3: {
        const [pv, pmt, months] = parsedValues
        if (!Number.isFinite(pv) || !Number.isFinite(pmt) || !Number.isFinite(months)) {
          return fallback
        }
        const fv = futureValue(pv, pmt, months)
        return { label: 'Valor final', value: formatCurrency(fv) }
      }
      case 4: {
        const [fvTarget, months] = parsedValues
        if (!Number.isFinite(fvTarget) || !Number.isFinite(months)) {
          return fallback
        }
        if (months <= 0) {
          return fallback
        }
        const pmt =
          rate === 0
            ? fvTarget / months
            : (fvTarget * rate) / (Math.pow(1 + rate, months) - 1)
        return { label: 'Aporte mensal', value: `${formatCurrency(pmt)} /mês` }
      }
      case 5: {
        const [pmt, fvTarget] = parsedValues
        if (!Number.isFinite(pmt) || !Number.isFinite(fvTarget)) {
          return fallback
        }
        if (pmt <= 0) {
          return fallback
        }
        const months =
          rate === 0
            ? fvTarget / pmt
            : Math.log((fvTarget * rate) / pmt + 1) / Math.log(1 + rate)
        return { label: 'Tempo estimado', value: formatDurationMonths(months) }
      }
      case 6: {
        const [pv, years] = parsedValues
        if (!Number.isFinite(pv) || !Number.isFinite(years)) {
          return fallback
        }
        const months = years * 12
        if (months <= 0) {
          return fallback
        }
        const pmt = paymentFromPresentValue(pv, months)
        return { label: 'Retirada mensal', value: `${formatCurrency(pmt)} /mês` }
      }
      case 7: {
        const [pmt, years] = parsedValues
        if (!Number.isFinite(pmt) || !Number.isFinite(years)) {
          return fallback
        }
        const months = years * 12
        if (months <= 0) {
          return fallback
        }
        const pv = presentValueFromPayment(pmt, months)
        return { label: 'Patrimônio inicial', value: formatCurrency(pv) }
      }
      default:
        return fallback
    }
  }, [advancedValues, displayedQuestion, isPresetQuestion, questionValues])

  if (!submitted) {
    return null
  }

  let valueIndex = -1
  const questionContent = isPresetQuestion ? (
    <span className="whitespace-pre-wrap">
      {questionTokens.map((token, index) => {
        if (token.type === 'text') {
          return <span key={`text-${index}`}>{token.value}</span>
        }

        valueIndex += 1
        const currentValueIndex = valueIndex
        const currentValue = questionValues[currentValueIndex] ?? token.value
        const inputWidth = Math.max(currentValue.length * 1.25, 1)

        return (
          <input
            key={`value-${index}`}
            type="text"
            inputMode="decimal"
            value={currentValue}
            onChange={(event) => {
              const nextValue = event.target.value
              setQuestionValues((prev) => {
                const updated = [...prev]
                updated[currentValueIndex] = nextValue
                return updated
              })
            }}
            style={{ width: `${inputWidth}ch`, minWidth: '10ch' }}
            className={`mx-1 rounded-xl border px-2 py-1 text-center font-display text-2xl sm:text-3xl font-semibold align-middle ${
              isDark
                ? 'border-white/10 bg-slate-950/60 text-emerald-100'
                : 'border-emerald-200/70 bg-white text-emerald-900'
            }`}
          />
        )
      })}
    </span>
  ) : (
    displayedQuestion
  )

  return (
    <div className="absolute inset-x-0 top-24 transition-all duration-400 translate-y-0 opacity-100">
      <div className="flex flex-col items-center text-center">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.4em] ${
            isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'
          }`}
        >
          Pergunta enviada
        </p>
        <h2
          className={`mt-4 text-balance font-display text-2xl sm:text-3xl leading-12 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {questionContent}
        </h2>
      </div>

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
                      {calculationResult.label}
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
                  {calculationResult.value}
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
  )
}

export default ResultsSection
