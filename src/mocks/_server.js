import { createProdMockServer } from 'vite-plugin-mock/client'

const modules = import.meta.glob('./modules/*.js', { eager: true })

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  const mockModules = []
  Object.keys(modules).forEach((key) => {
    mockModules.push(...modules[key].default)
  })
  createProdMockServer(mockModules)
}
