# Proceduri & Politici NIS

Aplicație Next.js pentru publicarea procedurilor și politicilor NIS (PDF), cu zonă de administrare protejată.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- MySQL 8 prin Sequelize + mysql2
- Bootstrap 5, motion
- Autentificare JWT în cookie HTTP-only (bcryptjs)

## Configurare

1. Instalează dependențele:
   ```bash
   npm install
   ```
2. Creează `.env.local`:
   ```env
   JWT_SECRET=un-secret-lung
   SECURE_LOGIN=false
   DATABASE_URL=mysql://root:parola@localhost:3306/proceduri
   ```
3. Baza de date — una din variante:
   - **Cu datele existente** (migrate din vechiul SQLite):
     ```bash
     mysql -u root -p < mysql/init.sql
     ```
   - **Bază goală** (creează baza, tabelele și userul admin `proceduri`):
     ```bash
     npm run db:init
     ```
4. Pornire:
   ```bash
   npm run dev
   ```
   Producție: `npm run build` apoi `npm start` (port 3000).

## Docker

`docker compose up -d --build` pornește Traefik, MySQL 8.4 și aplicația. La prima pornire MySQL importă automat `mysql/init.sql`. Parola root se setează prin variabila `MYSQL_ROOT_PASSWORD`. PDF-urile se păstrează în `public/uploads`.

## PM2 (Windows)

Pornire: `#pm2_pornire_app.bat`

```
pm2 list
pm2 restart proceduri-next
pm2 logs proceduri-next
```

Serviciu Windows care repornește PM2 la boot:

```
sc create PM2 binPath= "\"C:\Users\administrator\AppData\Roaming\npm\pm2.cmd\" resurrect" start= auto
```

## Structură

```
app/            pagini + rute API (auth, procedures, upload)
components/     Header, FileUpload, ProcedureList, PDFViewer
lib/            auth.ts, database.ts (conexiune MySQL)
models/         User, Procedure (Sequelize)
mysql/init.sql  schema + date migrate
scripts/        init-db.mjs
proxy.ts        redirect la /login pentru /dashboard fără cookie
public/uploads  fișierele PDF
```
"# Proceduri-Securitate-CAA" 
