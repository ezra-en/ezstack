
# ezstack

A streamlined full-stack template built for rapid development with Next.js and Convex. This version is focused on simplicity, real-time data, and fast momentum—ideal for quickly building modern web apps without worrying about schemas upfront.


## 🚀 Tech Stack

- **Next.js 15** – App Router for effortless routing and SSR/SSG
- **Convex** – Real-time backend, type-safe functions, and live data
- **Tailwind CSS v4** – Utility-first styling
- **shadcn/ui** – Accessible, beautiful React components

## 🧩 MCP Servers & Convex Instructions

This template includes:

- **Convex instructions**: See `.github/instructions/convex.instructions.md` for workspace-specific guidelines on writing Convex functions, schemas, and best practices. These instructions help you stay consistent and leverage Convex to its fullest.
- **MCP server integration**: The `.vscode/mcp.json` file enables Model Context Protocol (MCP) features for advanced code intelligence and automation in VS Code. This project includes:

  - **convex-mcp**: For access to your Convex deployment.
  - **context7**: For deep documentation and code search. Requires a Context7 API key, add your key to `.vscode/mcp.json` (don't check it into Git though)
  - **ast-grep**: For advanced AST-based code search and refactoring. Install the [Prerequisites](https://github.com/ast-grep/ast-grep-mcp#prerequisites) before use.

## 🛠️ Quick Start



### Prerequisites

- [mise](https://mise.jdx.dev/getting-started.html) (recommended) for easy management of Node.js, pnpm, and other tool versions
- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed
- [Convex CLI](https://docs.convex.dev/quickstart) installed

### Setup

1. **Clone or use this template**:
	```bash
	npx degit github:ezra-en/ezstack my-app
	cd my-app
	```
	Or click "Use this template" on GitHub.

2. **Install dependencies**:
	```bash
	pnpm install
	```

3. **Initialize Convex backend** (if not already done):
	```bash
	pnpm convex dev
	```
	Follow the CLI instructions to set up your Convex project and environment variables.

4. **Add environment variables** to `.env.local` (after Convex setup):
	```
	CONVEX_DEPLOYMENT=your-deployment-url
	NEXT_PUBLIC_CONVEX_URL=your-public-convex-url
	```

5. **Start the development server**:
	```bash
	pnpm dev
	```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
	globals.css
	layout.tsx
	page.tsx
	api/auth/[...all]/route.ts
	login/page.tsx
	server/inner.tsx
	server/page.tsx
components/
	ConvexClientProvider.tsx
convex/
	auth.config.ts
	auth.ts
	convex.config.ts
	http.ts
	myFunctions.ts
	schema.ts
	_generated/
lib/
	auth-client.ts
	auth.ts
	utils.ts
public/
	convex.svg
```

## 🔧 Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Start production server

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built by [Ezra](https://github.com/ezra-en)** • A template for developers who value their time
