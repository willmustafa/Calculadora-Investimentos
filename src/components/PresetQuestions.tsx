type QuestionGroup = {
  id: string
  label: string
  description: string
  questions: string[]
}

type PresetQuestionsProps = {
  isDark: boolean
  questionGroups: QuestionGroup[]
  activeGroupId: string
  onSelectGroup: (id: string) => void
  onSelectQuestion: (question: string) => void
}

function PresetQuestions({
  isDark,
  questionGroups,
  activeGroupId,
  onSelectGroup,
  onSelectQuestion,
}: PresetQuestionsProps) {
  const activeGroup = questionGroups.find((group) => group.id === activeGroupId)

  return (
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
              onClick={() => onSelectGroup(group.id)}
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
      {activeGroup ? (
        <div
          key={activeGroup.id}
          className={`rounded-3xl border p-5 text-left ${
            isDark
              ? 'border-white/10 bg-slate-950/60'
              : 'border-white/80 bg-white/80'
          } preset-reveal`}
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
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
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
                onClick={() => onSelectQuestion(question)}
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
      ) : null}
    </div>
  )
}

export default PresetQuestions
