// API pública de catalog. Las páginas de src/app/ leen el catálogo con
// getServerContainer().catalog y pasan estos tipos como props a los componentes.
export type {
  Catalog,
  DirectAccessOffer,
  LevelName,
  PackOffer,
  PlanSummary,
  ProductRef,
} from "./domain/catalog";
export type {
  BlockType,
  FreeSample,
  LevelSummary,
  PublicPlan,
  SampleBlock,
  SampleDay,
  SyllabusGroup,
} from "./domain/public-plan";
export { About } from "./ui/about";
export { Hero } from "./ui/hero";
export { HowItWorks } from "./ui/how-it-works";
