import { viteMockServe } from 'vite-plugin-mock'

export function useMockPlugin(isBuild = false, useMock = false) {
  if (useMock) {
    return viteMockServe({
      ignore: /^\_/,
      mockPath: 'src/mocks',
      watchFiles: !isBuild,
      enable: true,
      logger: !isBuild,
      injectCode: `
        import { setupProdMockServer } from './src/mocks/_server';
        setupProdMockServer();
      `
    })
  } else {
    return []
  }
}
