# 🚀 Quick Deployment Checklist

## Backend (Render)
1. ✅ Go to [render.com](https://render.com)
2. ✅ Connect GitHub repo
3. ✅ Create new Web Service
4. ✅ Set root directory: `server`
5. ✅ Add PostgreSQL database
6. ✅ Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-url.netlify.app
   DATABASE_URL=postgresql://... (auto-added by Render)
   ```
7. ✅ Deploy and get backend URL

## Backend (Railway) - Alternative
1. ✅ Go to [railway.app](https://railway.app)
2. ✅ Connect GitHub repo
3. ✅ Set root directory: `server`
4. ✅ Add PostgreSQL database
5. ✅ Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-url.netlify.app
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
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
5. ✅ Deploy and get frontend URL

## Frontend (Netlify) - Alternative to Vercel
1. ✅ Go to [netlify.com](https://netlify.com)
2. ✅ Connect GitHub repo
3. ✅ **IMPORTANT**: In build settings, set:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: `18`
4. ✅ Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
5. ✅ Deploy and get frontend URL

## Alternative: Use Configuration Files (Automatic)
If you have the configuration files in your repo:
- **Vercel**: `vercel.json` will automatically configure the build
- **Netlify**: `netlify.toml` will automatically configure the build
- **Render**: `render.yaml` will automatically configure the deployment

## Database Setup
1. ✅ In Render dashboard, go to backend service
2. ✅ Add command: `node database/setup.js`
3. ✅ Run the command to create tables and sample data

## Test Everything
1. ✅ Frontend loads: `https://your-app.netlify.app` or `https://your-app.vercel.app`
2. ✅ Backend health: `https://your-app.onrender.com/api/health`
3. ✅ Admin login: `admin@shoponthefly.com` / `admin123`
4. ✅ Create products
5. ✅ Test cart functionality

## URLs to Save
- **Frontend**: `https://your-app.netlify.app` (or Vercel URL)
- **Backend**: `https://your-app.onrender.com`
- **API**: `https://your-app.onrender.com/api`

## Troubleshooting
- **Build fails**: Make sure root directory is set to `client` in Netlify/Vercel
- **API not found**: Check that `REACT_APP_API_URL` is set correctly
- **Database errors**: Run the setup script in Render

🎉 Your ecommerce app is now live! 🛒✨ 