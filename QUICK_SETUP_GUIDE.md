# 🎯 Setup Process Summary for HomePlate

## For Someone Who Wants to Use This Web App from GitHub

### 📋 **Step-by-Step Setup Process:**

## **Phase 1: System Requirements (5 minutes)**
1. **Install Node.js 18+** from [nodejs.org](https://nodejs.org/)
2. **Install Git** from [git-scm.com](https://git-scm.com/)
3. Create accounts:
   - **Supabase account** (free): [supabase.com](https://supabase.com/)
   - **Google account** (for AI features)

## **Phase 2: Get the Code (2 minutes)**
```bash
# Clone and setup
git clone https://github.com/ZaqiYunan/Homeplate1.0-master.git
cd Homeplate1.0-master-2
npm install
```

## **Phase 3: Database Setup (10 minutes)**
1. **Create Supabase Project:**
   - Go to [app.supabase.com](https://app.supabase.com/)
   - Click "New Project"
   - Name it "homeplate" and set password
   - Wait for project creation (2-3 minutes)

2. **Get Database Credentials:**
   - Settings → API
   - Copy Project URL and anon key

3. **Run Database Scripts (CRITICAL - Must be in order):**
   ```sql
   -- 1. Run supabase-schema-core.sql (creates tables)
   -- 2. Run supabase-schema-rls.sql (security policies)  
   -- 3. Run supabase-admin-functions.sql (admin features)
   ```

## **Phase 4: AI Setup (5 minutes)**
1. **Get Google AI Key:**
   - Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Sign in and click "Create API Key"
   - Copy the key

## **Phase 5: Configuration (3 minutes)**
1. **Create Environment File:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in Your Credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GOOGLE_API_KEY=your-google-ai-key
   GEMINI_API_KEY=your-google-ai-key
   ```

## **Phase 6: Launch (1 minute)**
```bash
npm run dev
```
Visit: `http://localhost:3000`

---

## **⚡ Quick Test Checklist:**

After setup, test these features:

✅ **Basic Functionality:**
- [ ] Homepage loads
- [ ] Can register/login
- [ ] Dashboard accessible

✅ **AI Features:**
- [ ] Go to `/ingredients` → "AI Search" tab
- [ ] Try: "Tell me about spinach nutrition"
- [ ] Should return detailed ingredient info

✅ **Recipe Search:**
- [ ] Go to `/recipes`
- [ ] Try "Use My Storage" mode
- [ ] Should generate recipe suggestions

✅ **Admin Features (Optional):**
- [ ] Set user role to 'admin' in Supabase
- [ ] Access `/admin` dashboard

---

## **🚨 Common Setup Issues & Quick Fixes:**

### **Issue 1: "Invalid Supabase URL"**
**Fix:** Double-check `.env.local` has correct Supabase credentials

### **Issue 2: "Google AI API key not configured"**
**Fix:** Ensure `GOOGLE_API_KEY` and `GEMINI_API_KEY` are both set in `.env.local`

### **Issue 3: Database errors (PGRST116)**
**Fix:** Run the SQL files in the correct order (core → rls → admin)

### **Issue 4: "Access denied" on admin page**
**Fix:** In Supabase, change your user's role from 'user' to 'admin' in user_profiles table

### **Issue 5: npm install fails**
**Fix:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## **📱 What You Get After Setup:**

### **🔍 Recipe Discovery**
- Smart AI recipe recommendations
- Search by ingredients you have
- Filter by cuisine type (Western/Asian/Indonesian)

### **🥬 Ingredient Management**
- Digital pantry/storage tracking
- AI predicts expiry dates
- Detailed ingredient database

### **📊 Nutrition Tracking**
- Daily calorie/macro tracking
- AI-personalized nutrition goals
- Visual progress charts

### **🤖 AI Assistant**
- Natural language ingredient search
- "Tell me about tomato nutrition"
- "High protein vegetables"
- "How to store avocados"

### **👨‍💼 Admin Tools** (if admin)
- User management
- System statistics
- Database monitoring

---

## **📈 Total Setup Time: ~25 minutes**
- Prerequisites: 5 min
- Code download: 2 min  
- Database setup: 10 min
- AI setup: 5 min
- Configuration: 3 min

## **💡 Pro Tips:**
1. **Save your credentials** - Keep your API keys and passwords secure
2. **Test incrementally** - Verify each phase works before proceeding
3. **Use test pages** - Visit `/config-test` and `/auth-test` to verify setup
4. **Read the logs** - Check browser console for any error messages

## **🆘 Need Help?**
- 📖 Read `INSTALLATION_GUIDE.md` for detailed instructions
- 🔧 Check `SUPABASE_SETUP.md` for database help
- 🐛 Create an issue on GitHub if stuck

**Happy Cooking! 🍽️**
