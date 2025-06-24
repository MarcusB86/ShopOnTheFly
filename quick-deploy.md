# 🚀 Quick Deployment Checklist

## Backend (Railway)
1. ✅ Go to [railway.app](https://railway.app)
2. ✅ Connect GitHub repo
3. ✅ Set root directory: `server`
4. ✅ Add PostgreSQL database
5. ✅ Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   DATABASE_URL=postgresql://... (auto-added by Railway)
   ```
6. ✅ Deploy and get backend URL

## Frontend (Vercel)
1. ✅ Go to [vercel.com](https://vercel.com)
2. ✅ Connect GitHub repo
3. ✅ **IMPORTANT**: In project settings, set:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
4. ✅ Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
5. ✅ Deploy and get frontend URL

## Alternative: Use vercel.json (Automatic)
If you have the `vercel.json` file in your repo, Vercel will automatically:
- Use the correct build command
- Set the output directory
- Handle the monorepo structure

## Database Setup
1. ✅ In Railway dashboard, go to backend service
2. ✅ Add command: `node database/setup.js`
3. ✅ Run the command to create tables and sample data

## Test Everything
1. ✅ Frontend loads: `https://your-app.vercel.app`
2. ✅ Backend health: `https://your-app.railway.app/api/health`
3. ✅ Admin login: `admin@shoponthefly.com` / `admin123`
4. ✅ Create products
5. ✅ Test cart functionality

## URLs to Save
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API**: `https://your-app.railway.app/api`

## Troubleshooting
- **Build fails**: Make sure root directory is set to `client` in Vercel
- **API not found**: Check that `REACT_APP_API_URL` is set correctly
- **Database errors**: Run the setup script in Railway

🎉 Your ecommerce app is now live! 🛒✨ 