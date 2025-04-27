
# German Article Helper

React + Tailwind app for German noun article lookup via GPT‑4o.

## Quick start

```bash
npm install
cp .env.sample .env   # add your OpenAI key
npm run dev
```

## Deploy on Azure Static Web Apps

1. Create a Static Web Apps resource in Azure.
2. Add secret **AZURE_STATIC_WEB_APPS_API_TOKEN** to your GitHub repo.
3. Push to **main** – the included GitHub Action deploys automatically.
