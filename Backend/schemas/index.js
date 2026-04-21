import { z } from "zod";

export const BenefitUrlsSchema = z.object({
  gov_url: z.string(),
  apply_url: z.string(),
});

// YAML schema - no id required
export const BenefitYAMLSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.array(z.string()).nullable().optional(),
  urls: BenefitUrlsSchema,
  details: z.record(z.unknown()),
  active: z.boolean().default(true),
});

// DB schema - extends YAML schema with id
export const BenefitSchema = BenefitYAMLSchema.extend({
  benefits_id: z.number().int().positive().default(999),
});

export const GlossaryYAMLSchema = z.object({
  glossary_slug: z.string(),
  term: z.string(),
  definition: z.string(),
  related_benefits: z.array(z.string()).nullable().optional().default([]),
  active: z.boolean().default(true),
});

export const GlossarySchema = GlossaryYAMLSchema.extend({
  glossary_id: z.number().int().positive().default(999),
});

export const FaqYAMLSchema = z.object({
  question: z.string(),
  answer: z.string(),
  benefit_slug: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  display_order: z.number().int().default(999),
  active: z.boolean().default(true),
});

export const FaqSchema = FaqYAMLSchema.extend({
  faqs_id: z.number().int().positive().default(999),
});

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  timestamp: z.string().datetime().nullable().optional(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, "At least one message required"),
});

export const GlossaryResponseSchema = z.object({
  term: z.string().nullable().optional(),
  definition: z.string().nullable().optional(),
});

export const DeveloperMetaSchema = z
  .object({
    reasoning: z.string().nullable().optional(),
    feedback: z.string().nullable().optional(),
    confidence: z.enum(["low", "medium", "high"]),
    severity_category: z.enum(["low", "medium", "high"]),
    distress_category: z.enum(["low", "medium", "high"]),
    complexity_category: z.enum(["low", "medium", "high"]),
    key_points: z.array(z.string()).default([]),
  })
  .nullable()
  .optional();

export const AIContext = z.object({
  legacy_risk: z.boolean().default(false),
  tone_mode: z.enum(["normal", "supportive", "urgent"]).default("normal"),
});

export const AIResponseSchema = z.object({
  message: z.string(),
  benefits_suggested: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
        reason: z.string(),
        gov_url: z.string(),
        support_url: z.string().nullable().optional(),
      }),
    )
    .default([]),
  glossary_terms: z.array(GlossaryResponseSchema).default([]),
  next_question: z.string().nullable().optional(),
  buddy_context: AIContext,
  developer_meta: DeveloperMetaSchema,
});
