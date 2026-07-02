# Site vitrine dynamique avec galerie media + espace admin

Projet full-stack avec :

- Frontend : Next.js
- Backend : Node.js + Express
- Base de donnees : MongoDB Atlas
- Stockage media : Cloudinary

## Structure

```txt
frontend/   Application Next.js
backend/    API Express + MongoDB + Cloudinary
```

## Demarrage

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Prochaine configuration

1. Creer un cluster MongoDB Atlas.
2. Creer un compte Cloudinary.
3. Remplir les variables dans `backend/.env`.
4. Creer un admin avec une route seed ou directement dans MongoDB.

## Deploiement Render + Vercel

### 1. Backend sur Render

Le fichier `render.yaml` est pret pour deployer l'API depuis le dossier `backend/`.

Dans Render, cree un nouveau Web Service connecte au repo, puis utilise :

- Root directory : `backend`
- Build command : `npm install`
- Start command : `npm start`
- Health check path : `/api/health`

Variables a ajouter dans Render :

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/media_showcase
JWT_SECRET=une_valeur_longue_et_secrete
FRONTEND_URL=https://ton-site.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Si tu veux autoriser plusieurs URLs frontend, separe-les par des virgules :

```env
FRONTEND_URL=https://ton-site.vercel.app,https://ton-site-git-main.vercel.app
```

### 2. Frontend sur Vercel

Dans Vercel, importe le meme repo puis configure :

- Root directory : `frontend`
- Framework : Next.js
- Build command : `npm run build`

Variable a ajouter dans Vercel :

```env
NEXT_PUBLIC_API_URL=https://ton-backend.onrender.com/api
```

### 3. Ordre recommande

1. Deployer le backend sur Render.
2. Copier l'URL Render, par exemple `https://hana-events-api.onrender.com`.
3. Deployer le frontend sur Vercel avec `NEXT_PUBLIC_API_URL=https://hana-events-api.onrender.com/api`.
4. Copier l'URL Vercel.
5. Mettre a jour `FRONTEND_URL` dans Render avec l'URL Vercel exacte.
6. Redeployer le backend Render pour appliquer le CORS.

### 4. Creation admin en production

Pour creer un admin, renseigne temporairement ces variables dans Render :

```env
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=mot_de_passe_fort
```

Puis lance la commande `npm run create-admin` depuis le shell Render. Retire ensuite `ADMIN_PASSWORD` des variables si tu ne veux pas le garder dans l'environnement.
