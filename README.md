# PrismYaoi

PrismYaoi is a MERN + Tailwind full-stack webtoon/manhwa streaming platform with a premium dark UI, neon gradient accents, virtual currency unlock flow, and admin analytics/content controls.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts

## Project Structure

```bash
.
├── server
│   ├── src
│   │   ├── config
│   │   ├── middleware
│   │   ├── models
│   │   └── routes
└── client
    ├── public
    └── src
        ├── components
        ├── context
        └── pages
```

## Features Implemented

### 1) Database & Models

- **User**: username, email, password, role (User/Admin), coin_balance, library, purchased_chapters, ban state.
- **Comic**: title, description, status, cover_image, tags, total_views, featured, chapters array.
- **Chapter**: chapter_number, title, images, is_premium, price_in_coins, comic reference.
- **Transaction**: user, amount, type (Purchase/Top-up), status, timestamp, chapter.

### 2) Frontend

- Home page with:
  - Featured hero slider
  - Trending Now section
  - New Releases grid
- Comic detail page with summary, tags, chapter list, lock state for premium chapters.
- Reader page with vertical scroll + sticky previous/next chapter navigation.
- Buy Coins page with coin tiers.
- Unlock Chapter modal to spend coins and unlock premium chapters.

### 3) Admin Dashboard

- Analytics:
  - Total users
  - Monthly revenue (top-up coins)
  - Top 5 most read comics
  - Daily coin transactions chart
- Content management:
  - Create comics
  - Add chapters
  - Set chapter pricing/premium state
- User management:
  - Ban/unban users
  - Manually adjust coin balances

### 4) SEO & Performance

- Dynamic per-comic SEO metadata through route-level Helmet tags.
- `sitemap.xml` and `robots.txt` included in `client/public`.
- Reader image lazy-loading enabled.

### 5) Design

- Dark theme base: `#0f172a`
- Neon purple/pink primary gradient
- Rainbow accent gradients for CTAs
- PrismYaoi branding in navbar/logo text

## Quick Start

### Prerequisites

- Node.js 20+ (tested on Node 22)
- MongoDB running locally or a Mongo connection string

### Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Default backend URL: `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

If needed, set `VITE_API_URL` in `client/.env` to point to your backend.

## Demo Credentials

- **Admin**
  - Email: `admin@prismyaoi.com`
  - Password: `admin123`

These are auto-seeded on first backend run when database is empty.
