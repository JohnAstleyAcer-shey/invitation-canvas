import type { BlockType, BlockContent, BlockStyle } from "@/features/blocks/types";

export interface CatalogBlock {
  block_type: BlockType;
  content: BlockContent;
  style: BlockStyle;
}

export type TemplateCategory =
  | "debut"
  | "wedding"
  | "christening"
  | "birthday"
  | "corporate"
  | "anniversary"
  | "baby_shower";

export interface TemplateDef {
  id: string;            // unique slug
  name: string;
  category: TemplateCategory;
  description: string;
  tagline?: string;
  palette: { bg: string; accent: string; text: string };
  font?: string;
  blocks: CatalogBlock[];
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  debut: "Debut",
  wedding: "Wedding",
  christening: "Christening",
  birthday: "Birthday",
  corporate: "Corporate / Gala",
  anniversary: "Anniversary",
  baby_shower: "Baby Shower",
};
