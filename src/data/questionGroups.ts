export type QuestionGroup = {
  id: string
  label: string
  description: string
  questions: string[]
}

export const questionGroups: QuestionGroup[] = [
  {
    id: 'aplicacao-unica',
    label: 'Aplicação inicial única',
    description: 'Aporte único e rendimento no tempo.',
    questions: [
      'Se eu aplicar R$ 15.000 hoje, quanto terei em 36 meses?',
      'Quanto eu preciso aplicar hoje para que eu tenha R$ 80.000 em 5 anos?',
      'Por quanto tempo eu preciso deixar R$ 100.000 investidos para atingir R$ 120.000?',
    ],
  },
  {
    id: 'aplicacao-mensal',
    label: 'Aplicação mensal',
    description: 'Aportes constantes ao longo do tempo.',
    questions: [
      'Se eu investir R$ 50.000 e dar aportes mensais de R$ 1.000, quanto terei depois de 24 meses?',
      'Quanto preciso aplicar mensalmente para conseguir R$ 8.000 em 12 meses?',
      'Por quanto tempo preciso aplicar R$ 800 mensalmente para chegar ao meu objetivo de R$ 4.000?',
    ],
  },
  {
    id: 'retirada-mensal',
    label: 'Retirada mensal (aposentadoria)',
    description: 'Quanto posso retirar mantendo o saldo.',
    questions: [
      'Se eu tiver R$ 1.000.000 investidos, por quanto tempo posso retirar dinheiro até zerar a conta em 10 anos?',
      'Quanto eu preciso ter investido para retirar R$ 3.500 por mês por 25 anos?',
    ],
  },
]
