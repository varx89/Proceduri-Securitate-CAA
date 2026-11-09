# Proceduri & Politici NIS

Aplicație Next.js pentru publicarea procedurilor și politicilor NIS (PDF), cu zonă de administrare protejată.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- MySQL 8 prin Sequelize + mysql2 (tabelele se creează automat la prima conexiune)
- Bootstrap 5, motion
- Autentificare JWT în cookie HTTP-only, `secure` în producție

## Variabile de mediu

Toate setările sunt în env — vezi [.env.example](.env.example). Local: copiază-l în `.env.local`.

| Variabilă | Rol |
|---|---|
| `JWT_SECRET` | semnează token-ul de login (obligatoriu) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | conexiunea MySQL |
| `REGISTER_SLUG` | calea secretă a paginii de înregistrare: `https://domeniu/<REGISTER_SLUG>`; gol = dezactivată |
| `SECURE_LOGIN` | `false` doar pentru HTTP simplu; implicit cookie-ul e HTTPS-only în producție |
| `UPLOAD_DIR` | folderul PDF-urilor (implicit `./uploads`, în Docker `/app/uploads`) |

## Local

```bash
npm install
npm run dev
```

Primul utilizator se creează din pagina `/<REGISTER_SLUG>`.

## Deploy pe Coolify

1. **MySQL**: în Coolify → New Resource → Database → MySQL. Notează host-ul intern, userul, parola și baza.
2. **Aplicația**: New Resource → din repo-ul GitHub, Build Pack **Dockerfile**, port **3000**.
3. **Environment Variables**: `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `REGISTER_SLUG`.
4. **Persistent Storage**: un volum montat la `/app/uploads` (altfel PDF-urile se pierd la fiecare deploy).
5. **Domeniu**: pune domeniul cu `https://` (ex. `https://proceduri.exemplu.ro`). Coolify emite automat certificatul Let's Encrypt și redirecționează HTTP → HTTPS.

## Structură

```
app/                 pagini + rute API (auth, procedures, upload)
app/[slug]/          pagina secretă de înregistrare (doar pentru REGISTER_SLUG)
app/uploads/[file]/  servește PDF-urile din UPLOAD_DIR
components/          Header, FileUpload, ProcedureList, PDFViewer, RegisterForm
lib/                 auth, database (MySQL), uploads, register
models/              User, Procedure (Sequelize)
proxy.ts             redirect la /login pentru /dashboard fără cookie
```
