import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as prismicCustomTypes from "@prismicio/custom-types-client";
import { ConflictError } from "@prismicio/custom-types-client";
import dotenv from "dotenv";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(webRoot, ".env") });

console.log(process.env);
const repository = process.env.PRISMIC_REPOSITORY || "blbc";
const writeToken =
  process.env.PRISMIC_WRITE_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6ImJsYmMtOTJjMDgzYzYtZThjZC00NjE0LTk0ZTEtNzRjZDQ1NDZhNzc3XzUiLCJkYXRlIjoxNzgzNDMxMzEyLCJkb21haW4iOiJibGJjIiwiYXBwTmFtZSI6ImJsYmMiLCJpYXQiOjE3ODM0MzEzMTJ9.Fs_XlAKwI0kiNkkgOyh_byp7ALn8Nyspo_LObA6IvqE'

if (!repository || !writeToken) {
  console.error(
    "Set PRISMIC_REPOSITORY and PRISMIC_WRITE_TOKEN before pushing types.",
  );
  process.exit(1);
}

const client = prismicCustomTypes.createClient({
  repository,
  authToken: writeToken,
});

const customTypesDir = join(webRoot, "customtypes");
const files = readdirSync(customTypesDir).filter((file) => file.endsWith(".json"));

for (const file of files) {
  const customType = JSON.parse(
    readFileSync(join(customTypesDir, file), "utf8"),
  );

  try {
    await client.insertCustomType(customType);
    console.log(`created ${customType.id}`);
  } catch (error) {
    if (error instanceof ConflictError) {
      await client.updateCustomType(customType);
      console.log(`updated ${customType.id}`);
      continue;
    }

    throw error;
  }
}
