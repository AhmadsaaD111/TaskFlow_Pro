# Contributing

I’m happy to review focused improvements to TaskFlow Pro.

## Guidelines

- Keep changes small and well-scoped.
- Follow the existing architecture (feature modules, store/service separation).
- Use Vue 3 Composition API and TypeScript consistently.
- Run the checks locally before opening a PR:

```bash
npm run typecheck
npm run lint
```

## Pull Requests

- Explain the problem and why the change is worth it.
- Include screenshots for any UI change.
- Avoid drive-by refactors (especially across modules).
