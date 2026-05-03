import { debutTemplates } from "./templates/debut";
import { weddingTemplates } from "./templates/wedding";
import { christeningTemplates } from "./templates/christening";
import { birthdayTemplates } from "./templates/birthday";
import { corporateTemplates } from "./templates/corporate";
import { anniversaryTemplates } from "./templates/anniversary";
import { babyShowerTemplates } from "./templates/baby-shower";
import type { TemplateDef, TemplateCategory } from "./types";

export const ALL_TEMPLATES: TemplateDef[] = [
  ...debutTemplates,
  ...weddingTemplates,
  ...christeningTemplates,
  ...birthdayTemplates,
  ...corporateTemplates,
  ...anniversaryTemplates,
  ...babyShowerTemplates,
];

export function getTemplatesByCategory(cat: TemplateCategory | "all"): TemplateDef[] {
  return cat === "all" ? ALL_TEMPLATES : ALL_TEMPLATES.filter((t) => t.category === cat);
}

export function findTemplate(id: string): TemplateDef | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}
