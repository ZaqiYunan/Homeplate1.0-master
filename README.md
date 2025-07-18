# 🏠 HomePlate - AI-Powered Recipe Assistant

> *Smart cooking made simple with AI-driven recipe recommendations and ingredient management*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-blue)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

## 🌟 Features

### 🤖 **AI-Powered Recipe Recommendations**
- Smart recipe suggestions based on your available ingredients
- Cuisine filtering (Western, Asian, Indonesian)
- Creative recipe ideas when you're out of inspiration

### 🥬 **Intelligent Ingredient Management** 
- Digital pantry with expiry date tracking
- AI-powered expiry date prediction
- Ingredient availability indicators

### 📊 **Nutrition Tracking**
- Daily calorie and macronutrient monitoring
- Personalized nutrition goals
- Visual progress tracking with charts

### 🔍 **AI Ingredient Explorer**
- Natural language ingredient search
- Comprehensive nutritional information
- Cooking tips and storage advice

### 👨‍💼 **Admin Dashboard**
- User management system
- System analytics and monitoring
- Database administration tools

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/ZaqiYunan/Homeplate1.0-master.git
cd Homeplate1.0-master-2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database setup (see INSTALLATION_GUIDE.md)
# Then start the development server
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 📋 Detailed Setup

For complete setup instructions including database configuration and AI features, see:
**[📖 INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)**

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth)
- **AI:** Google Gemini via Genkit framework
- **Styling:** Tailwind CSS, shadcn/ui components
- **Database:** PostgreSQL with Row Level Security

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (app)/             # Main app pages
│   └── (auth)/            # Authentication pages
├── components/            # UI components
├── lib/                   # Utilities & configurations
├── ai/flows/             # AI functionality
└── contexts/             # React contexts
```

## 🧪 Demo Features

Try these features after setup:

1. **Recipe Search:** Go to `/recipes` and try "Use My Storage" mode
2. **AI Ingredient Search:** Visit `/ingredients` → "AI Search" tab
3. **Nutrition Tracking:** Check `/nutrition` for daily tracking
4. **Admin Panel:** Visit `/admin` (requires admin role)

## 🌐 Live Demo

*[Add your deployed application URL here]*

## 👥 Team

**Team SIXMA - Group 6**
- Muhammad Zaqi Yunan Rachmanda (23523047)
- Andini Putri Ramadhani (23523137) 
- Muhammad Rafi Rizqullah (23523222)
- Rafa Panji Bagaskoro (23523269)

**Course:** Pengembangan Sistem Informasi - E  
**University:** Universitas Islam Indonesia

## 📄 License

This project is developed as part of an academic assignment.

## 🆘 Support

- 📖 [Installation Guide](./INSTALLATION_GUIDE.md)
- 🔧 [Supabase Setup](./SUPABASE_SETUP.md)
- 🐛 [Create an Issue](https://github.com/ZaqiYunan/Homeplate1.0-master/issues)

---

**Made with ❤️ for better cooking experiences**
