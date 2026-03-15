# Code Editor with Syntax Highlighting - Specification

## Overview

Research and implementation plan for a code editor with automatic syntax highlighting, similar to ray.so functionality.

## Research Summary

### Ray.so Analysis

Ray.so is built by Raycast using:
- **Next.js** (App Router)
- **Custom syntax highlighting implementation**
- **Multiple tools**: Code Images, Icon Maker, Prompt Explorer, etc.
- **2.2k GitHub stars**, 324 forks

Key features from ray.so:
- Beautiful code images generation
- Multiple themes support
- Language selection
- Customizable fonts and styling

### Alternative: CodeSnap (Ray.so Clone)

A popular open-source clone with features:
- 38+ programming languages supported
- 11+ visual themes
- 19+ monospaced fonts
- Auto-detect language option
- Export to PNG, SVG, WEBP
- Uses **highlight.js** for syntax highlighting
- Tech stack: React, Vite, Tailwind, Zustand, Shadcn UI

## Recommended Solution

Based on the research and your existing tech stack (Next.js 16, Tailwind CSS v4, Shiki already in use), the recommended approach is:

### Primary: Shiki (Already Installed)

Your project already uses **Shiki** with the "vesper" theme. This is ideal because:

| Feature | Shiki | highlight.js | Prism |
|---------|-------|--------------|-------|
| Engine | TextMate (VS Code) | Custom parser | Custom tokenizer |
| Rendering | Server-side (HTML) | Client/server | Client-side |
| Client JS needed | No | Yes | Yes |
| Language support | 200+ | 190+ | 300+ |
| Zero-client JS | Yes | No | No |
| Line highlighting | Yes | Requires plugin | Requires plugin |
| Themes | VS Code themes | CSS-based | CSS-based |

**Advantages for your project:**
- Already integrated (vesper theme in use)
- Zero client-side JavaScript for highlighting
- Same highlighting as VS Code
- Server-side rendering (great for performance)
- Supports auto-language detection via `highlightAuto()`

### Architecture Options

#### Option A: Server Component with Shiki (Recommended)
- Use Shiki's `codeToHtml()` in a Server Component
- Best for: Read-only display with highlighting
- No client JS needed

#### Option B: Client Editor with Shiki
- Use `@shikijs/core` on client
- Best for: Interactive editing with live highlighting
- Slightly more complex

#### Option C: Hybrid Approach
- Display mode: Server-rendered with Shiki
- Edit mode: Use lightweight editor (prism-code-editor or react-textarea-code-editor)

## Implementation Requirements

### TODO: Features

- [ ] **Auto-detect language** - Use Shiki's `highlightAuto()` to detect language from pasted code
- [ ] **Language selector** - Dropdown to manually select language (override auto-detect)
- [ ] **Theme support** - Keep using vesper or allow theme switching
- [ ] **Editor component** - Integrate with code input for editing
- [ ] **Copy functionality** - Copy code with formatting

### TODO: Technical Implementation

1. **Create CodeEditor component** in `src/components/ui/code-editor.tsx`
2. **Add language detection** using Shiki's auto-detection
3. **Add language selector** UI component
4. **Style the editor** to match your design system
5. **Add to home page** with the code block

### Questions for Clarification

1. **Editor Type**: Should this be a read-only display (like ray.so image generation) or an interactive editor where users can type/edit code?

2. **Edit Mode**: If interactive, should highlighting happen:
   - Only on paste/blur (simpler)
   - Live as user types (more complex, may need debounce)

3. **Theme Preferences**: 
   - Keep vesper theme only?
   - Allow users to switch between multiple themes?

4. **Language Support**: Which languages are most important for your use case? (Shiki supports 200+, but we can optimize for specific ones)

5. **Home Page Integration**: Should the code block be:
   - A single large editor on the home page?
   - Multiple smaller components for different code snippets?

---

## Answers (Provided by User)

1. **Interactive editor** - Users can type/edit code directly
2. **Live highlighting** - Real-time highlighting as user types (with debounce for performance)
3. **Keep vesper theme** - Use existing theme from project
4. **Web + backend languages** - Focus on popular languages (JS, TS, Python, Rust, Go, etc.)
5. **Make components** - Modular components for home page (not single large editor)

---

## Implementation Details (Updated)

### Language Priorities

**Tier 1 - Web (High Priority):**
- JavaScript
- TypeScript
- HTML
- CSS
- JSON
- JSX/TSX

**Tier 2 - Backend (High Priority):**
- Python
- Rust
- Go
- Java
- C#
- Ruby
- PHP

**Tier 3 - Others:**
- SQL
- Bash/Shell
- Markdown
- YAML

### Editor Requirements

- **Live highlighting**: Debounced (150-300ms) to avoid performance issues
- **Theme**: Vesper (already in use)
- **Monospace font**: JetBrains Mono (already in use via CSS variables)
- **Features**:
  - Line numbers (optional)
  - Auto-indent
  - Tab support
  - Basic keyboard shortcuts (Cmd/Ctrl+A, Cmd/Ctrl+Z, etc.)

### Component Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── code-editor.tsx      # Main interactive editor
│   │   ├── language-selector.tsx # Language dropdown
│   │   └── code-preview.tsx     # Read-only preview (for other screens)
│   └── home/
│       ├── code-input.tsx       # Main code input component
│       └── code-roast-card.tsx  # Combined editor + roast output
```

---

## Implementation Plan

### Current Project Setup

**Already installed:**
- `shiki` v4.0.2 - Syntax highlighting (already integrated with vesper theme)
- `tailwind-variants` - Component variants
- `clsx`, `tailwind-merge` - CSS utilities
- Next.js 16, React 19

### Recommended: Custom Shiki Overlay Editor

Since Shiki is already installed, the best approach is building a custom lightweight editor:

**Architecture:**
1. **Transparent textarea** - For user input/editing
2. **Shiki-highlighted pre element** - Positioned behind textarea
3. **Matching fonts, padding, sizing** - Textarea text appears to have syntax highlighting

**Why this approach:**
- No additional dependencies needed
- Full control over styling
- True live highlighting
- Matches your design system

**Alternative packages to consider if needed:**
- `@uiw/react-textarea-code-editor` - ~96K weekly downloads, simple integration
- `prism-code-editor` - ~7K weekly downloads, lightweight

### Installation (if needed)

```bash
# Option A: uiw textarea editor (simpler)
npm install @uiw/react-textarea-code-editor

# Option B: prism-code-editor (lighter)
npm install prism-code-editor
```

### Implementation TODOs (Final)

- [x] **Create CodeEditor component** (`src/components/ui/code-editor.tsx`)
  - [x] Transparent textarea overlay with Shiki highlighting
  - [x] Debounced live highlighting (150ms)
  - [x] Match font-family, line-height, padding exactly
  - [x] Handle scroll synchronization
- [x] **Create LanguageSelector component** (`src/components/ui/language-selector.tsx`)
  - [x] Dropdown with popular languages
  - [x] Search/filter functionality
  - [x] Built-in to CodeEditor
- [x] **Create CodeInput component** for home (`src/components/home/code-input.tsx`)
  - [x] Integrated into CodeEditor
  - [x] Roast button integration
- [x] **Add language detection** using Shiki's `highlightAuto()`
- [x] **Style components** to match DevRoast design (JetBrains Mono, vesper theme)

### Recommended Approach for Live Editor

Based on requirements, the best options are:

**Option 1: prism-code-editor + Shiki (Hybrid)**
- Use prism-code-editor for the editing experience
- Apply Shiki highlighting on paste/blur (not live keystroke-by-keystroke)
- Simpler, better performance

**Option 2: Custom textarea + Shiki overlay**
- Overlay highlighted code behind transparent textarea
- Complex but provides true live highlighting

**Option 3: @uiw/react-textarea-code-editor**
- Already supports Shiki/highlight.js
- Simple integration
- Good for basic editing needs

I'll need to verify which packages are already installed before recommending.

## Library Comparison

| Library | Bundle Size | React Support | Auto-detect | Best For |
|---------|-------------|---------------|-------------|----------|
| Shiki | ~500KB (server) | Yes | Yes | Zero-client, Server rendering |
| highlight.js | ~50KB | Yes | Yes | Simple, client-side |
| Prism | ~20KB core | Yes | Yes | Lightweight, plugins |
| Monaco | ~2.5MB | Via wrapper | No | Full IDE features |
| Ace | ~400KB | Via wrapper | No | Full IDE features |

## References

- [Shiki Official Docs](https://shiki.style)
- [Shiki Next.js Integration](https://shiki.style/packages/next)
- [Ray.so GitHub](https://github.com/raycast/ray-so)
- [CodeSnap (Ray.so Clone)](https://github.com/ayusht777/codesnap-ray.so-clone)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
