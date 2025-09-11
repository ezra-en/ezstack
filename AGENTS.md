# AGENTS.md

## Build, Lint, and Test Commands

- **Build:** `npm run build` (Next.js build)
- **Lint:** `npm run lint` (Next.js lint)
- **Dev:** `npm run dev` (runs frontend and backend in parallel)
- **Test:** No test script defined; add a test runner if needed.

## Code Style Guidelines

- **Imports:** Use ES6 imports. Group external, then internal modules. Avoid unused imports.
- **Formatting:** Use Prettier defaults. Indent with 2 spaces. Keep lines < 100 chars.
- **Types:** Use strict TypeScript. Prefer explicit types, especially for IDs (e.g., `Id<'users'>`).
- **Naming:** Use camelCase for variables/functions, PascalCase for components/types, kebab-case for files.
- **Convex Functions:** Always use new syntax (`query`, `mutation`, `action`, etc.) and include argument/return validators.
- **Error Handling:** Throw errors for missing resources. Use null validators (`v.null()`) for functions that return nothing.
- **Schema:** Define all schemas in `convex/schema.ts`. Use `defineTable` and index fields as described in Cursor rules.
- **API Design:** Organize public/internal functions in `convex/` using file-based routing. Use `api` and `internal` objects for references.
- **Comments:** Document complex logic and public APIs. Use JSDoc for functions.
- **Cursor Rules:** Follow all guidelines in `.cursor/rules/convex_rules.mdc` for Convex-specific code.

---

For more details, see `.cursor/rules/convex_rules.mdc`. Add a test runner if you need automated tests.
