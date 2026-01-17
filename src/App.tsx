import { useState } from 'react'
import HeaderBar from './components/HeaderBar'
import PresetQuestions from './components/PresetQuestions'
import QuestionInputCard from './components/QuestionInputCard'
import ResultsSection from './components/ResultsSection'

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
          <HeaderBar
            isDark={isDark}
            onToggleTheme={() => setIsDark((value) => !value)}
          />

          <div className="relative mx-auto flex h-full max-w-3/4 flex-col px-6">
            <ResultsSection
              isDark={isDark}
              submitted={submitted}
              displayedQuestion={displayedQuestion}
              chartItems={chartItems}
              advancedOpen={advancedOpen}
              onToggleAdvanced={() => setAdvancedOpen((value) => !value)}
            />

            <div
              className={`absolute w-full left-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                submitted
                  ? 'bottom-6 w-[min(100%,1100px)] -translate-x-1/2'
                  : 'top-1/2 w-[min(100%,900px)] -translate-x-1/2 -translate-y-1/2'
              }`}
            >
              <QuestionInputCard
                isDark={isDark}
                submitted={submitted}
                query={query}
                onQueryChange={setQuery}
                onSubmit={() => setSubmitted(true)}
                onShowPresets={handleReset}
              >
                <PresetQuestions
                  isDark={isDark}
                  questionGroups={questionGroups}
                  activeGroupId={activeGroupId}
                  onSelectGroup={setActiveGroupId}
                  onSelectQuestion={setQuery}
                />
              </QuestionInputCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
