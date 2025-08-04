# Goals - Smart Goal Management System

A modern web application for managing long-term goals using the SMART methodology. Built with Svelte 5 and designed for desktop-first experience with mobile support.

🌐 **Live Demo**: [https://goals.hotay.dev](https://goals.hotay.dev)

## 🎯 Features

- **SMART Goal Setting**: Create Specific, Measurable, Achievable, Relevant, and Time-bound goals
- **Milestone Management**: Break down goals into manageable milestones
- **Task Organization**: Create tasks for each milestone with SMART criteria
- **Value x Effort Matrix**: Prioritize tasks using the value vs effort prioritization framework
- **Internationalization**: Support for English and Brazilian Portuguese
- **Data Backup**: Export/import goals as JSON files
- **Modern UI**: Clean, responsive interface with dark/light theme support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hotaydev/goals.git
cd goals
```

2. Install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

### Code Quality

Check TypeScript types:

```bash
pnpm check
```

Format code:

```bash
pnpm format
```

## 🏗️ Tech Stack

- **Frontend**: Svelte 5 with runes mode
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Internationalization**: Paraglide.js
- **Icons**: Lucide Svelte
- **Package Manager**: pnpm

## 📱 Platform Support

- **Desktop**: Primary target platform with optimized UI
- **Mobile**: Responsive design with ongoing improvements
- **Future**: Tauri integration planned for native desktop app

## 📋 Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── stores/         # State management
│   ├── services/       # Utility functions
│   └── models/         # Type definitions
├── routes/             # SvelteKit pages
└── app.css             # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check` and `pnpm format`
5. Submit a pull request

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.
