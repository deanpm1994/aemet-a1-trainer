import { loadEnvConfig } from "@next/env";

/** Makes standalone maintenance scripts use the same local env files as Next.js. */
loadEnvConfig(process.cwd());
