# Employee Management System - Deployment Guide

## Overview
This is a full-stack application with:
- **Frontend**: React + Vite (Deploy on Vercel)
- **Backend**: Node.js + Express + MongoDB (Deploy on Render)
- **Database**: MongoDB Atlas (Cloud)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Post-Deployment Configuration](#post-deployment-configuration)

---

## Prerequisites

Before starting, ensure you have:
- GitHub account (free)
- Render account (https://render.com - free tier available)
- Vercel account (https://vercel.com - free tier available)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas - free tier available)
- Git installed locally

---

## GitHub Setup

### 1. Create a GitHub Repository

```bash
# Initialize git in your project (if not done already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Employee Management System"

# Create a new repository on GitHub and get the remote URL
git remote add origin https://github.com/YOUR_USERNAME/emp-management.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Repository Structure on GitHub
Ensure your repository has this structure:
```
emp-management/
├── backend/          # Node.js backend
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/         # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── index.html
└── README.md
```

---

## MongoDB Atlas Setup

### 1. Create a MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project
4. Click "Build a Database" and choose the **FREE** tier
5. Select your preferred region (closest to your deployment)
6. Wait for cluster to be created (5-10 minutes)

### 2. Create Database User

1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Grant **Read and write to any database** permission
6. Click **Add User**

### 3. Get Connection String

1. Go to **Databases** and click **Connect**
2. Choose "Drivers" → "Node.js"
3. Copy the connection string, it should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials
5. Keep this string safe - you'll need it for Render

### 4. Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (for development, or specify IP ranges)
4. Confirm

---

## Backend Deployment (Render)

### 1. Create Render Service

1. Go to [Render.com](https://render.com)
2. Sign up using GitHub (recommended) or email
3. Click **New →  Web Service**
4. Select **Deploy an existing repository**
5. Connect your GitHub account and select your `emp-management` repository
6. Configure the service:
   - **Name**: `emp-management-backend` (or your preference)
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Add Environment Variables

In the Render dashboard, click on your service and go to **Environment**:

Add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employees?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PORT=10000
JWT_SECRET=your_jwt_secret_key_here
```

**Replace with your actual values:**
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `FRONTEND_URL`: Your Vercel frontend URL (get this after deploying frontend)
- `JWT_SECRET`: A strong random string (generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 3. Deploy

Click **Create Web Service**. Render will automatically:
- Clone your repository
- Install dependencies
- Build and deploy the app
- Assign you a URL like: `https://emp-management-backend.onrender.com`

**Note**: Free tier instances sleep after 15 minutes of inactivity. For production, upgrade to Starter plan.

### 4. Monitor Deployment

- Go to **Logs** tab to see real-time deployment progress
- Check if the service is running (green indicator)
- Test the API: `https://your-backend-url/api/auth/health`

---

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up using GitHub (recommended)
3. Click **Add New → Project**
4. Select your `emp-management` repository
5. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Add Environment Variables

Before deploying, add environment variables:

1. In the Vercel dashboard, go to **Settings → Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

Replace `https://your-backend-url.onrender.com` with your actual Render backend URL.

### 3. Deploy

Click **Deploy**. Vercel will:
- Clone the frontend code
- Install dependencies
- Build the React app
- Deploy to CDN

Your frontend will be available at: `https://your-project.vercel.app`

### 4. Update Backend Environment

Once you have the Vercel URL:
1. Go back to Render dashboard
2. Edit your backend service's environment variables
3. Update `FRONTEND_URL` to your Vercel URL
4. Click **Save and Deploy**

---

## Post-Deployment Configuration

### 1. Test the Application

1. Open your frontend URL in browser: `https://your-frontend.vercel.app`
2. Try logging in or creating an account
3. Check browser DevTools → Network tab to ensure API calls go to your Render backend

### 2. Common Issues & Fixes

**CORS Errors**
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check backend CORS configuration in `server.js`
- May need to restart Render service

**API Calls Failing**
- Verify `VITE_API_URL` in Vercel environment is correct
- Check Render logs for backend errors
- Ensure MongoDB Atlas connection string is valid

**Database Connection Issues**
- Verify MongoDB user credentials
- Check MongoDB Atlas IP whitelist allows all IPs
- Confirm connection string includes correct database name

### 3. Enable Automatic Deployments

Both Vercel and Render automatically deploy when you push to GitHub:
- Push changes to `main` branch
- Vercel automatically rebuilds frontend
- Render automatically rebuilds backend

### 4. Monitor Deployments

**Vercel Dashboard**:
- View deployment history in **Deployments** tab
- Check logs in **Functions** tab
- Monitor analytics in **Analytics** tab

**Render Dashboard**:
- View logs in **Logs** tab
- Monitor resource usage in **Metrics** tab
- Check service health status

---

## Troubleshooting

### Frontend won't load
```bash
# Check frontend build locally
cd frontend
npm run build
npm run preview
```

### Backend API errors
1. Check Render logs for errors
2. Verify all environment variables are set
3. Test MongoDB connection with MongoDB Compass using the Atlas connection string

### Deployment stuck
- Try manually triggering deployment from Vercel/Render dashboard
- Clear build cache in Vercel (Settings → Caches)

### Cold start delays
- Expected on Render free tier (15-30 seconds after inactivity)
- Consider upgrading to Starter plan for production

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and verified
- [ ] Database user credentials secure
- [ ] Backend environment variables configured on Render
- [ ] Frontend environment variables configured on Vercel
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] API communication verified (check browser Network tab)
- [ ] Authentication flow tested (register, login, logout)
- [ ] CORS properly configured
- [ ] JWT secret is strong and random
- [ ] Frontend URL in backend matches Vercel domain exactly
- [ ] Automatic deployments enabled on both platforms

---

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=10000
JWT_SECRET=your_strong_random_secret_key
```

### Frontend (.env or Vercel Environment Variables)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Upgrading from Free Tier

As your application grows:

**Render Backend**:
- Free tier: Spins down after 15 min inactivity
- Starter: $7/month - Always running
- Standard+: $29/month - Better performance

**Vercel Frontend**:
- Hobby (Free): Great for development
- Pro: $20/month - Priority support & faster builds

**MongoDB Atlas**:
- Free: 512 MB storage
- Shared: $9/month - Larger storage, better performance
- Dedicated: Custom pricing - For production workloads

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)

---

**Last Updated**: January 15, 2026
