# Studio Print — Frontend

Static frontend for [Studio Print](https://passportprint-studio.onrender.com) — a browser-based passport photo, Aadhaar/PAN sheet and certificate tool for small print shops, studios, students and home users.

The backend (auth, payments, email OTP) lives in a separate repo:
**[loginfaster89-wq/PassportPrint-Studio](https://github.com/loginfaster89-wq/PassportPrint-Studio)** (deployed on Render).

## Local development

```bash
npm install
npm run build    # outputs to ./dist
```

There is no dev server — the site is plain HTML/CSS/JS. To preview:

```bash
npx http-server dist -p 8080
# or
python3 -m http.server 8080 --directory dist
```

Then open <http://localhost:8080>.

## Deploy

The build output in `dist/` is a plain static site. It can be deployed to any
static host. The repo is pre-configured for two hosts:

| Host              | Config file        | Build command   | Output dir |
| ----------------- | ------------------ | --------------- | ---------- |
| Cloudflare Pages  | `_headers`         | `npm run build` | `dist`     |
| Netlify           | `netlify.toml`     | `npm run build` | `dist`     |

Both hosts honour the Netlify-style `_headers` / `_redirects` convention, so
the same cache and security headers apply on either.

### Cloudflare Pages (primary — free, unlimited bandwidth)

See [`CLOUDFLARE_DEPLOY.md`](./CLOUDFLARE_DEPLOY.md) for step-by-step setup.

### Netlify (fallback)

Netlify reads `netlify.toml` automatically. If the site has been paused due to
the free-tier bandwidth limit, upgrade the plan or wait for the monthly reset
before reconnecting.

## Backend URL

`passport-photo.html` hardcodes the backend URL:

```js
const BACKEND_URL = 'https://passportprint-studio.onrender.com';
```

If the backend moves, update this value (and the CORS allow-list in the
backend repo's `server.js`).
