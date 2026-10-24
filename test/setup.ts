import "@testing-library/jest-dom";

import { mockNavigation, mockRouter } from "./next-navigation";

// next/navigation es lo único del framework que se simula (guía front §11.3).
jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockNavigation.pathname,
  useSearchParams: () => mockNavigation.searchParams,
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

beforeEach(() => {
  Object.values(mockRouter).forEach((fn) => fn.mockReset());
  mockNavigation.pathname = "/";
  mockNavigation.searchParams = new URLSearchParams();
});
