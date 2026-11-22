---
name: build-guard
description: Always-on build guard enforcing Next.js TypeScript and Tailwind CSS compilation integrity before completing any web task.
trigger: always_on
---

# Always-On Build Guard (Verelli.lol)

## Mandatory Verification Protocol for `apps/web`

To prevent CSS/PostCSS regressions, unstyled HTML rendering, or Next.js chunk corruption:

1. **Clean Build Integrity Check:**
   Whenever any file in `apps/web/` (including `app/`, `components/`, `globals.css`, `tailwind.config.ts`, or `postcss.config.mjs`) is modified, the agent MUST run:
   ```bash
   npm --workspace=apps/web run build
   ```
   with zero errors before returning a completed turn to the user.

2. **Tailwind & CSS Safeguards:**
   - `apps/web/app/globals.css` must always preserve:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - Never introduce unclosed curly braces, malformed SVG data URLs, or invalid `@apply` rules.
   - All SVG elements must retain explicit `width` and `height` attributes or inline `style={{ width: '...', height: '...' }}` to prevent unconstrained 100vw layout blowouts.

3. **Dev Server Cache Protection:**
   - Never run `next build` concurrently against an active `next dev` instance without clearing `.next` cache, as this causes chunk collisions (`denormalizePagePath` TypeError).
