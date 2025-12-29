# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A minimal landing page documenting modern human rituals. Clean, simple design with Greek-inspired typography and subtle crimson accents.

## File Structure

```
/
├── index.html     # Main page
├── styles.css     # Minimal styling
└── CLAUDE.md      # This file
```

## Design

- **Font:** EB Garamond (serif)
- **Colors:** Dark background (#1a1a1a), muted taupe text (#b8b2a7), stone off-white accent (#c9c1b8)
- **Layout:** Left-aligned, max-width 700px, document-centric with simple text links
- **Style:** Dark mode with warm tones, austere, generous line-height (1.8), substantial spacing
- **Aesthetic:** Clean essay/document style, minimal, text-focused, vertical margin lines
- **Logo:** Greek letter Phi (Φ) symbolizing transformation
- **Inspiration:** Dionysus Program philosophy + Sankalp blog color palette

## Adding Links

To add a new ritual link, edit `index.html` and add inside the `<section class="index">`:

```html
<article class="ritual-entry">
    <a href="URL" target="_blank" class="ritual-link">Description of the ritual</a>
    <div class="ritual-meta">
        <span class="ritual-category">sports | religion | work | art</span>
        <span class="ritual-tag">tweet | video | article | audio | blog</span>
        <time class="ritual-date">Month DD, YYYY</time>
    </div>
</article>
```

**Categories:** sports, religion, work, art, culture, politics, etc.
**Media types:** tweet, video, article, audio, blog, etc.

## Development

Static HTML/CSS - no build process. Open `index.html` in a browser to view.
