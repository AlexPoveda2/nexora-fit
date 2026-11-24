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
export { BuyBar } from "./ui/buy-bar";
export { DirectAccessCta } from "./ui/direct-access-cta";
export { EquipmentList } from "./ui/equipment-list";
export { Faq } from "./ui/faq";
export { FreeSampleTeaser } from "./ui/free-sample-teaser";
export { Hero } from "./ui/hero";
export { HowItWorks } from "./ui/how-it-works";
export { Includes } from "./ui/includes";
export { LevelCards } from "./ui/level-cards";
export { PackBanner } from "./ui/pack-banner";
export { PlanHeader } from "./ui/plan-header";
export { SampleDayPreview } from "./ui/sample-day-preview";
export { SportCards } from "./ui/sport-cards";
export { Syllabus } from "./ui/syllabus";
