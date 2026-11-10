export function createSingleFlight() {
  let pending = null
  return (operation) => {
    if (!pending) {
      pending = Promise.resolve().then(operation).finally(() => {
        pending = null
      })
    }
    return pending
  }
}
