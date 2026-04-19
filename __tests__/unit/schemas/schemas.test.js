// __tests__/unit/schemas/schemas.test.js
import { describe, it, expect } from "vitest";
import {
  BenefitSchema,
  BenefitYAMLSchema,
  GlossarySchema,
  GlossaryYAMLSchema,
  FaqSchema,
  FaqYAMLSchema,
  ChatMessageSchema,
  ChatRequestSchema,
  AIResponseSchema,
} from "../../../Backend/schemas/index.js";

describe("Benefit Schemas", () => {
  it.todo("valid benefit data passes BenefitYAMLSchema");
  it.todo("missing required name, slug field throws ZodError");
  it.todo("missing urls throws ZodError");
  it.todo("invalid url shape throws ZodError");
  it.todo("active defaults to true if not provided");
  it.todo("category accepts null");

  /*
it('missing required name field throws ZodError', () => {
    expect(() => BenefitYAMLSchema.parse({ slug: 'test' })).toThrow()
})
*/
});

describe("Glossary Schemas", () => {
  it.todo("valid glossary item passes GlossaryYAMLSchema");
  it.todo("missing term throws ZodError");
  it.todo("missing definition throws ZodError");
  it.todo("related_benefits defaults to empty array");
  it.todo("active defaults to true");
});

describe("FAQ Schemas", () => {
  it.todo("valid faq passes FaqYAMLSchema");
  it.todo("missing question throws ZodError");
  it.todo("missing answer throws ZodError");
  it.todo("display_order defaults to 999");
  it.todo("benefit_slug accepts null");
  it.todo("category accepts null");
});

describe("Chat Schemas", () => {
  it.todo("valid user message passes ChatMessageSchema");
  it.todo("valid assistant message passes ChatMessageSchema");
  it.todo("invalid role throws ZodError");
  it.todo("empty content throws ZodError");
  it.todo("messages array with one item passes ChatRequestSchema");
  it.todo("empty messages array throws ZodError");
  it.todo("missing messages throws ZodError");
});

describe("AI Response Schema", () => {
  it.todo("valid AI response passes AIResponseSchema");
  it.todo("missing message throws ZodError");
  it.todo("benefits_suggested defaults to empty array");
  it.todo("glossary_terms defaults to empty array");
  it.todo("next_question accepts null");
  it.todo("developer_meta is optional");
  it.todo("developer_meta stripped correctly in controller");
});
