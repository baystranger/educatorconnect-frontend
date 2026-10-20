# Deploying Educator Connect on cPanel (frontend + backend in `public_html`)

This guide hosts the React frontend and the Laravel API on **one domain**. For example:

| URL | Served by |
| --- | --- |
| `https://yourdomain.com/` , `/jobs`, `/signin`, `/educator/...` | React build (`index.html`) |
| `https://yourdomain.com/api/v1/...` | Laravel |
| `https://yourdomain.com/sanctum/csrf-cookie` | Laravel |
| `https://yourdomain.com/oauth/google/redirect` | Laravel |
| `https://yourdomain.com/storage/...` | Uploaded files (Laravel storage) |

Because everything is on the same origin, login uses Laravel's secure session cookie. You don't need any CORS setup.

Replace `yourdomain.com` and `CPANELUSER` below with your real domain and cPanel username.

---

## 1. Final folder layout on the server

```text
/home/CPANELUSER/
├── educator-connect-backend/        ← the whole Laravel project (NOT web-accessible)
│   ├── app/  bootstrap/  config/  database/  resources/  routes/
│   ├── storage/                     ← must be writable
│   ├── vendor/
│   └── .env                         ← production settings
│
└── public_html/                     ← web root
    ├── .htaccess                    ← from deploy/cpanel (routes /api → Laravel, rest → React)
    ├── index.php                    ← from deploy/cpanel (Laravel front controller)
    ├── index.html                   ← React build
    ├── assets/                      ← React build
    ├── educator-connect-logo.png    ← React build
    ├── favicon.ico, robots.txt      ← copied from backend/public
    └── storage → ../educator-connect-backend/storage/app/public   (symlink)
```

> **Why is Laravel outside `public_html`?** Anything inside `public_html` can be downloaded from the browser. That includes `.env` (database password, `APP_KEY`), `vendor/` and `storage/logs`. Keeping the Laravel code one level up is the standard, secure cPanel setup. Only `index.php` and `.htaccess` sit inside `public_html`. If your host really forces you to keep everything inside `public_html`, see [Appendix A](#appendix-a--backend-folder-inside-public_html).

---

## 2. Build the frontend (on your computer)

```bash
cd C:\Users\ASUS\Project\EducatorProject
npm install
npm run build:cpanel
```

`build:cpanel` runs `vite build` and then copies `deploy/cpanel/.htaccess` and `deploy/cpanel/index.php` into `dist/`. **The `dist/` folder is now your complete `public_html`.**

The production build reads `.env.production`, which sets:

```env
VITE_API_BASE_URL=/api/v1
```

So the app calls the API on whatever domain it is opened from. You never need to rebuild just because the domain changes.

> Don't put `http://localhost:8000` in `.env.production`. If you do, the live site will try to reach your own PC.

---

## 3. Prepare the backend (on your computer)

```bash
cd C:\Users\ASUS\Project\educatorconnect\educator-connect-backend
composer install --no-dev --optimize-autoloader
```

Zip the backend folder, **excluding**:

- `node_modules/`
- `.env` (you will create a production one on the server)
- `public/storage` (it's a Windows symlink and will be broken on Linux)
- `storage/logs/*.log`, `docs.zip`, `tests/`

> If your cPanel has **Terminal** and Composer, you can upload the code without `vendor/` and run `composer install --no-dev --optimize-autoloader` on the server instead.

---

## 4. cPanel setup

### 4.1 PHP version

**cPanel → MultiPHP Manager**: set the domain to **PHP 8.2 or newer**.

**cPanel → Select PHP Version → Extensions**: make sure these are enabled: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `curl`, `zip`.

**cPanel → MultiPHP INI Editor** (or **Select PHP Version → Options**): videos can be up to 25 MB, so allow uploads of that size:

| Setting | Value |
| --- | --- |
| `upload_max_filesize` | `30M` |
| `post_max_size` | `32M` |
| `max_execution_time` | `120` |

### 4.2 Database

1. **cPanel → MySQL® Databases**: create a database, e.g. `CPANELUSER_educator`.
2. Create a user with a strong password.
3. Add the user to the database with **ALL PRIVILEGES**.

### 4.3 SSL

**cPanel → SSL/TLS Status → Run AutoSSL**. The site **must** run on `https://`, because the session cookie is marked `secure`.

### 4.4 Upload

1. **File Manager → `/home/CPANELUSER/`**: upload the backend zip and extract it so the folder is `/home/CPANELUSER/educator-connect-backend`.
2. **File Manager → `public_html`**: delete the old contents (default `index.html`, `cgi-bin` can stay). Upload the contents of `dist/` (not the `dist` folder itself), including the hidden `.htaccess`.
   - In File Manager, enable **Settings → Show Hidden Files** to see `.htaccess`.
3. Copy `favicon.ico` and `robots.txt` from `educator-connect-backend/public/` into `public_html/`.

> If you named the backend folder differently, edit this line in `public_html/index.php`:
> ```php
> $laravelRoot = __DIR__.'/../educator-connect-backend';
> ```

---

## 5. Backend `.env` (production)

Create `/home/CPANELUSER/educator-connect-backend/.env`:

```env
APP_NAME="Educator Connect"
APP_ENV=production
APP_KEY=                                  # generated in step 6
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Same domain as APP_URL: the SPA lives in the same public_html
FRONTEND_URL=https://yourdomain.com
FRONTEND_URL_ALTERNATE=https://www.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=CPANELUSER_educator
DB_USERNAME=CPANELUSER_dbuser
DB_PASSWORD="your-db-password"

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
BROADCAST_CONNECTION=log

# Mail: use the email account you created in cPanel → Email Accounts
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=mail.yourdomain.com
MAIL_PORT=465
MAIL_USERNAME=no-reply@yourdomain.com
MAIL_PASSWORD="your-email-password"
MAIL_FROM_ADDRESS="no-reply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Social login (leave empty until you have credentials)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://yourdomain.com/oauth/google/callback
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=https://yourdomain.com/oauth/linkedin/callback
```

### The settings that matter for login

| Setting | Must be | What happens if it's wrong |
| --- | --- | --- |
| `APP_URL` | `https://yourdomain.com` | Wrong storage/image URLs; domain not treated as stateful |
| `FRONTEND_URL` | `https://yourdomain.com` | Email links / OAuth redirects go to `localhost:5173` |
| `SANCTUM_STATEFUL_DOMAINS` | your domain (with and without `www`) | **"Please sign in to continue."** right after logging in |
| `SESSION_SECURE_COOKIE` | `true` (site on https) | Cookie not stored or rejected |
| `SESSION_DOMAIN` | `null` | Cookie set for the wrong host → logged out instantly |

> `config/sanctum.php` and `config/cors.php` also add the hosts of `APP_URL` and `FRONTEND_URL` (plus `www.`) automatically. So login keeps working even if `SANCTUM_STATEFUL_DOMAINS` is forgotten, as long as `APP_URL` is correct.

---

## 6. Run the setup commands

Open **cPanel → Terminal** (or SSH):

```bash
cd ~/educator-connect-backend

php artisan key:generate --force          # only on the first deploy
php artisan migrate --force               # creates all tables (incl. sessions, jobs, cache)
php artisan db:seed --force               # roles & permissions (required for sign-up/login)
php artisan app:create-admin you@yourdomain.com --name="Your Name"   # moderation console at /admin (asks for a password)

# Uploaded files: public_html/storage → backend storage
ln -s ~/educator-connect-backend/storage/app/public ~/public_html/storage

# Permissions
chmod -R 775 storage bootstrap/cache

# Production caches (run again after every .env change)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> If `php` points to an old version in Terminal, use the full path, e.g. `/usr/local/bin/ea-php82 artisan ...` or `/opt/cpanel/ea-php82/root/usr/bin/php artisan ...`.

**No Terminal access?** Create the symlink with a one-off cron job (step 7) running the same `ln -s ...` command once. Run the artisan commands the same way, then remove the cron entries.

> Only run `php artisan db:seed --class=DemoSeeder --force` if you want the demo centres/educators on the live site (password `DemoPass123!`). Don't use it for a real launch.

---

## 7. Cron jobs (queue + scheduler)

Notifications and emails are **queued**, and the app has scheduled clean-up tasks. Without these crons, emails are never sent.

**cPanel → Cron Jobs**. Add both, set to **Every minute** (`* * * * *`):

```bash
cd /home/CPANELUSER/educator-connect-backend && php artisan schedule:run >> /dev/null 2>&1
```

```bash
cd /home/CPANELUSER/educator-connect-backend && php artisan queue:work --stop-when-empty --max-time=55 --tries=3 >> /dev/null 2>&1
```

---

## 8. Social login callbacks (when you have credentials)

- **Google Cloud Console → Credentials → OAuth client → Authorized redirect URIs**: `https://yourdomain.com/oauth/google/callback`
- **LinkedIn Developer Portal → Auth → Redirect URLs**: `https://yourdomain.com/oauth/linkedin/callback`

Put the client ID and secret in `.env`, then run `php artisan config:cache`.

---

## 9. Verify the deployment

1. `https://yourdomain.com/up` → Laravel health page (green).
2. `https://yourdomain.com/api/v1/meta/options` → JSON.
3. `https://yourdomain.com/` → home page loads; refresh on `/jobs` still works (no 404).
4. Sign up / sign in → you land on the dashboard and **stay signed in after refreshing the page**.
5. Browser DevTools → Application → Cookies: `educator-connect-session` (named after `APP_NAME`) and `XSRF-TOKEN` exist for `yourdomain.com`.
6. Upload a profile photo → image shows (storage symlink works).
7. `https://yourdomain.com/.env` → **403/404** (must never show the file).

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| **"Please sign in to continue."** right after login | Domain not stateful → Laravel returned a token instead of a session cookie | Set `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS` to your real domain, then `php artisan config:clear && php artisan config:cache`. Make sure you uploaded the updated `config/sanctum.php`. |
| Same, only when using `www.` (or only without it) | Mixed www / non-www | Visit one consistently; both are listed automatically from `APP_URL`, or add a redirect to one version |
| Still logged out after changing `.env` | Old cached config | `php artisan config:clear` then `php artisan config:cache` |
| "Your session expired" (419) | Site on `http://`, or old cookies | Use https (`.htaccess` forces it), clear cookies for the domain |
| "We couldn't reach Educator Connect" | Frontend built with a `localhost` API URL | Check `.env.production` is `VITE_API_BASE_URL=/api/v1`, rebuild, re-upload `dist/` |
| 404 when refreshing `/educator/dashboard` | `.htaccess` missing from `public_html` | Upload `dist/.htaccess` (hidden file) |
| `/api/...` returns the React page | `.htaccess` missing or `mod_rewrite` off | Re-upload `.htaccess`; ask host to enable `mod_rewrite` |
| 500 error on every API call | Wrong DB credentials, missing `APP_KEY`, unwritable `storage/` | Check `~/educator-connect-backend/storage/logs/laravel.log`; run steps 5–6 again |
| "Something went wrong" on sign-up | Roles not seeded | `php artisan db:seed --force` |
| Uploaded images broken | Missing `public_html/storage` symlink or wrong `APP_URL` | Re-create the symlink (step 6) |
| Emails never arrive | Queue cron missing / SMTP wrong | Add the cron in step 7, check `MAIL_*` |
| Users see the old version after an update | Browser cached `index.html` | The `.htaccess` already sends `no-cache` for it; hard refresh once |

---

## 11. Deploying an update later

**Frontend changes:**

1. `npm run build:cpanel`
2. In `public_html`, delete the old `assets/` folder and upload the new `dist/` contents (`index.html`, `assets/`, `.htaccess`, `index.php`).
3. **Don't** delete `public_html/storage` (uploaded files).

**Backend changes:**

1. Upload the changed files into `~/educator-connect-backend` (never overwrite the server `.env` or `storage/`).
2. Then run:

```bash
cd ~/educator-connect-backend
composer install --no-dev --optimize-autoloader   # only if composer.json changed
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan queue:restart
```

---

## Appendix A — Backend folder inside `public_html`

Use this only if your host doesn't let you create folders next to `public_html`.

1. Upload Laravel to `public_html/educator-connect-backend/`.
2. In `public_html/index.php`, change:
   ```php
   $laravelRoot = __DIR__.'/educator-connect-backend';
   ```
3. Create `public_html/educator-connect-backend/.htaccess` containing only:
   ```apache
   Require all denied
   ```
4. Create the storage symlink accordingly:
   ```bash
   ln -s ~/public_html/educator-connect-backend/storage/app/public ~/public_html/storage
   ```
5. Check that `https://yourdomain.com/educator-connect-backend/.env` returns **403**. If it doesn't, stop and fix this before going live.

---

## Files involved in this setup

| File | Purpose |
| --- | --- |
| `deploy/cpanel/.htaccess` | Routes `/api`, `/sanctum`, `/oauth`, `/storage`, `/up` to Laravel and everything else to React; forces https; blocks dotfiles; cache headers |
| `deploy/cpanel/index.php` | Laravel front controller that loads the app from `../educator-connect-backend` and sets `public_path()` to `public_html` |
| `.env.production` | Frontend production env (`VITE_API_BASE_URL=/api/v1`) |
| `src/lib/api.js` | Accepts relative API URLs; defaults to the same origin in production |
| backend `config/sanctum.php` | Automatically treats the `APP_URL`/`FRONTEND_URL` hosts as stateful (cookie sessions) |
| backend `config/cors.php` | Allows the `APP_URL`/`FRONTEND_URL` origins (with/without `www.`) |
