
const monthFormatter = new Intl.DateTimeFormat('es-DO', { month: 'short' })

export function lastMonths(count) {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1)
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: monthFormatter.format(date).replace('.', '') }
  })
}

export function sumByMonth(items, months, amountKey) {
  const totals = Object.fromEntries(months.map((month) => [month.key, 0]))
  items.forEach((item) => {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (key in totals) totals[key] += Number(item[amountKey]) || 0
  })
  return months.map((month) => totals[month.key])
}

export const countBy = (items, key) => items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] || 0) + 1 }), {})