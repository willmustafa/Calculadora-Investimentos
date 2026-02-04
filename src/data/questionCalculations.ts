export type CalculationResult = {
  label: string
  value: string
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

const futureValue = (pv: number, pmt: number, months: number, rate: number) => {
  if (rate === 0) {
    return pv + pmt * months
  }
  const factor = Math.pow(1 + rate, months)
  return pv * factor + pmt * ((factor - 1) / rate)
}

const presentValueFromPayment = (pmt: number, months: number, rate: number) => {
  if (rate === 0) {
    return pmt * months
  }
  return pmt * ((1 - Math.pow(1 + rate, -months)) / rate)
}

const paymentFromPresentValue = (pv: number, months: number, rate: number) => {
  if (rate === 0) {
    return pv / months
  }
  return (pv * rate) / (1 - Math.pow(1 + rate, -months))
}

type CalculationInput = {
  questionIndex: number
  values: number[]
  rate: number
}

export const calculatePresetQuestionResult = (
  input: CalculationInput,
): CalculationResult | null => {
  const { questionIndex, values, rate } = input
  console.log(questionIndex, input)
  switch (questionIndex) {
    case 0: {
      const [pv, months] = values
      if (!Number.isFinite(pv) || !Number.isFinite(months)) {
        return null
      }
      const fv = futureValue(pv, 0, months, rate)
      return { label: 'Valor final', value: formatCurrency(fv) }
    }
    case 1: {
      const [fvTarget, years] = values
      if (!Number.isFinite(fvTarget) || !Number.isFinite(years)) {
        return null
      }
      const months = years * 12
      const pv = rate === 0 ? fvTarget : fvTarget / Math.pow(1 + rate, months)
      return { label: 'Aplicação inicial', value: formatCurrency(pv) }
    }
    case 2: {
      const [pv, fvTarget] = values
      if (!Number.isFinite(pv) || !Number.isFinite(fvTarget)) {
        return null
      }
      if (rate === 0) {
        const months = fvTarget <= pv ? 0 : Number.NaN
        return { label: 'Tempo estimado', value: formatDurationMonths(months) }
      }
      const months = Math.log(fvTarget / pv) / Math.log(1 + rate)
      return { label: 'Tempo estimado', value: formatDurationMonths(months) }
    }
    case 3: {
      const [pv, pmt, months] = values
      if (!Number.isFinite(pv) || !Number.isFinite(pmt) || !Number.isFinite(months)) {
        return null
      }
      const fv = futureValue(pv, pmt, months, rate)
      return { label: 'Valor final', value: formatCurrency(fv) }
    }
    case 4: {
      const [fvTarget, months] = values
      if (!Number.isFinite(fvTarget) || !Number.isFinite(months)) {
        return null
      }
      if (months <= 0) {
        return null
      }
      const pmt =
        rate === 0
          ? fvTarget / months
          : (fvTarget * rate) / (Math.pow(1 + rate, months) - 1)
      return { label: 'Aporte mensal', value: `${formatCurrency(pmt)} /mês` }
    }
    case 5: {
      const [pmt, fvTarget] = values
      if (!Number.isFinite(pmt) || !Number.isFinite(fvTarget)) {
        return null
      }
      if (pmt <= 0) {
        return null
      }
      const months =
        rate === 0
          ? fvTarget / pmt
          : Math.log((fvTarget * rate) / pmt + 1) / Math.log(1 + rate)
      return { label: 'Tempo estimado', value: formatDurationMonths(months) }
    }
    case 6: {
      const [pv, years] = values
      if (!Number.isFinite(pv) || !Number.isFinite(years)) {
        return null
      }
      const months = years * 12
      if (months <= 0) {
        return null
      }
      const pmt = paymentFromPresentValue(pv, months, rate)
      return { label: 'Retirada mensal', value: `${formatCurrency(pmt)} /mês` }
    }
    case 7: {
      const [pmt, years] = values
      if (!Number.isFinite(pmt) || !Number.isFinite(years)) {
        return null
      }
      const months = years * 12
      if (months <= 0) {
        return null
      }
      const pv = presentValueFromPayment(pmt, months, rate)
      return { label: 'Patrimônio inicial', value: formatCurrency(pv) }
    }
    default:
      return null
  }
}
