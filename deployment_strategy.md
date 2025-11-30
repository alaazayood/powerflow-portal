# Deployment Strategy for PowerFlow Portal

## 1. Domain Structure
**Recommendation:** Use a subdomain, e.g., `portal.powerflowstudio.com` or `app.powerflowstudio.com`.
-   **Why?**
    -   **Security:** Isolates cookies and security policies from the main marketing site.
    -   **Performance:** Can be hosted on a different server/CDN than the main site.
    -   **Cleanliness:** `powerflowstudio.com` remains for marketing/SEO, while the portal is for authenticated users.

## 2. Infrastructure Options

### Option A: VPS (Virtual Private Server) - **Recommended**
-   **Providers:** DigitalOcean, Hetzner, AWS Lightsail, Linode.
-   **Cost:** ~$5-10/month.
-   **Setup:**
    -   **OS:** Ubuntu 22.04 LTS.
    -   **Web Server:** Nginx (Reverse Proxy).
    -   **Process Manager:** PM2 (for Node.js backend).
    -   **Database:** PostgreSQL (installed locally on VPS or managed).
-   **Pros:** Full control, cheapest for long-term, easy to scale vertically.
-   **Cons:** Requires manual setup and maintenance (updates, security).

### Option B: PaaS (Platform as a Service)
-   **Providers:** Render, Railway, Heroku.
-   **Cost:** Free tier (limited) to ~$15+/month.
-   **Setup:** Connect GitHub repo, auto-builds.
-   **Pros:** Zero maintenance, easy CI/CD, auto-HTTPS.
-   **Cons:** More expensive as you scale, "sleeping" instances on free tiers.

## 3. Technical Implementation Plan (VPS Approach)

1.  **Server Preparation**:
    -   Install Node.js (v18+), PostgreSQL, Nginx, Certbot (SSL).
2.  **Application Deployment**:
    -   Clone repository to `/var/www/powerflow-portal`.
    -   **Backend**:
        -   `npm install` & `npx prisma migrate deploy`.
        -   Start with PM2: `pm2 start src/index.ts --name "backend"`.
    -   **Frontend**:
        -   `npm install` & `npm run build`.
        -   Output goes to `dist` or `build` folder.
3.  **Nginx Configuration**:
    -   Serve Static Files: Point root to `frontend/dist`.
    -   Reverse Proxy API: Forward `/api` requests to `http://localhost:5000`.
    -   Handle React Router: Configure `try_files $uri /index.html` for SPA routing.
4.  **SSL/TLS**:
    -   Run `certbot --nginx -d portal.powerflowstudio.com` for free auto-renewing SSL.

## 4. Next Steps
If you agree with **Option A (VPS)** and the **Subdomain** strategy, we can proceed with:
1.  Creating the subdomain DNS record (A record pointing to VPS IP).
2.  Generating a detailed "Deployment Script" or "Walkthrough" to execute on the server.
