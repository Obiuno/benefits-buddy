import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
}

// dynamic import due to hoisting from ES Modules
const { default: app } = await import("./app.js");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (process.loadEnvFile.NODE_ENV !== "production") {
    console.log(`Benefit Buddy listening on http://localhost:${port}`);
  }
});
