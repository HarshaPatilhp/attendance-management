# Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### Method 1: Netlify CLI (Recommended)

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify
```bash
netlify login
```
This opens a browser window - authorize the app.

#### 3. Build Your Project
```bash
npm run build
```

#### 4. Deploy to Netlify
```bash
netlify deploy
```

**Follow the prompts:**
- Create & configure a new site? **Yes**
- Team: Select your team
- Site name: `aiml-attendance-system` (or your preferred name)
- Publish directory: `dist`

#### 5. Deploy to Production
```bash
netlify deploy --prod
```

Your site will be live at: `https://your-site-name.netlify.app`

---

### Method 2: Netlify Web UI (Drag & Drop)

#### 1. Build Your Project
```bash
npm run build
```
This creates a `dist` folder.

#### 2. Go to Netlify
- Visit [https://app.netlify.com/](https://app.netlify.com/)
- Login or create account

#### 3. Deploy
- Click "Add new site" → "Deploy manually"
- Drag & drop the `dist` folder
- Wait for deployment (usually 30-60 seconds)

#### 4. Your Site is Live!
- URL: `https://random-name-123.netlify.app`
- You can change the name in Site Settings

---

### Method 3: Git Integration (Continuous Deployment)

#### 1. Push to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AIML Attendance System"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/attendance-system.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Netlify
- Go to [Netlify](https://app.netlify.com/)
- Click "Add new site" → "Import an existing project"
- Choose "GitHub"
- Select your repository
- Configure build settings:
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
- Click "Deploy site"

#### 3. Automatic Deployments
Every time you push to GitHub, Netlify automatically rebuilds and deploys!

---

## ⚙️ Configuration Files Created

### `netlify.toml`
- Build settings
- Redirect rules for SPA
- Security headers
- Cache settings

### `public/_redirects`
- Backup redirect rule
- Ensures React Router works

### `.gitignore`
- Excludes node_modules, dist, etc.
- Prevents sensitive files from being committed

---

## 🔧 Build Settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18 |
| Package manager | npm |

---

## 🌐 Custom Domain (Optional)

### Using Netlify Subdomain
1. Go to Site Settings → Domain Management
2. Click "Options" → "Edit site name"
3. Change from `random-name-123` to `aiml-attendance`
4. New URL: `https://aiml-attendance.netlify.app`

### Using Custom Domain
1. Buy domain (e.g., GoDaddy, Namecheap)
2. Netlify: Site Settings → Domain Management
3. Add custom domain
4. Update DNS records as shown
5. Wait for DNS propagation (up to 24 hours)

---

## 🔒 Important Notes

### Location Services (HTTPS Required)
⚠️ **Location/GPS features ONLY work on HTTPS**

Netlify provides HTTPS automatically, so your location verification will work perfectly after deployment!

### localStorage
- Data is stored in user's browser
- Separate for each device/browser
- Not shared across devices
- Users should backup important data

### Environment Considerations
- This is a client-side only app
- No backend required
- All data stored in browser localStorage
- Perfect for Netlify's static hosting

---

## 📊 After Deployment

### Test Your Deployment

1. **Admin Login**
   - Visit your Netlify URL
   - Click "Admin Portal"
   - Login with: `aiml2024admin`

2. **Test Location**
   - Allow location permissions
   - Location features should work (HTTPS enabled)

3. **Create Event**
   - Create a test event
   - Verify event code generation

4. **Student Portal**
   - Test student attendance
   - Check location verification

### Monitor Your Site
- **Netlify Dashboard**: View deployments, logs
- **Analytics**: Enable Netlify Analytics (paid)
- **Performance**: Check Lighthouse scores

---

## 🔄 Updating Your Site

### Via Netlify CLI
```bash
# Make your changes
# Build
npm run build

# Deploy
netlify deploy --prod
```

### Via Git (if connected)
```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push

# Netlify auto-deploys!
```

### Via Drag & Drop
```bash
npm run build
# Drag & drop new dist folder to Netlify
```

---

## 🐛 Troubleshooting

### Build Fails
**Problem**: Build command fails

**Solutions**:
```bash
# Locally test build
npm run build

# Check for errors
# Fix any issues
# Try again
```

### 404 Errors on Refresh
**Problem**: Page not found when refreshing

**Solution**: Check `netlify.toml` and `_redirects` exist

### Location Not Working
**Problem**: GPS/location features broken

**Solution**: Ensure using HTTPS (Netlify provides this automatically)

### Environment Variables
If you need environment variables:
1. Netlify Dashboard → Site Settings
2. Build & Deploy → Environment
3. Add variables
4. Redeploy

---

## 💰 Netlify Pricing

### Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ HTTPS (SSL)
- ✅ Continuous deployment
- ✅ 300 build minutes/month
- ✅ Custom domain support

**Perfect for this project!** Free tier is more than enough.

---

## 📱 Sharing Your Site

Once deployed, share:
```
Admin Portal: https://your-site.netlify.app
Student Portal: https://your-site.netlify.app (click Student Portal)

Admin Password: aiml2024admin
(Change this in Settings after first login!)
```

---

## 🎯 Quick Command Reference

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build locally
npm run build

# Deploy to draft
netlify deploy

# Deploy to production
netlify deploy --prod

# Open dashboard
netlify open

# View site
netlify open:site

# Check status
netlify status
```

---

## 🔗 Useful Links

- [Netlify Dashboard](https://app.netlify.com/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify CLI Docs](https://cli.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Change default admin password
- [ ] Test all features locally
- [ ] Run `npm run build` successfully
- [ ] Review .gitignore
- [ ] Check netlify.toml configuration
- [ ] Prepare documentation for users

After deploying:
- [ ] Test admin login on live site
- [ ] Test student portal on live site
- [ ] Verify location permissions work
- [ ] Create test event
- [ ] Mark test attendance
- [ ] Download CSV to verify
- [ ] Change admin password
- [ ] Share URL with authorized users

---

**Need Help?** 
- Check Netlify documentation
- Review build logs in Netlify Dashboard
- Test locally first with `npm run build`

**Ready to Deploy?** Choose a method above and follow the steps! 🚀
