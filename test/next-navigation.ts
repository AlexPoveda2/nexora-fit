// Router falso que comparten todas las pruebas; setup.ts lo limpia antes de cada una.
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

export const mockNavigation = {
  pathname: "/",
  searchParams: new URLSearchParams(),
};
