# 🍳 Audio Recipes

> **AI-powered cooking assistant. Vibe-coded in 1 day at hackathon.**

**Live Demo:** [https://audio-recipes.pavlin.dev/](https://audio-recipes.pavlin.dev/)

## 🚀 What is this?

A hands-free cooking companion that transforms any recipe into an interactive audio experience. No more greasy fingerprints on your phone screen while cooking!

**The problem:** Traditional recipe apps require constant touch interaction while cooking, leading to messy screens and interrupted workflow.

**The solution:** Voice-controlled, step-by-step audio guidance with AI-powered recipe parsing and OpenAI text-to-speech synthesis.

## ✨ Features

### 🧠 AI-Powered Recipe Processing
- **GPT-3.5 Turbo** intelligently parses any recipe format into clear, actionable steps
- Optimizes text for speech synthesis (converts "350°F" → "350 degrees Fahrenheit", "1/2 cup" → "one half cup")
- Handles messy recipe inputs and extracts structured cooking instructions

### 🎙️ Advanced Voice Interface
- **OpenAI TTS** with 6 different voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- Adjustable speech speed (0.25x - 4.0x)
- **Web Speech API** for voice commands: "next", "previous", "repeat"
- Real-time audio caching and preloading for seamless experience

### 📱 Modern UX/UI
- **Material-UI** components with custom theming
- Responsive design optimized for kitchen environments
- Photo upload with **GPT-4 Vision** OCR for recipe extraction from images
- Drag-and-drop step reordering with `react-beautiful-dnd`
- Community recipe gallery with curated content

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Material-UI v7** - Modern component library
- **TypeScript** - Type safety throughout
- **Emotion** - CSS-in-JS styling

### Backend & AI
- **OpenAI GPT-3.5 Turbo** - Recipe parsing and structuring
- **OpenAI GPT-4 Vision** - OCR for recipe images
- **OpenAI TTS-1** - High-quality text-to-speech
- **Web Speech API** - Voice command recognition

### Additional Libraries
- `react-speech-recognition` - Voice command handling
- `react-beautiful-dnd` - Drag and drop functionality
- `tesseract.js` - Fallback OCR solution

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/audio-recipes.git
cd audio-recipes

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY

# Run development server
npm run dev
```

Visit `http://localhost:3000` and start cooking!

## 🏗️ Architecture

```
src/app/
├── api/
│   ├── parse-recipe/     # GPT-3.5 recipe parsing
│   ├── text-to-speech/   # OpenAI TTS endpoint
│   └── ocr/             # GPT-4 Vision OCR
├── components/
│   ├── StepPage.tsx     # Main cooking interface
│   ├── RecipeInput.tsx  # Recipe input with photo upload
│   └── InstructionList.tsx # Editable step overview
├── types/
│   └── recipe.ts        # TypeScript interfaces
└── utils/
    └── llmRecipeParser.ts # AI prompt engineering
```

## 🎯 Key Innovations

### 1. **Smart Recipe Parsing**
Uses carefully crafted prompts to convert any recipe format into speech-optimized steps:

```typescript
const SYSTEM_PROMPT = `You are a recipe parser that converts recipe text into clear, 
step-by-step instructions optimized for text-to-speech...`
```

### 2. **Intelligent Audio Management**
- Preloads next/previous steps for instant playback
- Manages audio instances to prevent overlapping sounds
- Caches generated audio for performance

### 3. **Voice Command Recognition**
Supports multilingual commands with fuzzy matching:
```typescript
const nextKeywords = ["next", "continue", "další", "pokrač"];
const previousKeywords = ["previous", "back", "zpátky", "předchozí"];
```

## 🎨 Design Philosophy

- **Kitchen-First**: Large buttons, high contrast, touch-friendly
- **Accessibility**: Voice-first interface, screen reader compatible  
- **Minimalist**: Clean interface that doesn't distract from cooking
- **Responsive**: Works on phones, tablets, and kitchen displays


## 🧪 Development

```bash
# Development with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 🚢 Deployment

Deployed on **Vercel** with automatic CI/CD:

```bash
# Deploy to Vercel
npx vercel

# Or connect your GitHub repo for automatic deployments
```

## 📝 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🤝 Contributing

This was a hackathon project, but PRs are welcome!

## 📄 License

MIT License - feel free to fork and build upon this!

---

**Made with ❤️ and lots of ☕ during a hackathon**

*"The future of cooking is hands-free, and it sounds amazing."*
