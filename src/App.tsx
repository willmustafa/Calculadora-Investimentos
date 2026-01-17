import { useState } from 'react'

const questionGroups = [
  {
    id: 'aplicacao-unica',
    label: 'Aplicação inicial única',
    description: 'Aporte único e rendimento no tempo.',
    questions: [
      'Se eu aplicar R$ 15.000 hoje, quanto terei em 36 meses a 0,9% ao mês?',
      'Quanto rende R$ 5.000 em 2 anos com 12% ao ano?',
      'Qual o valor final de um aporte único de R$ 25.000 em 5 anos?',
    ],
  },
  {
    id: 'aplicacao-mensal',
    label: 'Aplicação mensal',
    description: 'Aportes constantes ao longo do tempo.',
    questions: [
      'Se eu investir R$ 600 por mês, quanto terei em 7 anos a 0,8% ao mês?',
      'Quanto preciso aportar por mês para chegar a R$ 200.000 em 8 anos?',
      'Se eu aportar R$ 1.200 por mês, qual o total em 10 anos?',
    ],
  },
  {
    id: 'retirada-mensal',
    label: 'Retirada mensal (aposentadoria)',
    description: 'Quanto posso retirar mantendo o saldo.',
    questions: [
      'Com R$ 400.000 investidos, quanto posso retirar por mês por 20 anos?',
      'Qual saldo preciso para retirar R$ 4.000 por mês por 25 anos?',
      'Se eu retirar R$ 2.500 por mês, quanto dura um saldo de R$ 300.000?',
    ],
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeGroupId, setActiveGroupId] = useState(questionGroups[0].id)
  const [isDark, setIsDark] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const activeGroup =
    questionGroups.find((group) => group.id === activeGroupId) ??
    questionGroups[0]
  const displayedQuestion =
    query.trim() || 'Qual seria o valor final do meu investimento?'
  const chartItems = [
    { label: 'CDB', value: 78 },
    { label: 'LCI', value: 64 },
    { label: 'Tesouro', value: 55 },
    { label: 'Fundos', value: 42 },
  ]
  const handleReset = () => {
    setSubmitted(false)
    setAdvancedOpen(false)
    setQuery('')
  }

  return (
    <div
      className={`h-screen overflow-hidden ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="relative h-full w-full">
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_45%,#020617_100%)]'
              : 'bg-[radial-gradient(circle_at_top,#fff6e8_0%,#eef7f4_45%,#fef3e1_100%)]'
          }`}
        />
        <div
          className={`absolute -left-28 top-12 h-72 w-72 rounded-full blur-3xl float-slow ${
            isDark ? 'bg-amber-400/20' : 'bg-amber-200/70'
          }`}
        />
        <div
          className={`absolute -bottom-32 right-0 h-96 w-96 rounded-full blur-3xl float-slower ${
            isDark ? 'bg-emerald-400/20' : 'bg-emerald-200/70'
          }`}
        />
        <div
          className={`absolute inset-x-8 top-6 h-36 rounded-[45%] blur-2xl ${
            isDark
              ? 'border border-white/10 bg-white/5'
              : 'border border-white/80 bg-white/40'
          }`}
        />

        <main className="relative z-10 h-full w-full">
          <header className="absolute inset-x-6 top-6 flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'
              }`}
            >
              Invest Lab
            </span>
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                isDark
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20'
                  : 'border-slate-200 bg-white/80 text-slate-700 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              {isDark ? 'Tema claro' : 'Tema escuro'}
            </button>
          </header>

          <div className="relative mx-auto flex h-full max-w-6xl flex-col px-6">
            {submitted && (
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
            )}

            {submitted && (
              <div className="absolute inset-x-0 top-40 transition-all duration-400 translate-y-0 opacity-100">
                <div className="mx-auto grid max-w-5xl gap-6 pt-16 sm:grid-cols-[1.1fr_0.9fr]">
                  <div
                    className={`rounded-[28px] border p-6 shadow-[0_24px_50px_rgba(15,23,42,0.2)] ${
                      isDark
                        ? 'border-white/10 bg-slate-900/70'
                        : 'border-white/70 bg-white/80'
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
                        <p
                          className={`mt-2 text-sm ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          Resultado considerando reinvestimento e taxas atuais.
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                          isDark
                            ? 'bg-emerald-400/10 text-emerald-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        8,7% a.a
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAdvancedOpen((value) => !value)}
                      className={`mt-6 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        isDark
                          ? 'border-white/10 bg-slate-950/50 text-slate-100 hover:border-emerald-400/30'
                          : 'border-slate-200 bg-white/90 text-slate-800 hover:border-emerald-200'
                      }`}
                    >
                      Configurações avançadas
                      <span aria-hidden="true">{advancedOpen ? '−' : '+'}</span>
                    </button>

                    <div
                      className={`grid gap-4 overflow-hidden pt-4 text-sm transition-all duration-500 ${
                        advancedOpen
                          ? 'max-h-80 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Taxa de juros (% a.a)
                        </label>
                        <input
                          type="number"
                          defaultValue={8.7}
                          className={`rounded-2xl border px-3 py-2 text-sm outline-none ${
                            isDark
                              ? 'border-white/10 bg-slate-950/60 text-slate-100'
                              : 'border-slate-200 bg-white text-slate-800'
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
                          className={`rounded-2xl border px-3 py-2 text-sm outline-none ${
                            isDark
                              ? 'border-white/10 bg-slate-950/60 text-slate-100'
                              : 'border-slate-200 bg-white text-slate-800'
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
                          className={`rounded-2xl border px-3 py-2 text-sm outline-none ${
                            isDark
                              ? 'border-white/10 bg-slate-950/60 text-slate-100'
                              : 'border-slate-200 bg-white text-slate-800'
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
                          className={`rounded-2xl border px-3 py-2 text-sm outline-none ${
                            isDark
                              ? 'border-white/10 bg-slate-950/60 text-slate-100'
                              : 'border-slate-200 bg-white text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-[28px] border p-6 shadow-[0_24px_50px_rgba(15,23,42,0.2)] ${
                      isDark
                        ? 'border-white/10 bg-slate-900/70'
                        : 'border-white/70 bg-white/80'
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
                          <div
                            className={`h-3 rounded-full ${
                              isDark ? 'bg-white/5' : 'bg-slate-100'
                            }`}
                          >
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
            )}

            <div
              className={`absolute left-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                submitted
                  ? 'bottom-6 w-[min(100%,1100px)] -translate-x-1/2'
                  : 'top-1/2 w-[min(100%,900px)] -translate-x-1/2 -translate-y-1/2'
              }`}
            >
              <div
                className={`rounded-[32px] border p-7 shadow-[0_28px_70px_rgba(15,23,42,0.15)] backdrop-blur ${
                  isDark
                    ? 'border-white/10 bg-slate-900/70'
                    : 'border-white/70 bg-white/70'
                }`}
              >
                {submitted && (
                  <div className="mb-5 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                        isDark
                          ? 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700'
                      }`}
                    >
                      Ver perguntas pré-definidas
                    </button>
                  </div>
                )}
                {!submitted && (
                  <div className="mb-6 space-y-3 text-center fade-in">
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.4em] ${
                        isDark ? 'text-emerald-200/80' : 'text-emerald-700/80'
                      }`}
                    >
                      Simulador rápido
                    </p>
                    <h1
                      className={`text-balance font-display text-3xl sm:text-5xl ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      Calculadora de Investimentos
                    </h1>
                    <p
                      className={`text-sm sm:text-base ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Digite sua pergunta e obtenha um panorama do seu plano
                      financeiro.
                    </p>
                  </div>
                )}

                <label
                  className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  O que você quer calcular?
                </label>
                <div className="relative mt-4">
                  <textarea
                    className={`h-32 w-full resize-none rounded-3xl border p-6 pr-16 text-xl shadow-inner outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 ${
                      isDark
                        ? 'border-white/10 bg-slate-950/60 text-slate-100 placeholder:text-slate-400'
                        : 'border-slate-200/80 bg-white/80 text-slate-800 placeholder:text-slate-400'
                    }`}
                    placeholder="Ex: Se eu investir R$ 500 por mês, quanto vou ter em 5 anos?"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-label="Enviar"
                    onClick={() => setSubmitted(true)}
                    className={`absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition ${
                      isDark
                        ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25'
                        : 'border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    <span aria-hidden="true">➜</span>
                  </button>
                </div>

                {!submitted && (
                  <div className="mt-6 space-y-4">
                    <div
                      className={`flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Perguntas pré-preenchidas
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {questionGroups.map((group) => {
                        const isActive = group.id === activeGroupId
                        return (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => setActiveGroupId(group.id)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                              isActive
                                ? isDark
                                  ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-100 shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                                  : 'border-emerald-300 bg-emerald-100 text-emerald-900 shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                                : isDark
                                  ? 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-emerald-400/40 hover:text-emerald-200'
                                  : 'border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
                            }`}
                          >
                            {group.label}
                          </button>
                        )
                      })}
                    </div>
                    <div
                      className={`rounded-3xl border p-5 text-left ${
                        isDark
                          ? 'border-white/10 bg-slate-950/60'
                          : 'border-white/80 bg-white/80'
                      }`}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}
                          >
                            {activeGroup.label}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {activeGroup.description}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                            isDark
                              ? 'bg-emerald-400/10 text-emerald-200'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          Escolha uma pergunta
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {activeGroup.questions.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => setQuery(question)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
                              isDark
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-400/40 hover:bg-emerald-400/20'
                                : 'border-emerald-100 bg-emerald-50/70 text-emerald-900 hover:border-emerald-200 hover:bg-emerald-100/80'
                            }`}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
