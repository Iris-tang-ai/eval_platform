# AGENTS.md

## Cursor Cloud specific instructions

This is a single-file front-end prototype for an LLM automated evaluation platform.

- **Stack**: Single `index.html` using Tailwind CSS (CDN), Alpine.js (CDN), vanilla JS. No build step, no `package.json`, no dependencies to install.
- **Runtime**: Node.js v22 LTS is available via nvm if needed for tooling.

### Running the app

Serve `index.html` via any static HTTP server, for example:
```
npx http-server /workspace -p 3000 -c-1
```
Then open `http://localhost:3000/index.html` in a browser.

Alternatively, the file can be opened directly in a browser (`file://` protocol) since it uses only CDN dependencies.

### Lint / Test / Build

No lint, test, or build tooling is configured. This is a prototype-stage single-file app. If a `package.json` is added later, run the install command matching the lockfile (`package-lock.json` → `npm install`, `pnpm-lock.yaml` → `pnpm install`, `yarn.lock` → `yarn install`).
