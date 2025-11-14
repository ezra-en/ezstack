
# ezstack

A streamlined full-stack template built for rapid development with Next.js and Convex. This version is focused on simplicity, real-time data, and fast momentum—ideal for quickly building modern web apps without worrying about schemas upfront.


## 🚀 Tech Stack

- **Next.js 15** – App Router for effortless routing and SSR/SSG
- **Convex** – Real-time backend, type-safe functions, and live data
- **Tailwind CSS v4** – Utility-first styling
- **shadcn/ui** – Accessible, beautiful React components
- **Better Auth** - Simple, extensible, reliable auth.

## 🧩 MCP Servers & Convex Instructions

This template includes:

- **Convex instructions**: See `.github/instructions/convex.instructions.md` for workspace-specific guidelines on writing Convex functions, schemas, and best practices. These instructions help you stay consistent and leverage Convex to its fullest.
- **MCP server integration**: The `.vscode/mcp.json` file enables Model Context Protocol (MCP) features for advanced code intelligence and automation in VS Code. This project includes:

  - **convex-mcp**: For access to your Convex deployment.
  - **context7**: For deep documentation and code search. Requires a Context7 API key, add your key to `.vscode/mcp.json` (don't check it into Git though)
  - **ast-grep**: For advanced AST-based code search and refactoring. Install the [Prerequisites](https://github.com/ast-grep/ast-grep-mcp#prerequisites) before use.

## 🛠️ Quick Start



### Prerequisites

- [mise](https://mise.jdx.dev/getting-started.html) (recommended) for easy management of Node.js, bun, and other tool versions
- [Node.js](https://nodejs.org/) and [bun](https://bun.sh/) installed
- [Convex CLI](https://docs.convex.dev/quickstart) installed

### Setup

1. **Clone or use this template**:
	```bash
	bunx degit github:ezra-en/ezstack my-app
	cd my-app
	```
	Or click "Use this template" on GitHub.

2. **Install dependencies**:
	```bash
	bun install
	```

3. **Initialize Convex backend** (if not already done):

	```bash
	bun convex dev
	```
	Follow the CLI instructions to set up your Convex project and environment variables.

4. **Add environment variables** to `.env.local` (after Convex setup):
  
	```sh
	# Deployment used by `bun convex dev`
	CONVEX_DEPLOYMENT=your-anonymous-deployment-name
	NEXT_PUBLIC_CONVEX_URL=http://your-public-convex-url:3210
	NEXT_PUBLIC_CONVEX_SITE_URL=http://your-public-convex-url:3211
	# Deployment URL for Next.js (this should be your actual deployment URL, tailscale, or localhost for local dev)
	NEXT_PUBLIC_DEPLOYMENT_URL=http://localhost:3000
	```

5. **Configure your admin account** in `convex/init.ts`

	```js
	// Configure your credentials here
	auth.api.createUser({
		body: {
			email: "admin@example.com",
			name: "Admin",
			password: "CHANGEME",
			role: "admin",
		},
	});
	```


6. **Start the development server** (make sure the predev command succeeds):
	```bash
	bun dev
	```

7. **Open your browser** to [http://localhost:3000](http://localhost:3000) for the application
8. **Open your browser** to [http://localhost:6790](http://localhost:6790) for the Convex Dashboard




## 📁 Project Structure

```
app/
	ConvexClientProvider.tsx
	globals.css
	layout.tsx
	page.tsx
	api/
		auth/
			[...all]/
				route.ts
convex/
	auth.config.ts
	auth.ts
	convex.config.ts
	http.ts
	init.ts
	tasks.ts
	_generated/
		api.d.ts
		api.js
		dataModel.d.ts
		server.d.ts
		server.js
	betterAuth/
		adapter.ts
		admin.ts
		auth.ts
		convex.config.ts
		schema.ts
		_generated/
			api.ts
			component.ts
			dataModel.ts
			server.ts
lib/
	auth-client.ts
	auth-server.ts
	utils.ts
public/
```

## 🔧 Scripts

- `bun dev` – Start development server
- `bun build` – Build for production
- `bun start` – Start production server

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs/integrations/convex)
- [@convex/better-auth Documentation](https://convex-better-auth.netlify.app/framework-guides/next)

---

**Built by [Ezra](https://github.com/ezra-en)** • A template for developers who value their time.
