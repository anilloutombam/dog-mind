# Dog Mind

Dog Mind is a playful AI-powered web app that interprets visible dog body language from a photo and turns it into a mood summary, personality signals, and a lighthearted imaginary inner monologue.

The experience is designed as a polished, responsive upload flow with image validation, drag and drop, a live analysis animation, progress tracking, and structured results.

> Dog Mind is intended for entertainment. Its output is not veterinary or behavioral advice.

## Features

- Drag-and-drop or file-picker image uploads
- Full-image previews without cropping
- JPEG, PNG, and WebP validation
- 5 MB upload limit
- Animated analysis progress with a moving dog indicator
- Live analysis-step tracker
- Structured AI results validated on the server
- On-demand ElevenLabs voice generation for the dog’s imagined thought
- Friendly handling for non-dog images and API errors
- Responsive desktop and mobile layouts
- Reduced-motion accessibility support
- Server-only API credentials

## Technology

- [Next.js](https://nextjs.org/) App Router
- React and TypeScript
- Tailwind CSS
- Lucide icons
- Google Gemini multimodal analysis
- Zod response validation
- pnpm

ElevenLabs provides the opt-in “Give my dog a voice” result experience. Audio is generated only after a user clicks the voice button.

## Getting Started

### Requirements

- Node.js 20 or newer
- pnpm 11
- A Google Gemini API key
- An ElevenLabs API key to enable the optional voice experience

### Install dependencies

```bash
pnpm install
```

### Configure the environment

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

The app defaults to the stable `gemini-3.6-flash` model. You can override it without changing source code:

```env
GEMINI_MODEL=gemini-3.6-flash
```

You can optionally choose a different ElevenLabs voice without changing source code:

```env
ELEVENLABS_VOICE_ID=your_voice_id
```

Never use a `NEXT_PUBLIC_` prefix for either credential. Variables with that prefix are bundled into browser code. The repository ignores `.env*` files by default.

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev       # Start the development server
pnpm lint      # Run ESLint
pnpm build     # Create a production build
pnpm start     # Run the production server
```

## Architecture

The codebase uses a feature-first structure. Route files compose the page, feature modules own domain behavior, and reusable site components remain independent of the analysis workflow.

```text
app/
├── api/analyze/route.ts          # Server-only Gemini endpoint
├── api/speak/route.ts            # Server-only ElevenLabs endpoint
├── globals.css                   # Design system and responsive styles
├── layout.tsx                    # Root metadata and document layout
└── page.tsx                      # Page composition

components/dog-mind/
├── feature-highlights.tsx
├── hero.tsx
├── site-footer.tsx
└── site-header.tsx

features/dog-analysis/
├── components/
│   ├── analysis-steps.tsx
│   ├── analyzing-card.tsx
│   ├── photo-dropzone.tsx
│   ├── result-card.tsx
│   ├── upload-panel.tsx
│   ├── uploaded-image.tsx
│   └── voice-player.tsx
├── constants.ts                  # File rules and analysis-step definitions
├── dog-analysis-workspace.tsx    # Feature composition boundary
├── types.ts                      # Shared domain types
├── use-dog-analysis.ts           # Upload and analysis state machine
└── use-dog-voice.ts              # On-demand audio generation state
```

### Responsibility boundaries

- `app/page.tsx` only composes top-level sections.
- `use-dog-analysis.ts` owns selected files, object URLs, validation, API requests, progress, errors, and reset behavior.
- Feature components render individual UI states without duplicating workflow logic.
- `uploaded-image.tsx` is the shared renderer for browser-generated object URLs.
- `/api/analyze` performs server-side file validation, calls Gemini, validates the structured response, and returns sanitized errors.
- `use-dog-voice.ts` owns voice generation, audio URLs, retries, and cleanup.
- `/api/speak` keeps ElevenLabs credentials on the server and returns generated MP3 audio.

## Analysis Flow

```text
Select image
    ↓
Client type and size validation
    ↓
Preview and confirmation
    ↓
POST /api/analyze as multipart form data
    ↓
Server type and size validation
    ↓
Gemini multimodal analysis
    ↓
Zod response validation
    ↓
Structured result UI
```

The multipart field name expected by the endpoint is `image`.

## Voice Flow

Voice generation is deliberately opt-in so an ElevenLabs request is made only when the user selects **Give my dog a voice** on a completed result.

```text
Completed dog analysis
    ↓
User selects “Give my dog a voice”
    ↓
POST /api/speak with the imagined dog thought
    ↓
Server validates and limits the text
    ↓
ElevenLabs text-to-speech generation
    ↓
MP3 audio player in the result card
```

`ELEVENLABS_VOICE_ID` is optional. When omitted, the server uses the app’s default voice. If `ELEVENLABS_API_KEY` is missing, image analysis continues to work and the voice request returns a configuration message without exposing server details.

## API Response

Successful analysis returns the following shape:

```ts
type DogAnalysis = {
  isDog: boolean;
  mood: string;
  confidence: number;
  signals: {
    happiness: number;
    energy: number;
    mischief: number;
  };
  observations: string[];
  thought: string;
  summary: string;
};
```

## Security and Privacy

- API keys are read only by server-side route handlers.
- Voice text is limited and validated before it is sent to ElevenLabs.
- Uploaded files are checked on both the client and server.
- Only JPEG, PNG, and WebP files up to 5 MB are accepted.
- Model responses are validated before reaching the UI.
- Client-facing errors do not expose credentials or stack traces.
- Uploaded images are used for the active analysis flow and are not published by the app.

Before deploying, add `GEMINI_API_KEY` and `ELEVENLABS_API_KEY` to the hosting provider’s encrypted environment variables. Do not commit `.env.local`.

## Production Verification

Before opening a pull request or deploying:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Deployment

Dog Mind can be deployed to any host that supports Next.js route handlers. For Vercel:

1. Import the repository.
2. Add `GEMINI_API_KEY` and `ELEVENLABS_API_KEY` under project environment variables.
3. Deploy using the standard Next.js settings.

No API key should be configured as a public environment variable.
