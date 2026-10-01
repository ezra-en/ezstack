import { defineConfig } from "vitest/config";

// Standalone config so tests don't load the vinext Vite plugin.
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
