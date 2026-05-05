# Deployment Checklist

Use this order to keep the current admin data safe.

## 1. Backup First

Local backups are in `Server/backups/`.

- Code/uploads snapshot: `backup-20260505-174205`
- MongoDB Extended JSON export: `mongo-ejson-export-20260505-175506`

The live product/category/admin data is in the `monsta` MongoDB database.

## 2. Database

Create a free MongoDB Atlas cluster and restore/import the `monsta` database data.

Use an Atlas URI that includes the database name:

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/monsta
```

## 3. Backend

Deploy `Server` as the backend service.

- Build command: `npm install`
- Start command: `npm start`
- Required env vars: copy from `Server/.env.example`
- `CONNECTIONURL` must point to the Atlas `monsta` database.
- Public API base will look like `https://your-backend.onrender.com/`

Important: free backend filesystems are ephemeral, so new admin uploads should use external storage such as Cloudinary or Vercel Blob for long-term safety.

## 4. Admin Panel

Deploy `Client/adminpanel`.

- Build command: `npm install && npm run build`
- Output directory: `dist`
- Env var:

```text
VITE_APIBASEURL=https://your-backend.onrender.com/admin/
```

## 5. Website

Deploy `Client/monsta`.

- Build command: `npm install && npm run build`
- Env var:

```text
NEXT_PUBLIC_APIBASEPATH=https://your-backend.onrender.com/web/
```

## 6. Media Uploads

Current local uploads are in `Server/uploads/` and are about 76 MB.

For truly no data loss on free hosting, migrate uploaded images/files to external media storage and update the upload middleware/API paths before relying on public admin uploads.
