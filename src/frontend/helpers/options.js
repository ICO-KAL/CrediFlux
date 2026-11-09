
export const optionsFromValues = (values, label = (value) => value) =>
  values.map((value) => ({ value, label: label(value) }))

export const toOptions = (loader, label) => async () => {
  const options = []
  let page = 1
  let total
  do {
    const result = await loader({ page, limit: 100 })
    total = result.total
    if (result.items.length === 0 && options.length < total) {
      throw new Error('No se pudieron cargar todas las opciones.')
    }
    options.push(...result.items.map((item) => ({ value: item._id, label: label(item) })))
    page += 1
  } while (options.length < total)
  return options
}
