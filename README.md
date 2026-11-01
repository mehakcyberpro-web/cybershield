# CyberShield

Cybersecurity Incident Reporting & Tracking System. Incident intake, classification, assignment, and response tracking form the core product; four optional agent modules enrich that workflow.

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm run dev` and open the Vite URL shown in the terminal. API listens on port 4000.

The checked-in-ignored local `.env` enables `DEMO_MODE=true`: the dashboard signs in to the API automatically and reads/writes demo incidents through authenticated REST routes. Demo data is held in API memory and resets when the API restarts. For MySQL persistence, install MySQL 8+, run `mysql -u root -p < database/schema.sql`, configure `.env` from `.env.example` with `DEMO_MODE=false`, a strong `JWT_SECRET`, and database credentials. The production login route uses bcryptjs password hashes; provision user accounts through a controlled admin workflow.

## Full Stack-II mapping

- React dashboard and incident intake, with Redux Toolkit for UI state.
- Express REST API, validation, JWT authentication, and role-based assignment controls.
- MySQL relational schema with foreign keys, normalization, indexes, JSON audit metadata, and transactions around incident creation.
- Secure handling: parameterized SQL, bounded request size, content validation, least-privilege roles, and environment-based secrets.

## AI agent extensions

1. **OSINT collection** — enrich an incident's asset/domain context using approved sources.
2. **Vulnerability assessment** — map findings to CVEs and CVSS severity.
3. **Threat intelligence** — correlate historical attacks and MITRE ATT&CK techniques.
4. **Risk analysis & reporting** — prioritize exposure and produce incident PDF briefings.

Each agent card sends the selected incident and target input to the OpenAI Responses API and returns structured findings in the UI. Set `OPENAI_API_KEY` in the ignored local `.env`; `OPENAI_MODEL` can select an available model. The OSINT, vulnerability, and threat-intelligence agents use the Responses API web search tool for public research. Private/internal targets are excluded from web search. Risk reporting uses the model without web search.

- **OSINT collection** researches the user-entered public domain/IP with passive public sources. It does not probe or scan the target.
- **Vulnerability assessment** researches supplied product/version details against public sources and reports CVE/CVSS findings with sources; missing evidence is called out.
- **Threat intelligence** researches historical context and suggests MITRE ATT&CK mappings with source links. Actor attribution requires direct evidence.
- **Risk & reporting** evaluates the incident, explains risk drivers, suggests next steps, and opens a print-ready report that can be saved as PDF.

Incident details and the entered target are sent to OpenAI when an agent runs. Public-source agents may also search public web sources. Do not enter credentials, secrets, or assets you are not authorized to assess. Keep analyst review in the loop.

## Database concepts

The schema separates organizations, users, incidents, audit events, and agent runs. Incident sequences use a composite key per organization and year; report queries can use the status/severity and assignee indexes. Creation writes the incident and audit event in one transaction. MongoDB can be added as an optional document store for provider response snapshots; MySQL remains the source of truth.
