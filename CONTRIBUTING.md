# Contributing to Invisible DEX

Thanks for your interest in contributing.

## How to contribute

1. **Fork** the repo and clone your fork.
2. **Create a branch** (`git checkout -b feature/your-feature`).
3. **Make changes** – keep commits focused and messages clear.
4. **Test** – run `npm run install:all`, start server and frontend, and test flows. For contracts: `cd contracts && sui move build && sui move test` (when tests are added).
5. **Push** and open a **Pull Request** against `main` with a short description of what changed and why.

## Areas we’d love help with

- **Frontend:** 3D visualization, more chart types, mobile UX.
- **Backend:** Yellow Network integration, caching, error handling.
- **Contracts:** Gas optimization, new market types, security.
- **Docs:** Examples, tutorials, translations.

## Code style

- TypeScript/React: reasonable defaults; match existing style in the file.
- Move: follow Sui/Move conventions; add comments for non-obvious logic.

## Questions

Open a [GitHub Issue](https://github.com/AkakpoErnest/invisible-dex/issues) for bugs or feature ideas.
