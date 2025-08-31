# ezstack

A full-stack application template optimized for **developer experience**. Every technology choice is made to reduce friction and make building complex applications feel magical. No boilerplate, no configuration hell - just pleasant abstractions that scale from zero.

## 🚀 The Stack (And Why)

- **[Next.js 15](https://nextjs.org)** - The magical App Router makes routing effortless. Popular, well-supported, and just works
- **[Convex](https://convex.dev)** - Endpoints become functions. Real-time updates, full type safety with Zod, incredible dashboard for debugging. Built by people who know production insanely well
- **[Better Auth](https://www.better-auth.com)** - Batteries-included auth that's method-agnostic and gaining momentum. Admin functionality handled for you
- **[Hono](https://hono.dev)** - When you need custom HTTP endpoints, you get top-notch DX out of the box
- **[Zod v4](https://zod.dev)** - Not just validation - **Codecs** for live data migration like Cambria. Plus seamless Convex schema integration
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)** - Utility-first styling with beautiful, accessible components. KiboUI included to demonstrate registry support
- **[Biome](https://biomejs.dev)** - Lighter than ESLint, faster setup
- **[Bun](https://bun.sh)** - Batteries included API DX, fast as hell

## ✨ What Makes This Special

- **Zero Endpoint Boilerplate**: Convex turns database operations into type-safe functions
- **Live Data Migration**: Zod v4 Codecs let you evolve your schema without breaking existing data
- **Real-time by Default**: Every database change propagates instantly to connected clients
- **Authentication Without Tears**: Better Auth handles complex auth flows with simple API calls
- **Type Safety Everywhere**: From database schema to frontend components, TypeScript flows seamlessly
- **Quality Components Ready**: shadcn/ui ecosystem with KiboUI registry demo showing how to extend component sources
- **Incredible Debugging**: Convex dashboard shows function calls, data, and performance in real-time

## 🛠️ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Convex CLI](https://docs.convex.dev/quickstart) for backend development

### Setup Your Project

1. **Clone or use this template**:
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd ezstack
   
   # Or use as GitHub template
   # Click "Use this template" on GitHub
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up Convex backend**:
   ```bash
   bun x convex dev
   ```
   This will create a new Convex project and provide you with environment variables.

4. **Start the development server**:
   ```bash
   bun dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### Environment Setup

After running `convex dev`, add the provided environment variables to your `.env.local` file:

```bash
# Convex
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-public-convex-url

# Better Auth (generate a random secret)
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Example app with auth and basic CRUD
│   ├── layout.tsx         # Root layout with providers
│   └── api/auth/          # Better Auth API routes
├── components/ui/         # shadcn/ui components + KiboUI registry demo
└── lib/                   # Utility functions and configurations

convex/
├── auth.ts               # Authentication functions
├── tasks.ts              # Example CRUD operations
├── schema.ts             # Database schema definitions
└── _generated/           # Auto-generated Convex files
```

## 🔧 Development Scripts

- `bun dev` - Start the development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run Biome linter
- `bun format` - Format code with Biome

## 📚 Learn More

### Technologies Used

- [Next.js Documentation](https://nextjs.org/docs) - React framework for production
- [Convex Documentation](https://docs.convex.dev) - Real-time backend platform
- [Better Auth Documentation](https://www.better-auth.com) - Modern authentication library
- [Hono Documentation](https://hono.dev) - Fast, lightweight web framework
- [shadcn/ui Documentation](https://ui.shadcn.com) - Beautiful and accessible component system
- [KiboUI Documentation](https://www.kibo-ui.com) - Additional components via registry (demo)
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Zod Documentation](https://zod.dev) - TypeScript-first schema validation

### Key DX Wins

- **Function-First Backend**: Write `const tasks = useQuery(api.tasks.list)` instead of managing REST endpoint design
- **Schema Evolution**: Zod v4 Codecs allow you to handle formal data migration automatically as your app grows (and if you don't care, Convex doesn't care either, because it'll happily take any data you put in)
- **Real-time Without WebSockets**: Convex manages subscriptions and updates transparently
- **Auth That Scales**: Better Auth grows from simple email/password to enterprise SSO without refactoring
- **Component Flexibility**: shadcn/ui ecosystem + KiboUI registry demo + Tailwind v4 = endless possibilities
- **Instant Debugging**: Convex dashboard beats console.log for understanding your app's behavior
- **Fast Everything**: Bun install, Biome format, Next.js App Router - optimized for speed

## 🎯 Using This Template

The included task management example isn't the point - it's a reference for how these technologies work together. To build your own app:

1. **Define your data** in `convex/schema.ts` using Zod v4 schemas
2. **Write functions** in `convex/` instead of REST endpoints  
3. **Build your UI** in `src/app/page.tsx` with shadcn/ui components
4. **Extend authentication** as needed (Better Auth supports OAuth, 2FA, etc.)
5. **Add custom endpoints** with Hono if needed

The magic happens when you realize you're building features, not infrastructure.

## 🚀 Deployment

This template can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): Connect your repository for automatic deployments
- **Netlify**: Deploy with their Next.js runtime
- **Railway/Render**: Deploy with Docker or buildpacks

Make sure to configure your environment variables in your deployment platform and update the `BETTER_AUTH_URL` to your production domain.

---

**Built by [Ezra](https://github.com/ezra-en)** • A template for developers who value their time
