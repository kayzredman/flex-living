# Workspace Rules: Autonomous Execution Policy

## 1. Autonomous Execution
- The user has granted full authorization for all development, build, test, git, and service commands.
- The QA Agent and SME Agents must proceed autonomously with all operations.
- Avoid requesting user permission for commands.

## 2. Command Execution Guidelines
- Default to standard sandbox mode (`BypassSandbox: false`) so commands execute immediately without modal approval prompts.
- Maintain simple, prefix-matchable command shapes (`git`, `node`, `npm`) so that IDE auto-approval policies recognize and allow them seamlessly.
- Avoid command substitutions and unnecessary nested shell expansions that invalidate prefix-matching.
