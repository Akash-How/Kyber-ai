# Kyber - Generative UI Job Assistant

Kyber is a chat-first job assistant built with Next.js + Tambo React SDK for hackathon demos.

# Development Note

This project was built with assistance from AI tools to speed up prototyping and iteration, 
while all final implementation and integration decisions were made by me.

## What it demonstrates

- Generative UI flow where AI selects UI components based on user messages
- 6 registered Tambo components:
  - ResumeUploader
  - ResumeSummaryCard
  - ATSScoreCard
  - SkillsGapPanel
  - CoverLetterPanel
  - InterviewPrepPanel
- 3 registered tools:
  - parseResumeText
  - calculateATSScore
  - generateCoverLetter
- Premium dark glassmorphism interface with responsive layout

## What it demonstrates

## Run locally

1. Install dependencies

```bash
npm install
```

2. Configure environment

- Copy `example.env.local` to `.env.local`
- Set `NEXT_PUBLIC_TAMBO_API_KEY`
- Optional: set `NEXT_PUBLIC_TAMBO_URL`

3. Start app

```bash
npm run dev
```

Open:

- Landing page: `http://localhost:3000`
- Main demo: `http://localhost:3000/chat`

## Demo flow (1 minute)

1. Open `/chat`
2. Click a demo prompt chip (ATS, cover letter, skills, interview prep)
3. Observe chat response + dynamic UI panel rendering
4. Ask follow-ups to switch panels

## Key files

- `src/lib/tambo.ts` - Tambo tool + component registration
- `src/components/job/*.tsx` - all job assistant generative components
- `src/services/*.ts` - resume parsing, ATS scoring, cover letter generation
- `src/app/chat/page.tsx` - chat-first premium experience
- `src/app/page.tsx` - landing page
