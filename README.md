# LegalIntake AI

**AI-Powered Client Intake & Automation for Modern Law Firms.**

LegalIntake AI replaces static intake forms with a secure, intelligent chat agent. It interviews potential clients, gathers critical case details, and generates structured reports for attorneys—saving time and increasing conversion rates.

## Features

- **🤖 AI Intake Agent**: Conducts structured interviews ("One Question at a Time") to screen clients.
- **✨ Smart Inputs**: Dynamic UI elements (Date Pickers, Location, Yes/No) triggered by AI context.
- **⚖️ Case Management**: Dashboard for attorneys to review new leads and case summaries.
- **📄 Instant Reports**: Automatically generates PDF case briefs from chat history.
- **🔒 Secure & Private**: Built with privacy-first principles.
<img width="1322" height="640" alt="image" src="https://github.com/user-attachments/assets/ea1b843f-f5c6-43e9-b643-f12779beee64" />
<img width="1366" height="1940" alt="image" src="https://github.com/user-attachments/assets/de7a1d6a-dfbf-4908-98ea-b88978b94922" />

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI**: [LangChain](https://js.langchain.com/) + [Groq](https://groq.com/) (Llama 3 70B)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + SQLite (Dev) / Postgres (Prod)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Language**: TypeScript

## Getting Started

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following keys:
   ```env
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=file:local.db
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.
