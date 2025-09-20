

# ezstack


A streamlined full-stack template built for rapid development with Next.js and Convex. This version is focused on simplicity, real-time data, and fast momentum—ideal for quickly building modern web apps without worrying about schemas upfront.


## 🚀 Tech Stack

- **Bun** – Fastest JS/TS runtime, package manager, and bundler. Handles all installs, scripts, and builds.
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

- [Bun](https://bun.sh/docs/install) (required) – One command to install on any OS:
	```bash
	curl -fsSL https://bun.sh/install | bash
	```
- [mise](https://mise.jdx.dev/getting-started.html) (optional) for managing multiple tool versions
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
	bun i
	```

3. **Initialize Convex backend** (if not already done):
	```bash
	bunx convex dev --once
	```
	Follow the CLI instructions to set up your Convex project and environment variables.

4. **Add environment variables** to `.env.local` from `.env.example` (after Convex setup):
	```
	NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211
		# Deployment URL for Next.js (this should be your actual deployment URL, tailscale, or localhost for local dev)
		NEXT_PUBLIC_DEPLOYMENT_URL=http://localhost:3000
	```

5. **Start the development server**:
	```bash
	bun dev
	```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000) (or wherever you set your `NEXT_PUBLIC_DEPLOYMENT_URL`)

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

- `bun dev` – Start development servers (Next.js + Convex)
- `bun build` – Build for production
- `bun start` – Start production server

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built by [ezra-en](https://github.com/ezra-en)** • A template for developers who value their time
