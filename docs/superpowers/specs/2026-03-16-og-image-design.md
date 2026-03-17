# OpenGraph Image Generation for Roast Sharing

**Date:** 2026-03-16

## Overview

Generate OpenGraph (OG) images automatically when users share roast result links. The OG image displays the roast score, verdict, language info, and roast message in a visually appealing card matching the existing design system.

## Goals

- Enable rich link previews when sharing roast URLs on social platforms
- Generate OG images dynamically when metadata is requested
- No storage required - images generated on-demand per roast ID

## Non-Goals

- Real-time OG image generation on every metadata request
- Custom OG image templates/editor
- Video/GIF OG outputs

## Design

### 1. OG Image Generation API

Create `/app/api/og/[id]/route.ts`:

- **Method:** GET
- **Input:** Roast ID from URL params
- **Output:** Image file (PNG/WebP) with appropriate content-type headers
- **Dimensions:** 1200x630px (standard OG size)

**Rendering Engine:** `@takumi-rs/image-response`

**JSX Template:**

```tsx
<div style={{
  width: 1200, height: 630,
  background: '#0C0C0C',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  gap: 28, padding: 64
}}>
  {/* Logo */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: '#10B981', fontSize: 24, fontWeight: 700 }}>{">"}</span>
    <span style={{ color: '#FAFAFA', fontSize: 20, fontFamily: 'JetBrains Mono' }}>devroast</span>
  </div>
  
  {/* Score */}
  <div style={{ display: 'flex', alignItems: 'end', gap: 4 }}>
    <span style={{ color: '#F59E0B', fontSize: 160, fontWeight: 900, lineHeight: 1 }}>{score}</span>
    <span style={{ color: '#737373', fontSize: 56, lineHeight: 1 }}>/10</span>
  </div>
  
  {/* Verdict */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 12, height: 12, borderRadius: '50%', background: verdictColor }} />
    <span style={{ color: verdictColor, fontSize: 20 }}>{verdict}</span>
  </div>
  
  {/* Language info */}
  <span style={{ color: '#737373', fontSize: 16, fontFamily: 'JetBrains Mono' }}>
    lang: {language} · {lines} lines
  </span>
  
  {/* Roast quote - truncate if too long */}
  <p style={{ 
    color: '#FAFAFA', fontSize: 22, textAlign: 'center',
    fontFamily: 'IBM Plex Mono', lineHeight: 1.5,
    maxWidth: 1000, overflow: 'hidden', textOverflow: 'ellipsis'
  }}>
    "{roastContent.length > 200 ? roastContent.slice(0, 200) + '...' : roastContent}"
  </p>
</div>
```

**Verdict Colors:**
- `decent_code`: #10B981 (green)
- `needs_work`: #F59E0B (amber)
- `needs_improvement`: #F97316 (orange)
- `needs_serious_help`: #EF4444 (red)

### 2. Share Button Implementation

In `roast/[id]/page.tsx`:

- Enable share button (remove `disabled` prop)
- Add click handler:

```typescript
const handleShare = async () => {
  // Copy URL to clipboard
  await navigator.clipboard.writeText(window.location.href);
  
  // Show toast/feedback
};
```

**Note:** OG image is generated on-demand when social crawlers request the metadata, not when share button is clicked.

### 3. Metadata Integration

Update `generateMetadata` in `roast/[id]/page.tsx`:

```typescript
export async function generateMetadata({ params }) {
  const { id } = await params;
  const roast = await trpcCaller.metrics.getRoastById({ id });
  
  return {
    title: `${roast.score}/10 - ${roast.roastContent.slice(0, 50)}... | devroast`,
    openGraph: {
      title: `My code got roasted: ${roast.score}/10`,
      description: roast.roastContent,
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

### 4. Font Handling

- Use `@takumi-rs/image-response` built-in font support
- Configure fonts in Takumi options
- Fallback to system fonts if custom fonts fail to load

## User Flow

1. User submits code → receives roast with score/verdict
2. User clicks "share_roast" button
3. URL copied to clipboard
4. When shared link is opened by others or crawled by social bots, OG image is generated dynamically via `/api/og/[id]`
5. Social platforms display OG image in link previews

## Error Handling

| Scenario | Handling |
|----------|----------|
| Roast not found | Return 404 |
| Takumi rendering fails | Return default OG image or 500 |
| Database unavailable | Return 503 |

## Acceptance Criteria

- [ ] Share button is enabled and functional
- [ ] Clicking share copies URL to clipboard; OG image generated when crawlers request metadata
- [ ] OG image URL is copied to clipboard
- [ ] Sharing link shows OG preview on social platforms
- [ ] Metadata includes correct `og:image` tag
- [ ] OG image matches Pencil design (colors, fonts, layout)
- [ ] Works with all verdict types
- [ ] Graceful error handling for failures
