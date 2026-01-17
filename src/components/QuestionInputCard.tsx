import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type QuestionInputCardProps = {
  isDark: boolean
  submitted: boolean
  query: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
  onShowPresets: () => void
  children?: ReactNode
}

function QuestionInputCard({
  isDark,
  submitted,
  query,
  onQueryChange,
  onSubmit,
  onShowPresets,
  children,
}: QuestionInputCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!textareaRef.current) {
      return
    }
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  }, [query])

  return (
    <div
      className={`rounded-[32px] border p-7 shadow-[0_28px_70px_rgba(15,23,42,0.15)] backdrop-blur ${
        isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/70 bg-white/70'
      }`}
    >
      <div className="flex justify-between items-center">
        <label
            className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
        >
          O que você quer calcular?
        </label>
        {submitted && (
            <div className="flex items-center justify-center">
              <button
                  type="button"
                  onClick={onShowPresets}
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
      </div>
      <div className="relative mt-4">
        <textarea
          ref={textareaRef}
          rows={1}
          className={`min-h-[88px] w-full resize-none overflow-hidden rounded-3xl border p-6 pr-16 text-xl shadow-inner outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 ${
            isDark
              ? 'border-white/10 bg-slate-950/60 text-slate-100 placeholder:text-slate-400'
              : 'border-slate-200/80 bg-white/80 text-slate-800 placeholder:text-slate-400'
          }`}
          placeholder="Ex: Se eu investir R$ 500 por mês, quanto vou ter em 5 anos?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <button
          type="button"
          aria-label="Enviar"
          onClick={onSubmit}
          className={`absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition ${
            isDark
              ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25'
              : 'border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
          }`}
        >
          <span aria-hidden="true">➜</span>
        </button>
      </div>

      {!submitted && children}
    </div>
  )
}

export default QuestionInputCard
