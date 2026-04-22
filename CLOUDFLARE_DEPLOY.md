# Deploying to Cloudflare Pages

Cloudflare Pages offers a free tier with **unlimited bandwidth and requests**
(unlike Netlify's 100 GB/month free cap), which makes it the recommended host
for this site. The repo is already configured — you only need to connect it
once via the Cloudflare dashboard.

## One-time setup

1. **Create a Cloudflare account** (free) at <https://dash.cloudflare.com/sign-up>
   if you don't already have one.

2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git**.

3. Authorise Cloudflare to access your GitHub account and pick the
   `loginfaster89-wq/passportprint` repository.

4. On the **Set up builds and deployments** screen, use these settings:

   | Field                     | Value               |
   | ------------------------- | ------------------- |
   | Production branch         | `main`              |
   | Framework preset          | `None`              |
   | Build command             | `npm run build`     |
   | Build output directory    | `dist`              |
   | Root directory            | `/` (leave blank)   |

5. Under **Environment variables (advanced)**, add:

   | Variable       | Value  |
   | -------------- | ------ |
   | `NODE_VERSION` | `20`   |

6. Click **Save and Deploy**. The first build takes ~1–2 minutes.

7. Your site will be live at `https://passportprint.pages.dev` (or a similar
   `<project>.pages.dev` URL shown in the dashboard). Every push to `main`
   triggers an auto-deploy; pull requests get preview deploys on unique URLs.

## Custom domain (optional)

To use your own domain (e.g. `studioprint.com`):

1. In the Pages project, open **Custom domains → Set up a custom domain**.
2. Enter your domain and follow the DNS instructions Cloudflare shows.
3. If the domain is already on Cloudflare, DNS records are added automatically.
   Otherwise, add a `CNAME` record at your DNS provider pointing to the
   `*.pages.dev` hostname Cloudflare gives you.

## Update the backend CORS allow-list

The backend (`loginfaster89-wq/PassportPrint-Studio`) already allows
`https://studioprint.netlify.app` by default. Once the Cloudflare URL is live,
add it to the Render service's `CORS_ORIGINS` environment variable so the
`passport-photo.html` page can call the API:

```
CORS_ORIGINS=https://passportprint.pages.dev,https://studioprint.netlify.app
```

(Replace the first value with whatever Cloudflare assigns you, plus any custom
domain.) Edit on the Render dashboard → **Environment** tab, then redeploy.

## Update Google Sign-In origins

If Google Sign-In is configured, add the new origin to the OAuth client:

1. Go to <https://console.cloud.google.com/apis/credentials>.
2. Open the OAuth 2.0 Client ID used by the site
   (`216240284102-d63glsohcp2lr85kk1el364f7gecnv9q...`).
3. Under **Authorized JavaScript origins**, add your Cloudflare URL
   (e.g. `https://passportprint.pages.dev`) and any custom domain.
4. Save. Changes take effect within a few minutes.

## After the Cloudflare URL is assigned

Once you know the final public URL, open a follow-up PR to update the
canonical / Open Graph tags and contact pages that currently reference
`studioprint.netlify.app`:

- `index.html` — `og:url` and `canonical`
- `contact.html`, `privacy.html`, `terms.html` — visible "Website" links

Not blocking for the initial deploy (the site works either way), but worth
tidying up for SEO once you pick the permanent URL.
