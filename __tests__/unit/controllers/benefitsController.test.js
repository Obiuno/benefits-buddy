/*
getAllBenefits
- returns beneftis array of objects
- console.error("Error fetching each benefit: ", err);
    res.status(500).send({ error: err.message })

getBenefitsForFrontend
- changes shape for frontend (removes the developer_meta)
- creates imgURL - uses protocl and host from request to make baseURL, uses benefit.slug to get the img endpoint
- moves gov_url into details
- adds self plug to questions (consider having this somewhere else)
- console.error("Error shapping benefit: ", err);
    res.status(500).send({ error: err.message })
*/

import { describe, it } from "vitest";

describe("Benefits controller", () => {
  it.todo("create tests - see comments above");
});
