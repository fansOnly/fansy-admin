const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000000),
  current: 0
}

const ID_INJECTION_KEY = Symbol('ID_INJECTION_KEY')

export const useId = (deterministicId = '') => {
  const idInjection = inject(ID_INJECTION_KEY, defaultIdInjection)
  const idRef = computed(() => unref(deterministicId) || `id-${idInjection.prefix}-${++idInjection.current}`)

  return idRef.value
}