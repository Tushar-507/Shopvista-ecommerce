# ShopVista

A premium, fully responsive e-commerce storefront built with **React + Vite** on the front end and **Node.js, Express, MongoDB (Mongoose)** with **JWT authentication** on the back end.

The UI uses a dark navy, white and purple (`#6236F5`) palette, Poppins/Inter typography, rounded cards and smooth motion throughout. Every button, filter, form and cart action is wired up and functional.

---

## Highlights

- **Storefront** — hero, category grid, featured products, best sellers, promotional banner, benefits and a full footer.
- **Shop** — live search, category and price-range filters, sale filter, sorting (featured, price, popularity, rating), active-filter chips and load-more pagination. All state is synced to the URL, so filtered views can be shared or refreshed.
- **Product details** — thumbnail gallery, discount and savings, rating, specs, quantity stepper, add to bag, buy now, wishlist and related products.
- **Cart & wishlist** — persistent via `localStorage`, quantity limits tied to stock, free-shipping progress, subtotal/shipping/total, and a validated checkout with an order confirmation screen.
- **Authentication** — login and signup with inline validation, password visibility toggle, password-strength meter, JWT sessions and a profile menu. **Purchases require an account:** checkout and Buy Now send signed-out shoppers to signup, then return them to checkout with their bag intact.
- **My orders** — a signed-in order-history page at `/orders` showing every placed order with its status pill, line items, subtotal/shipping/total, payment method, delivery estimate and shipping address. Linked from the profile menu, mobile navigation and the checkout confirmation screen.
- **Resilience** — if the API is unavailable, the storefront automatically falls back to the shared local catalog and shows an offline banner with a retry action.
- **Accessibility & quality** — keyboard focus states, ARIA labels, reduced-motion support, loading skeletons, empty/error states. Lighthouse on the home page: **Accessibility 100, Best Practices 100, SEO 100**.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Front end | React 18, Vite 6, React Router 6, Lucide React, plain CSS |
| Back end | Node.js, Express 4, Mongoose 8, JWT, bcryptjs |
| Database | MongoDB — external URI or automatic in-memory instance |
| Tooling | npm, nodemon, concurrently |

---

## Quick start

**Requirements:** Node.js 18+ and npm. A local MongoDB is optional.

```bash
cd ShopVista

# 1. Install root tooling, client and server dependencies
npm install
npm run install:all

# 2. Start the API and the Vite dev server together
npm run dev
```

Then open **http://localhost:5173**.

The API runs on **http://localhost:5000** and Vite proxies `/api` requests to it.

> On the very first server start, `mongodb-memory-server` downloads a MongoDB binary, which can take a minute. Subsequent starts are fast.

### Demo account

| Email | Password |
| --- | --- |
| `demo@shopvista.com` | `shopvista123` |

The login page also has a **Demo account** button that fills these in.

---

## Scripts

Run from the `ShopVista` folder:

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the Vite client (`:5173`) and Express API (`:5000`) together |
| `npm run build` | Builds the production client into `client/dist` |
| `npm start` | Starts the API, which also serves `client/dist` |
| `npm run install:all` | Installs `client` and `server` dependencies |
| `npm run seed --prefix server` | Re-runs catalog/demo-user seeding against the configured database |

For a production-style run:

```bash
npm run build
npm start
# open http://localhost:5000
```

---

## Environment variables

Copy `server/.env.example` to `server/.env` and adjust as needed.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | API port |
| `MONGODB_URI` | _empty_ | MongoDB connection string. When empty, an in-memory MongoDB is started and seeded automatically |
| `JWT_SECRET` | dev fallback | Secret used to sign JWTs — set a long random value in production |
| `CLIENT_ORIGIN` | `http://localhost:5173,http://localhost:4173` | Comma-separated allowed CORS origins |
| `VITE_API_URL` | `/api` | Optional client override for the API base URL |

**Data persistence:** with `MONGODB_URI` unset, data lives in memory and resets whenever the server restarts (the catalog and demo user are reseeded each time). Set `MONGODB_URI` to a real database to persist users and orders.

---

## API reference

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Status, database connection and uptime |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/products` | List/filter products |
| `GET` | `/products/categories` | Categories with product counts |
| `GET` | `/products/:slug` | Single product plus related products |

`GET /products` query parameters:

| Parameter | Example | Notes |
| --- | --- | --- |
| `search` | `headphones` | Matches name, description and category name |
| `category` | `audio` | Category slug |
| `minPrice` / `maxPrice` | `100` / `300` | Inclusive price bounds |
| `sort` | `price-asc` | `featured`, `price-asc`, `price-desc`, `popularity`, `rating`, `newest` |
| `featured` | `1` | Only featured products |
| `bestseller` | `1` | Only best sellers |
| `sale` | `1` | Only discounted products |
| `limit` | `8` | Caps results (max 100) |

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account, returns `{ token, user }` |
| `POST` | `/auth/login` | Sign in, returns `{ token, user }` |
| `GET` | `/auth/me` | Current user (requires `Authorization: Bearer <token>`) |

### Orders

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/orders` | Place an order (requires `Authorization: Bearer <token>`). Prices and stock are validated server-side |
| `GET` | `/orders/mine` | Signed-in user's orders (requires auth) |

Shipping is **free over $100**, otherwise **$9.99**. Order numbers look like `SV-XXXXXXXXX`.

---

## Project structure

```
ShopVista/
├── client/
│   ├── public/                 # favicon + robots.txt
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, AuthShell, …
│   │   ├── context/            # Auth, Cart, Wishlist, Toast providers
│   │   ├── data/products.js    # re-export of the shared catalog
│   │   ├── pages/              # Home, Shop, ProductDetails, Cart, Checkout, Orders, …
│   │   ├── services/api.js     # REST client + local fallback
│   │   ├── styles/             # base, layout, components, pages, responsive
│   │   ├── utils/format.js     # price and discount helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/db.js        # external Mongo or in-memory fallback
│   │   ├── middleware/         # auth, error handling
│   │   ├── models/             # Product, User, Order
│   │   ├── routes/             # auth, products, orders
│   │   ├── utils/
│   │   ├── index.js            # Express app + static client serving
│   │   └── seed.js             # catalog + demo user seeding
│   └── .env.example
├── shared/catalog.js           # single source of 27 products + 7 categories
└── package.json
```

---

## Design system

- **Colors:** deep navy backgrounds (`#060A16`), elevated surfaces (`#0F1730`), purple accent (`#6236F5` / `#7C5CFF`), white text with muted slate secondary text.
- **Type:** Poppins for headings, Inter for body copy.
- **Shape:** 10–32 px radii, soft layered shadows, glassy sticky navigation.
- **Motion:** hover lifts, image zooms, scroll reveals, staggered card entrances, reduced-motion fallback.
- **Breakpoints:** 1100, 980, 820, 700, 600 and 430 px — including a slide-in filter drawer and mobile navigation.

---

## Notes

- Product photography is served from Unsplash; the URLs were checked and all resolve.
- Checkout is a realistic demo — no payment is captured and no card data is stored.
- Order history is tied to the signed-in account: new orders appear under **My orders** (`/orders`) immediately after checkout. Order statuses stay at `processing` because there is no admin status-update flow.
- The shared catalog in `shared/catalog.js` drives both the MongoDB seed and the client's offline fallback, so the two never drift apart.
