# Contributing to ZenCord

ZenCord welcomes community contributions, bug fixes, and feature proposals. Please review these guidelines before submitting patches or opening pull requests.

## Architecture and Code Standards

- **Type Safety:** All contributions must be strictly typed in TypeScript. Avoid utilizing `any` where explicit interfaces or Discord type models exist.
- **Resource Efficiency:** Plugins and modifications must maintain minimal runtime overhead. Avoid polling intervals where event listeners or reactive hooks are applicable.
- **DOM Manipulations:** Do not perform direct mutations on Discord core DOM nodes. Utilize module patchers and React tree injections.
- **Privacy Guarantees:** Telemetry collection, unauthenticated network calls, and arbitrary remote script executions are strictly prohibited.
- **Formatting and Linting:** Adhere to repository ESLint and Stylelint configurations prior to submitting pull requests.

## Development Workflow

1. Fork the repository and create a feature branch off `main`.
2. Install dependencies via `pnpm install`.
3. Validate your changes with the test suite:
   ```bash
   pnpm test
   ```
4. Verify styles and formatting:
   ```bash
   pnpm lint
   pnpm lint-styles
   ```
5. Submit a pull request with a concise, factual summary of the changes introduced.

## Security Disclosures

If you discover a security vulnerability or exploit vector within ZenCord, please contact the team directly via our community portal or submit a private security advisory on GitHub rather than opening a public issue.

## Community

Official discussions and development coordination take place in our community:
- Discord: https://discord.gg/EYzpnZuSba
- Portal: https://zencord-theta.vercel.app
