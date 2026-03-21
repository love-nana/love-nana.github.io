# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static GitHub Pages website (hosted at love-nana.cn) featuring a couple's relationship memory site. It consists of pure HTML/CSS/JS with no build tools or package management.

## Project Structure

```
├── index.html          # Landing page - relationship statistics and timeline
├── index.css           # Landing page styles
├── index.js            # Landing page logic (day counters, music player)
├── gallery.html        # Photo gallery with masonry/waterfall layout
├── gallery.js          # Gallery rendering with category filtering
├── gallery.css         # Gallery styles
├── gallery-edit.html   # Admin page for editing gallery photos
├── gallery-edit.js     # Photo upload and management logic
├── cook.html           # Food/cooking memory page
├── cook.js             # Cooking page logic
├── cook.css            # Cooking page styles
├── cooking-edit.html   # Admin page for editing food entries
├── cooking-edit.js     # Food entry management logic
├── detail.html         # Photo detail view page
├── detail.js           # Detail page logic
├── foodData.json       # Local data for food memories (fallback/seed data)
├── components/         # Reusable UI components
│   ├── cos.js          # Tencent Cloud COS SDK integration
│   ├── login.js/css    # Login modal component for COS auth
│   ├── loading.js/css  # Loading spinner overlay
│   ├── load-more.js/css # Infinite scroll/load more
│   ├── category.js/css # Category filter buttons
│   ├── notification.js/css # Toast notifications
│   └── zoomIn.js/css   # Image zoom modal
└── imgs/               # Static image assets (favicon, emoji images)
```

## Architecture

### Storage Architecture

The site uses **Tencent Cloud COS (Cloud Object Storage)** as its primary data store:

- Images are uploaded directly to COS from the browser using the COS JavaScript SDK
- Metadata (photo titles, descriptions, categories, dates) is stored as JSON files in COS
- The `components/cos.js` file handles all COS operations:
  - `getCosUrl()` - Gets signed URLs for viewing images (cached in localStorage for 14 minutes)
  - `uploadFiles()` - Uploads images to COS with timestamp-based filenames
  - `uploadStrFile()` - Uploads JSON metadata files
- COS credentials (SecretId/SecretKey) are entered via a login modal and stored in localStorage

### Page Types

1. **Public Pages** (no auth required):
   - `index.html` - Landing page with relationship stats
   - `gallery.html` - Photo gallery with category filtering
   - `cook.html` - Food memory waterfall
   - `detail.html` - Individual photo detail view

2. **Edit Pages** (require COS credentials):
   - `gallery-edit.html` - Upload photos, edit metadata, delete entries
   - `cooking-edit.html` - Manage food memories

### Key External Dependencies

Loaded from CDNs (no package.json):
- Chart.js + chartjs-plugin-datalabels (for statistics charts on index)
- Font Awesome 6.4.0 (icons)
- Masonry.js (waterfall layout)
- imagesLoaded.js (detect when images load)
- PullToRefresh.js (mobile pull-to-refresh)
- COS JS SDK v5 (Tencent Cloud storage)
- html2canvas (screenshot generation)

### Data Flow

1. Gallery page loads `foodData.json` from COS via signed URL
2. Image URLs in the JSON are relative COS paths
3. `getCosUrl()` converts paths to signed URLs with localStorage caching
4. Masonry layout is applied after images load

## Common Development Commands

Since this is a static site with no build process:

```bash
# Start a local server for testing
python3 -m http.server 8000

# Or with Node.js
npx serve .

# No build, lint, or test commands exist
```

## Key Implementation Notes

- **Date calculation**: `index.js` calculates days since relationship milestones (June 19, 2025 for meeting, August 3, 2025 for relationship start)
- **Image caching**: COS signed URLs expire; localStorage caches URLs for 14 minutes (`getPicFromCache()` / `savePicToCache()`)
- **Category system**: Photos have categories: 全部 (all), 我们, 日常, 心情, 美食, 旅行, 心愿
- **Image quality**: Gallery uses `&imageMogr2/quality/30` parameter for COS image compression
- **Authentication**: COS credentials stored in localStorage keys `local_cosId`, `local_cosToken`, `local_user`

## GitHub Pages Deployment

The site deploys automatically from the `master` branch via GitHub Pages. The custom domain `love-nana.cn` is configured in the `CNAME` file.
