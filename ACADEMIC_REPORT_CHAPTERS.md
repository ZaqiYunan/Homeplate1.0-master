










# LAPORAN AKADEMIK HOMEPLATE - BAB VI & VII & VIII

## BAB VI SPESIFIKASI FITUR DAN MAPPING PENGGUNA

### 6.1 Daftar Fitur Sistem

| ID | Nama Fitur | Deskripsi | Kompleksitas |
|----|------------|-----------|--------------|
| F-01 | Manajemen Autentikasi | Sistem login/register dengan Supabase Auth, termasuk OAuth Google dan manajemen sesi pengguna | Medium |
| F-02 | AI Recipe Recommendation | Rekomendasi resep berbasis AI menggunakan Google Gemini berdasarkan bahan yang tersedia | High |
| F-03 | Digital Pantry Management | Manajemen penyimpanan bahan makanan digital dengan tracking tanggal kadaluarsa | Medium |
| F-04 | AI Ingredient Search | Pencarian spesifikasi bahan makanan menggunakan natural language processing | High |
| F-05 | Nutrition Tracking | Pelacakan kalori dan makronutrien harian dengan visualisasi progress | Medium |
| F-06 | Expiry Date Prediction | Prediksi tanggal kadaluarsa otomatis menggunakan AI berdasarkan jenis bahan | High |
| F-07 | Admin Dashboard | Panel administrasi untuk manajemen pengguna dan monitoring sistem | Medium |
| F-08 | Recipe Filtering | Filter resep berdasarkan cuisine (Western, Asian, Indonesian) dan preferensi | Low |
| F-09 | Ingredient Availability Indicator | Indikator visual ketersediaan bahan untuk setiap resep | Low |
| F-10 | Meal Logging | Pencatatan makanan yang dikonsumsi untuk tracking nutrisi | Medium |
| F-11 | User Profile Management | Manajemen profil pengguna dengan data biometrik dan preferensi diet | Low |
| F-12 | Notification System | Notifikasi untuk bahan yang akan kadaluarsa dan reminder nutrisi | Medium |

### 6.2 Mapping Fitur terhadap Pengguna

| Fitur | Regular User | Admin | Guest | Keterangan |
|-------|--------------|--------|-------|-------------|
| F-01 | ✓ | ✓ | ✓ | Semua pengguna dapat menggunakan sistem autentikasi |
| F-02 | ✓ | ✓ | ✗ | Hanya pengguna terdaftar yang dapat menggunakan AI recommendation |
| F-03 | ✓ | ✓ | ✗ | Digital pantry hanya untuk pengguna yang login |
| F-04 | ✓ | ✓ | ✗ | AI ingredient search memerlukan autentikasi |
| F-05 | ✓ | ✓ | ✗ | Nutrition tracking bersifat personal |
| F-06 | ✓ | ✓ | ✗ | Prediksi kadaluarsa terintegrasi dengan digital pantry |
| F-07 | ✗ | ✓ | ✗ | Hanya admin yang dapat mengakses dashboard administrasi |
| F-08 | ✓ | ✓ | ✓ | Filter resep dapat digunakan semua pengguna |
| F-09 | ✓ | ✓ | ✗ | Indicator bahan tersedia hanya untuk yang memiliki pantry |
| F-10 | ✓ | ✓ | ✗ | Meal logging untuk pengguna terdaftar |
| F-11 | ✓ | ✓ | ✗ | Profile management untuk personalisasi |
| F-12 | ✓ | ✓ | ✗ | Notifikasi untuk pengguna dengan data pantry |

### 6.3 Use Case Diagram

```
                     HomePlate System
                           
Guest User ────────┐
                   │
                   ▼
              ┌─────────────┐
              │   Login/    │
              │  Register   │
              │             │
              └─────────────┘
                   │
                   ▼
Regular User ──────┼────────┐
                   │        │
                   ▼        ▼
           ┌─────────────┐ ┌─────────────┐
           │   Manage    │ │  AI Recipe  │
           │   Pantry    │ │ Recommend   │
           │             │ │             │
           └─────────────┘ └─────────────┘
                   │        │
                   ▼        ▼
           ┌─────────────┐ ┌─────────────┐
           │ Ingredient  │ │  Nutrition  │
           │  Search     │ │  Tracking   │
           │             │ │             │
           └─────────────┘ └─────────────┘
                   │
                   ▼
           ┌─────────────┐
           │   Meal      │
           │  Logging    │
           │             │
           └─────────────┘

Admin User ────────┐
                   │
                   ▼
           ┌─────────────┐
           │   Admin     │
           │  Dashboard  │
           │             │
           └─────────────┘
                   │
                   ▼
           ┌─────────────┐
           │    User     │
           │ Management  │
           │             │
           └─────────────┘
```

### 6.4 Skenario Use Case

#### 6.4.1 Use Case: Pencarian Resep dengan AI
- **ID:** UC-01
- **Nama:** AI Recipe Recommendation
- **Aktor:** Regular User
- **Deskripsi:** Pengguna mendapat rekomendasi resep berbasis AI berdasarkan bahan yang tersedia
- **Precondition:** 
  - Pengguna sudah login
  - Pengguna memiliki data pantry atau input query resep
- **Postcondition:** 
  - Sistem menampilkan daftar resep yang relevan
  - Resep menunjukkan ketersediaan bahan
- **Skenario Normal:**
  1. Pengguna masuk ke halaman "Recipes"
  2. Pengguna memilih mode "Use My Storage" atau "Creative Mode"
  3. Jika mode storage: sistem auto-select bahan tersedia
  4. Jika mode creative: pengguna input query pencarian
  5. Pengguna memilih tipe cuisine (Indonesian/Asian/Western)
  6. Sistem memanggil AI flow untuk generate resep
  7. AI mengembalikan list resep dengan detail lengkap
  8. Sistem menampilkan resep dengan indicator ketersediaan bahan
- **Skenario Alternatif:**
  - Jika AI service error: tampilkan sample recipes sebagai fallback
  - Jika tidak ada bahan di pantry: redirect ke mode creative

#### 6.4.2 Use Case: Pencarian Spesifikasi Bahan dengan AI
- **ID:** UC-02
- **Nama:** AI Ingredient Specification Search
- **Aktor:** Regular User
- **Deskripsi:** Pengguna mencari informasi detail tentang bahan makanan menggunakan natural language
- **Precondition:** 
  - Pengguna sudah login
  - Koneksi internet tersedia
- **Postcondition:** 
  - Sistem menampilkan informasi nutrisi, cara penyimpanan, dan tips memasak
- **Skenario Normal:**
  1. Pengguna masuk ke halaman "Ingredients"
  2. Pengguna klik tab "AI Search"
  3. Pengguna input query natural language (contoh: "kandungan gizi bayam")
  4. Sistem memanggil AI flow search-ingredient-specification
  5. AI memproses query dan mengembalikan data terstruktur
  6. Sistem menampilkan informasi lengkap bahan (nutrisi, penyimpanan, manfaat)
- **Skenario Alternatif:**
  - Jika query tidak dipahami: AI memberikan respons fallback dengan saran
  - Jika AI service error: tampilkan pesan error dan saran coba lagi

#### 6.4.3 Use Case: Manajemen Digital Pantry
- **ID:** UC-03
- **Nama:** Digital Pantry Management
- **Aktor:** Regular User
- **Deskripsi:** Pengguna mengelola penyimpanan bahan makanan digital dengan tracking kadaluarsa
- **Precondition:** 
  - Pengguna sudah login
  - Database connectivity tersedia
- **Postcondition:** 
  - Data pantry tersimpan di database
  - Notifikasi kadaluarsa aktif
- **Skenario Normal:**
  1. Pengguna masuk ke halaman "Storage"
  2. Pengguna klik "Add Ingredient"
  3. Pengguna input data bahan (nama, kategori, jumlah, lokasi penyimpanan)
  4. Sistem menggunakan AI untuk prediksi tanggal kadaluarsa
  5. Pengguna konfirmasi atau adjust tanggal kadaluarsa
  6. Sistem menyimpan data ke database Supabase
  7. Sistem menampilkan notifikasi jika berhasil
- **Skenario Alternatif:**
  - Jika prediksi AI gagal: gunakan default berdasarkan kategori bahan
  - Jika database error: tampilkan pesan error dan data tersimpan local temporarily

#### 6.4.4 Use Case: Admin User Management
- **ID:** UC-04
- **Nama:** Admin Dashboard User Management
- **Aktor:** Admin User
- **Deskripsi:** Admin mengelola pengguna sistem dan monitoring aktivitas
- **Precondition:** 
  - Pengguna memiliki role 'admin'
  - Admin function sudah di-setup di database
- **Postcondition:** 
  - Data pengguna diperbarui
  - Role pengguna berubah sesuai keinginan admin
- **Skenario Normal:**
  1. Admin login dengan akun admin
  2. Admin masuk ke halaman "/admin"
  3. Sistem menampilkan dashboard dengan statistik pengguna
  4. Admin melihat daftar semua pengguna terregistrasi
  5. Admin dapat mengubah role pengguna (user ↔ admin)
  6. Sistem update database dan konfirmasi perubahan
- **Skenario Alternatif:**
  - Jika RPC function belum setup: gunakan fallback mode dengan data terbatas
  - Jika user bukan admin: redirect ke halaman dashboard regular

---

## BAB VII DESAIN DATABASE

### 7.1 Pemilihan Jenis Database
- **Tipe Database:** Transactional Database dengan Row-Level Security (RLS)
- **Justifikasi:** 
  - HomePlate memerlukan ACID properties untuk konsistensi data pengguna
  - Real-time collaboration dan sync antar device
  - Keamanan data personal yang tinggi dengan RLS
  - Skalabilitas untuk multi-user application
- **DBMS:** PostgreSQL (via Supabase)
  - Built-in authentication dan authorization
  - Real-time subscriptions
  - Edge functions untuk serverless computing
  - Automatic API generation dari schema

### 7.2 Conceptual Data Model

```
Entity Relationship Diagram (ERD):

[AUTH.USERS] ──────────┐
     │                 │
     │ 1               │ 1
     │                 │
     ▼                 ▼
[USER_PROFILES]   [NUTRITIONAL_GOALS]
     │                 
     │ 1               
     │                 
     ▼                 
[STORED_INGREDIENTS] ──┐
     │                 │
     │ 1               │ M
     │                 │
     ▼                 ▼
[PREFERRED_INGREDIENTS] [MEAL_LOGS]
```

### 7.3 Logical Data Model

#### 7.3.1 Daftar Entitas

| Entitas | Deskripsi | Atribut Utama |
|---------|-----------|---------------|
| auth.users | Tabel autentikasi bawaan Supabase | id, email, created_at, deleted_at |
| user_profiles | Profil pengguna dengan data biometrik | user_id, height, weight, age, gender, role |
| nutritional_goals | Target nutrisi harian pengguna | user_id, calories, protein, carbs, fat |
| stored_ingredients | Bahan makanan dalam pantry digital | id, user_id, name, category, location, quantity, unit, purchase_date, expiry_date |
| preferred_ingredients | Bahan makanan favorit pengguna | id, user_id, ingredient_name |
| meal_logs | Log makanan yang dikonsumsi | id, user_id, recipe_name, ingredients, calories, protein, carbs, fat, logged_at |

#### 7.3.2 Relationship

**Database relasional dengan foreign key constraints:**

1. **auth.users → user_profiles** (1:1)
   - `user_profiles.user_id` REFERENCES `auth.users.id`
   - Cascade DELETE untuk konsistensi data
   - **Penjelasan:** Setiap pengguna memiliki satu profil yang berisi data biometrik dan role

2. **auth.users → nutritional_goals** (1:1)
   - `nutritional_goals.user_id` REFERENCES `auth.users.id`
   - Unique constraint pada user_id
   - **Penjelasan:** Setiap pengguna memiliki satu set target nutrisi personal yang dapat diperbarui

3. **auth.users → stored_ingredients** (1:M)
   - `stored_ingredients.user_id` REFERENCES `auth.users.id`
   - Satu user dapat memiliki banyak bahan di pantry digital
   - **Penjelasan:** Pengguna dapat menyimpan berbagai bahan makanan dengan detail lokasi, quantity, dan expiry date

4. **auth.users → preferred_ingredients** (1:M)
   - `preferred_ingredients.user_id` REFERENCES `auth.users.id`
   - Unique constraint pada (user_id, ingredient_name)
   - **Penjelasan:** Sistem favorit bahan makanan yang memungkinkan pengguna menandai bahan yang sering digunakan
   - **Implementasi:** Menggunakan fungsi `togglePreferredIngredient()` untuk menambah/menghapus favorit
   - **Interface:** Pengguna dapat mengelola preferensi melalui komponen `IngredientChip` dengan variant "preferred"

5. **auth.users → meal_logs** (1:M)
   - `meal_logs.user_id` REFERENCES `auth.users.id`
   - History log makanan per user
   - **Penjelasan:** Pencatatan konsumsi makanan harian dengan detail resep, bahan, dan informasi nutrisi

### 7.4 Physical Data Model

#### 7.4.1 Struktur Tabel

**Enum Types:**
```sql
-- User role enumeration
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Ingredient categories
CREATE TYPE ingredient_category AS ENUM (
  'vegetable', 'fruit', 'grain', 'protein', 
  'dairy', 'spice', 'oil', 'other'
);

-- Storage locations
CREATE TYPE storage_location AS ENUM (
  'refrigerator', 'freezer', 'pantry', 
  'counter', 'cabinet'
);
```

**Main Tables:**

```sql
-- User profiles table
CREATE TABLE public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutritional goals table
CREATE TABLE public.nutritional_goals (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Stored ingredients table
CREATE TABLE public.stored_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category ingredient_category NOT NULL,
  location storage_location NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preferred ingredients table (FITUR FAVORIT BAHAN MAKANAN)
CREATE TABLE public.preferred_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ingredient_name)
);

-- Meal logs table
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_name TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  url TEXT,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7.4.2 Fitur Preferred Ingredients (Bahan Favorit)

**Cara Kerja Sistem Favorit:**

1. **Fungsi Backend (Context API):**
```typescript
const togglePreferredIngredient = useCallback(async (ingredientName: string) => {
  if (!user) {
    toast({ title: "Not Logged In", description: "Please log in to save preferences." });
    return;
  }

  const isCurrentlyPreferred = preferredIngredients.includes(ingredientName);
  
  if (isCurrentlyPreferred) {
    // Remove from preferred
    await supabase.from('preferred_ingredients')
      .delete()
      .eq('user_id', user.id)
      .eq('ingredient_name', ingredientName);
    
    toast({ title: "Preference Updated", description: `${ingredientName} removed from favorites.` });
  } else {
    // Add to preferred
    await supabase.from('preferred_ingredients')
      .insert({ user_id: user.id, ingredient_name: ingredientName });
    
    toast({ title: "Preference Updated", description: `${ingredientName} added to favorites.` });
  }
}, [user, preferredIngredients, toast]);
```

2. **Interface Pengguna:**
- **IngredientChip Component:** Memiliki variant "preferred" dengan styling khusus (warna primary)
- **Visual Feedback:** Badge dengan warna berbeda untuk bahan favorit
- **Toast Notifications:** Konfirmasi saat menambah/menghapus favorit

3. **Lokasi Penggunaan:**
- **Halaman Ingredients:** `/ingredients` - untuk eksplorasi dan marking favorit
- **Recipe Components:** Dalam rekomendasi resep untuk prioritas bahan
- **Storage Management:** Dalam manajemen pantry digital

**Kegunaan Fitur Favorit:**
- **Personalisasi:** Pengguna dapat menandai bahan yang sering digunakan
- **Rekomendasi AI:** Sistem AI memprioritaskan bahan favorit dalam rekomendasi resep
- **User Experience:** Mempercepat pencarian dan seleksi bahan
- **Data Analytics:** Admin dapat melihat trend bahan populer

**Row Level Security (RLS) Policies:**
```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferred_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own ingredients" ON stored_ingredients
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can view all data
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

**Admin Functions:**
```sql
-- Function for admin dashboard
CREATE OR REPLACE FUNCTION get_users_for_admin()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  role user_role,
  height INTEGER,
  weight INTEGER,
  profile_created_at TIMESTAMPTZ,
  has_profile BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check admin privileges
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return user data with email
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email::TEXT as email,
    au.created_at as created_at,
    COALESCE(up.role, 'user'::user_role) as role,
    COALESCE(up.height, 0) as height,
    COALESCE(up.weight, 0) as weight,
    up.created_at as profile_created_at,
    (up.user_id IS NOT NULL) as has_profile
  FROM auth.users au
  LEFT JOIN user_profiles up ON au.id = up.user_id
  WHERE au.deleted_at IS NULL
  ORDER BY au.created_at DESC;
END;
$$;
```

---

## BAB VIII INTEGRASI LARGE LANGUAGE MODEL (LLM)

### 8.1 Justifikasi Integrasi LLM

**Alasan penggunaan:** 
- Meningkatkan user experience dengan natural language interaction
- Automasi prediksi dan rekomendasi yang akurat
- Personalisasi konten berdasarkan preferensi dan data pengguna
- Mengurangi friction dalam pencarian dan discovery makanan

**Value yang ditambahkan:**
- **Smart Recipe Recommendations:** AI dapat memahami konteks bahan yang tersedia dan menghasilkan resep kreatif
- **Natural Language Search:** Pengguna dapat mencari informasi bahan dengan bahasa natural seperti "kandungan protein tinggi sayuran hijau"
- **Intelligent Expiry Prediction:** AI memprediksi tanggal kadaluarsa berdasarkan jenis bahan dan kondisi penyimpanan
- **Personalized Nutrition Goals:** AI memberikan rekomendasi target nutrisi berdasarkan profil pengguna

**Inovasi yang dihasilkan:**
- **Context-Aware Recipe Generation:** AI mempertimbangkan bahan tersedia, preferensi cuisine, dan dietary restrictions
- **Multi-Modal Ingredient Analysis:** Kombinasi text dan structured data untuk informasi bahan yang komprehensif
- **Adaptive Learning:** Sistem belajar dari preferensi dan riwayat pengguna untuk rekomendasi yang lebih baik

### 8.2 Pemilihan LLM

**Model yang digunakan:** Google Gemini 1.5 Flash
**Justifikasi pemilihan:**
- **Performance:** Response time cepat untuk real-time interaction
- **Cost-effective:** Lebih ekonomis dibanding GPT-4 untuk aplikasi mahasiswa
- **Multilingual Support:** Mendukung Bahasa Indonesia untuk user lokal
- **Structured Output:** Excellent capability untuk generate JSON dengan schema validation
- **Context Window:** Large context untuk detailed recipe dan ingredient information

**API/Service:** Google AI Generative API via Firebase Genkit Framework
- **Integration Benefits:** Seamless integration dengan Next.js dan TypeScript
- **Type Safety:** Built-in Zod schema validation
- **Error Handling:** Robust error handling dan fallback mechanisms
- **Caching:** Built-in response caching untuk performance optimization

### 8.3 Fitur yang Menggunakan LLM

| Fitur | Fungsi LLM | Input | Output | Benefit |
|-------|------------|--------|--------|---------|
| AI Recipe Recommendation | Generate resep berdasarkan bahan tersedia dan preferensi | Array bahan, cuisine type, search mode, query | List resep dengan detail lengkap (ingredients, instructions, nutrition, difficulty) | User mendapat resep kreatif dan relevan tanpa perlu manual search |
| AI Ingredient Search | Memberikan informasi detail tentang bahan makanan | Natural language query tentang bahan | Structured data: nutrisi, cara penyimpanan, manfaat kesehatan, tips memasak | User dapat belajar tentang bahan makanan dengan mudah |
| Expiry Date Prediction | Prediksi tanggal kadaluarsa bahan makanan | Nama bahan, kategori, kondisi penyimpanan | Estimated expiry date dan confidence level | Mengurangi food waste dan membantu meal planning |
| Nutrition Goal Setting | Rekomendasi target nutrisi personal | User profile (height, weight, age, gender, activity level) | Personalized nutrition targets (calories, protein, carbs, fat) | Target nutrisi yang sesuai dengan kebutuhan individual |

### 8.4 Implementasi LLM

#### 8.4.1 Arsitektur Integrasi

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Genkit Flows   │    │  Google Gemini  │
│                 │    │                 │    │   1.5 Flash     │
│  - Recipe Page  │───▶│ recommend-      │───▶│                 │
│  - Ingredients  │    │ recipes.ts      │    │  - Natural      │
│  - Storage      │    │                 │    │    Language     │
│  - Nutrition    │    │ search-         │    │  - JSON         │
│                 │    │ ingredient-     │    │    Generation   │
│                 │    │ specification   │    │  - Context      │
│                 │    │                 │    │    Understanding│
│                 │    │ predict-expiry  │    │                 │
│                 │    │                 │    │                 │
│                 │    │ get-nutrition   │    │                 │
│                 │◀───│ goals.ts        │◀───│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Supabase DB    │    │   Zod Schema    │    │   Error         │
│                 │    │   Validation    │    │   Handling      │
│ - User Data     │    │                 │    │                 │
│ - Ingredients   │    │ - Type Safety   │    │ - Fallback      │
│ - Recipes       │    │ - Input/Output  │    │ - Retry Logic   │
│ - Preferences   │    │   Validation    │    │ - User Messages │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 8.4.2 Prompt Engineering

**Contoh prompt untuk Recipe Recommendation:**

```typescript
const prompt = ai.definePrompt({
  name: 'recommendRecipesPrompt',
  input: { schema: RecommendRecipesInputSchema },
  output: { schema: RecommendRecipesOutputSchema },
  prompt: `
Role: You are an expert chef and culinary advisor who specializes in creating delicious recipes from available ingredients.

Context: The user is using HomePlate, a smart kitchen assistant app. They want recipe recommendations based on their current ingredients and preferences.

{{#if strictMode}}
Task: Generate {{numRecipes}} recipes using ONLY the available ingredients. You are in "Use My Storage" mode where the user wants to cook with what they have.

Available ingredients:
{{#each ingredients}}
- {{this}}
{{/each}}

Cuisine preference: {{cuisine}}
{{else}}
Task: Generate {{numRecipes}} creative recipes for "{{query}}" {{#if cuisine}}in {{cuisine}} style{{/if}}.

{{#if ingredients}}
User has these ingredients available (incorporate when possible):
{{#each ingredients}}
- {{this}}
{{/each}}
{{/if}}
{{/if}}

Format: Return a JSON array of recipe objects with the following structure:
- name: String (recipe name)
- description: String (brief description)
- ingredients: Array<String> (all required ingredients)
- instructions: Array<String> (step-by-step cooking instructions)
- cuisine: String (cuisine type)
- cookingTime: String (estimated time)
- difficulty: String (Easy/Medium/Hard)
- missingIngredients: Array<String> (ingredients user doesn't have)

Requirements:
1. All recipes must be authentic to the specified cuisine
2. Include complete ingredient lists and detailed instructions
3. Mark any missing ingredients the user doesn't have
4. Ensure recipes are practical and achievable
5. Provide accurate cooking times and difficulty levels
  `
});
```

**Contoh prompt untuk Ingredient Search:**

```typescript
const prompt = ai.definePrompt({
  name: 'searchIngredientPrompt',
  input: { schema: IngredientSearchInputSchema },
  output: { schema: IngredientSpecificationSchema },
  prompt: `
Role: You are a nutrition expert and culinary specialist with comprehensive knowledge about food ingredients.

Context: The user is asking about ingredient specifications through natural language. Provide accurate, detailed information.

Query: "{{query}}"
{{#if ingredient}}Specific ingredient: {{ingredient}}{{/if}}
{{#if searchType}}Search focus: {{searchType}}{{/if}}

Task: Analyze the query and provide comprehensive ingredient information including nutritional data, cooking properties, storage guidelines, and health benefits.

Format: Return structured JSON with complete ingredient specifications including:
- Basic information (name, category, description)
- Detailed nutritional breakdown per 100g
- Cooking properties and methods
- Storage and freshness information
- Health benefits and varieties
- Practical cooking tips

Requirements:
1. Provide accurate nutritional values
2. Include practical cooking and storage advice
3. Mention health benefits and potential concerns
4. Suggest complementary ingredients and pairings
5. If query is unclear, interpret intent and provide relevant information
  `
});
```

**Contoh prompt untuk Expiry Prediction:**

```typescript
const prompt = ai.definePrompt({
  name: 'predictExpiryPrompt',
  input: { schema: PredictExpiryInputSchema },
  output: { schema: PredictExpiryOutputSchema },
  prompt: `
Role: You are a food safety expert specializing in ingredient freshness and storage optimization.

Context: Predict when this ingredient will expire based on its type, storage conditions, and purchase date.

Ingredient: {{ingredientName}}
Category: {{category}}
Storage location: {{storageLocation}}
Purchase date: {{purchaseDate}}
{{#if condition}}Current condition: {{condition}}{{/if}}

Task: Calculate the most likely expiry date and provide confidence level and storage recommendations.

Format: Return JSON with:
- predictedExpiryDate: ISO date string
- confidenceLevel: number (0-1)
- daysUntilExpiry: number
- storageRecommendations: array of strings
- freshnessIndicators: array of signs to watch for

Requirements:
1. Consider ingredient type and typical shelf life
2. Factor in storage conditions (refrigerator vs pantry vs freezer)
3. Account for seasonal variations and quality factors
4. Provide actionable storage advice
5. Include early warning signs of spoilage
  `
});
```

**Benefits of this LLM Integration:**

1. **User Experience:** Natural language interaction menurunkan learning curve
2. **Accuracy:** Structured output dengan schema validation memastikan data consistency
3. **Scalability:** Genkit framework memungkinkan easy deployment dan monitoring
4. **Maintainability:** Type-safe flows dengan error handling yang robust
5. **Performance:** Caching dan optimization untuk response time yang optimal

---

**Kesimpulan:**

HomePlate mengintegrasikan Google Gemini LLM melalui Firebase Genkit untuk memberikan pengalaman yang intelligent dan personal. Implementasi LLM mencakup recipe recommendation, ingredient search, expiry prediction, dan nutrition planning dengan prompt engineering yang terstruktur dan type-safe validation menggunakan Zod schemas.

---

## BAB IX DESAIN SISTEM DAN PROTOTIPE

### 9.1 Arsitektur Sistem

#### 9.1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HOMEPLATE SYSTEM ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   FRONTEND      │    │    BACKEND      │    │   AI SERVICES   │         │
│  │                 │    │                 │    │                 │         │
│  │  Next.js 15.2.3 │◄──►│ Supabase Edge   │◄──►│ Google Gemini   │         │
│  │  - React 18     │    │ Functions       │    │ 1.5 Flash       │         │
│  │  - TypeScript   │    │ - Deno Runtime  │    │ - Firebase      │         │
│  │  - Tailwind CSS │    │ - Serverless    │    │   Genkit        │         │
│  │  - Shadcn/ui    │    │ - CORS Enabled  │    │ - Zod Schema    │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           ▼                       ▼                       ▼                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   UI COMPONENTS │    │   API ROUTES    │    │  LLM FLOWS      │         │
│  │                 │    │                 │    │                 │         │
│  │ - Auth Pages    │    │ /api/test-db    │    │ - recommend-    │         │
│  │ - Dashboard     │    │ /api/nutrition  │    │   recipes       │         │
│  │ - Ingredients   │    │ /api/admin      │    │ - search-       │         │
│  │ - Recipes       │    │ - RLS Security  │    │   ingredient    │         │
│  │ - Storage       │    │ - Row Level     │    │ - predict-      │         │
│  │ - Admin Panel   │    │   Security      │    │   expiry        │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           ▼                       ▼                       ▼                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   STATE MGMT    │    │    DATABASE     │    │   EXTERNAL      │         │
│  │                 │    │                 │    │   INTEGRATIONS  │         │
│  │ - React Context │    │ PostgreSQL      │    │                 │         │
│  │ - Supabase Auth │    │ (Supabase)      │    │ - Resend API    │         │
│  │ - Local Storage │    │ - Auth Tables   │    │ - Google OAuth  │         │
│  │ - Toast System  │    │ - User Profiles │    │ - Environment   │         │
│  │                 │    │ - Ingredients   │    │   Variables     │         │
│  └─────────────────┘    │ - RLS Policies  │    │                 │         │
│                         │ - Admin Funcs   │    └─────────────────┘         │
│                         └─────────────────┘                                │
│                                  │                                         │
│                                  ▼                                         │
│                         ┌─────────────────┐                                │
│                         │   DEPLOYMENT    │                                │
│                         │                 │                                │
│                         │ - Vercel Edge   │                                │
│                         │ - Global CDN    │                                │
│                         │ - Auto HTTPS    │                                │
│                         │ - Serverless    │                                │
│                         │ - Git Deploy    │                                │
│                         └─────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 9.1.2 Technology Stack

**Frontend Stack:**
- **Framework:** Next.js 15.2.3 (React 18)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.4.1 + Tailwind Animate
- **UI Components:** Radix UI + Shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Context API + Supabase Auth
- **Form Handling:** React Hook Form + Zod Validation
- **Date Handling:** date-fns

**Backend Stack:**
- **Platform:** Supabase (Backend-as-a-Service)
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (JWT + OAuth)
- **API:** Auto-generated REST API +  RPC Functions
- **Real-time:** Supabase Realtime Subscriptions
- **Edge Functions:** Deno Runtime (Serverless)
- **File Storage:** Supabase Storage (untuk future image uploads)

**AI/LLM Integration:**
- **LLM Model:** Google Gemini 1.5 Flash
- **Framework:** Firebase Genkit 1.8.0
- **Schema Validation:** Zod TypeScript-first validation
- **Prompt Engineering:** Structured prompts dengan context awareness
- **Error Handling:** Fallback mechanisms + retry logic

**Database Design:**
- **Type:** Relational (PostgreSQL)
- **ORM:** Supabase Auto-generated SDK
- **Security:** Row Level Security (RLS) Policies
- **Admin Functions:** PostgreSQL Functions with SECURITY DEFINER
- **Migrations:** Supabase Migration System

**DevOps & Deployment:**
- **Hosting:** Vercel (Frontend + API Routes)
- **Database Hosting:** Supabase Cloud
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel Auto-deployment dari Git
- **Environment Management:** Vercel Environment Variables
- **Domain:** Custom domain support via Vercel
- **Monitoring:** Vercel Analytics + Supabase Monitoring

**Development Tools:**
- **IDE:** Visual Studio Code
- **Package Manager:** npm
- **Linting:** ESLint (Next.js Config)
- **Type Checking:** TypeScript strict mode
- **Code Formatting:** Prettier (implicit via Tailwind)
- **Error Tracking:** Built-in error boundaries + console logging

**Third-party Integrations:**
- **Email Service:** Resend (untuk email notifications)
- **OAuth Provider:** Google OAuth 2.0
- **AI API:** Google AI Generative API
- **Image Placeholders:** Picsum Photos + Placehold.co

### 9.2 Desain Interface

#### 9.2.1 Wireframe

**Main Dashboard Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Navigation | User Menu                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│ │   RECIPES   │  │ INGREDIENTS │  │   STORAGE   │  │ PROFILE │ │
│ │             │  │             │  │             │  │         │ │
│ │ • AI Recs   │  │ • AI Search │  │ • Digital   │  │ • Goals │ │
│ │ • Filters   │  │ • Categories│  │   Pantry    │  │ • Stats │ │
│ │ • Cuisine   │  │ • Favorites │  │ • Expiry    │  │ • Prefs │ │
│ └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                   MAIN CONTENT AREA                         │ │
│ │                                                             │ │
│ │  Recipe Cards / Ingredient List / Storage Items / Forms     │ │
│ │                                                             │ │
│ │  [Dynamic content based on selected navigation]             │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SIDEBAR: Quick Actions | Notifications | Recent Activity    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER: Links | Version | Support                              │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile-First Responsive Design:**
```
Mobile (< 768px)     Tablet (768-1024px)    Desktop (> 1024px)
┌─────────────┐      ┌─────────────────┐      ┌─────────────────────┐
│ Header      │      │ Header          │      │ Header              │
│ ───────────  │      │ ─────────────── │      │ ─────────────────── │
│ Bottom Nav  │      │ Side Nav + Main │      │ Full Layout         │
│ Main Content│      │                 │      │ (as shown above)    │
│ (Full Width)│      │                 │      │                     │
└─────────────┘      └─────────────────┘      └─────────────────────┘
```

#### 9.2.2 User Interface Design

**Design System:**
- **Color Palette:** 
  - Primary: Blue (#3B82F6) untuk CTAs dan active states
  - Secondary: Green (#10B981) untuk success dan positive actions
  - Warning: Amber (#F59E0B) untuk expiry alerts
  - Danger: Red (#EF4444) untuk urgent notifications
  - Neutral: Gray scale untuk backgrounds dan text

- **Typography:**
  - Font Family: Geist (Modern, clean, dan readable)
  - Heading: Font weights 600-700
  - Body: Font weight 400-500
  - Code: Monospace untuk technical content

- **Spacing System:**
  - Base unit: 4px (Tailwind's spacing scale)
  - Components: 8px, 12px, 16px, 24px, 32px
  - Layout: 48px, 64px, 96px

- **Component Library:**
  - **Cards:** Rounded corners, subtle shadows, hover effects
  - **Buttons:** Multiple variants (primary, secondary, outline, ghost)
  - **Forms:** Clean inputs dengan proper validation states
  - **Navigation:** Consistent active states dan hover feedback
  - **Modals:** Backdrop blur dengan smooth animations

**Key UI Mockups:**

**Recipe Recommendation Page:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 🍳 Recipe Recommendations                    [🔄 Generate New]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Mode: ● Use My Storage  ○ Creative Mode                        │
│ Cuisine: [Indonesian ▼]  Recipes: [4 ▼]                       │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │ 🍜 Nasi     │ │ 🥗 Gado-    │ │ 🍛 Rendang  │ │ 🍲 Soto     ││
│ │ Goreng      │ │ Gado        │ │ Daging      │ │ Ayam        ││
│ │             │ │             │ │             │ │             ││
│ │ ✅ 8/8      │ │ ⚠️  6/8     │ │ ❌ 4/8      │ │ ✅ 7/7      ││
│ │ Available   │ │ Available   │ │ Available   │ │ Available   ││
│ │             │ │             │ │             │ │             ││
│ │ [View] [➕]  │ │ [View] [➕]  │ │ [View] [➕]  │ │ [View] [➕]  ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Digital Pantry Management:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 📦 My Digital Pantry                       [+ Add Ingredient]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Filter: [All ▼] [Refrigerator ▼] [🔍 Search...]                │
│                                                                 │
│ ⚠️  Expiring Soon (3)                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🥛 Milk         │ 2 Liters    │ 📅 Tomorrow  │ [Edit] [🗑] │ │
│ │ 🥬 Lettuce      │ 1 Head      │ 📅 2 days    │ [Edit] [🗑] │ │
│ │ 🧀 Cheese       │ 200g        │ 📅 3 days    │ [Edit] [🗑] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ✅ Fresh Items (12)                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🍎 Apples       │ 6 pieces    │ 📅 1 week    │ [Edit] [🗑] │ │
│ │ 🥕 Carrots      │ 1 kg        │ 📅 2 weeks   │ [Edit] [🗑] │ │
│ │ 🍚 Rice         │ 5 kg        │ 📅 6 months  │ [Edit] [🗑] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 API Design

#### 9.3.1 API Endpoints

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/api/test-database` | Test database connectivity dan table structure | - | `{ success: boolean, tables: object }` |
| GET | `/api/nutrition/goals` | Get user's nutritional goals | - | `{ calories: number, protein: number, carbs: number, fat: number }` |
| PUT | `/api/nutrition/goals` | Update user's nutritional goals | `{ calories, protein, carbs, fat }` | `{ success: boolean, message: string }` |
| GET | `/api/admin/users` | Get all users (admin only) | - | `{ users: User[], stats: object }` |
| PUT | `/api/admin/users/:id/role` | Update user role (admin only) | `{ role: 'user' \| 'admin' }` | `{ success: boolean, message: string }` |
| POST | `/api/genkit/recommend-recipes` | AI recipe recommendations | `{ ingredients, cuisine, mode, query }` | `{ recipes: Recipe[] }` |
| POST | `/api/genkit/search-ingredient` | AI ingredient specifications | `{ query: string }` | `{ specification: IngredientSpec }` |
| POST | `/api/genkit/predict-expiry` | AI expiry date prediction | `{ name, category, storage }` | `{ predictedDate: string, confidence: number }` |

**TABEL 10 API Endpoints**

#### 9.3.2 API Documentation

**Supabase Auto-Generated API:**
- **Base URL:** `https://fxeogbzwstepyyjgvkrq.supabase.co`
- **API Documentation:** Auto-generated di Supabase Dashboard
- **OpenAPI Spec:** Available di `/rest/v1/`
- **PostgREST Documentation:** https://postgrest.org/en/v10/

**Authentication:**
```typescript
// Headers untuk semua API calls
{
  'apikey': 'your-supabase-anon-key',
  'Authorization': 'Bearer user-jwt-token',
  'Content-Type': 'application/json'
}
```

**Error Handling:**
```typescript
// Standard error response format
{
  error: {
    message: string,
    details: string,
    hint: string,
    code: string
  }
}
```

---

## BAB X IMPLEMENTASI DAN TESTING

### 10.1 Implementasi

#### 10.1.1 Development Environment

**Operating System:** Windows 11 Pro
**IDE:** Visual Studio Code 1.85+
- Extensions: 
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier Code Formatter
  - GitLens

**Version Control:** Git + GitHub
- **Repository:** https://github.com/username/homeplate-app
- **Branching Strategy:** Git Flow (main, develop, feature branches)
- **Commit Convention:** Conventional Commits

**Package Manager:** npm 10.2.4
**Node.js Version:** 20.10.0 LTS

**Development Scripts:**
```json
{
  "dev": "next dev",
  "build": "next build", 
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

#### 10.1.2 Coding Standards

**Naming Convention:**
- **Components:** PascalCase (`IngredientCard.tsx`)
- **Files:** kebab-case (`ingredient-search.ts`)
- **Variables/Functions:** camelCase (`getUserProfile`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces:** PascalCase dengan prefix (`IUser`, `TRecipe`)

**Code Structure:**
```
src/
├── app/                  # Next.js App Router
│   ├── (app)/           # Protected app routes
│   ├── (auth)/          # Authentication routes
│   └── api/             # API route handlers
├── components/          # React components
│   ├── ui/              # Reusable UI components
│   └── icons/           # Icon components
├── contexts/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── _deprecated/        # Legacy code (untuk migration)
```

**Documentation Standards:**
- **JSDoc Comments:** Untuk semua exported functions
- **README.md:** Setup instructions dan feature overview
- **API Documentation:** Inline comments + external docs
- **Type Definitions:** Comprehensive TypeScript interfaces

### 10.2 Testing

**Populasi Pengguna:**
Sistem HomePlate ditargetkan untuk populasi pengguna domestik Indonesia yang memiliki akses internet dan smartphone/komputer. Berdasarkan data Badan Pusat Statistik (BPS) 2023, terdapat sekitar 270 juta penduduk Indonesia dengan tingkat penetrasi internet mencapai 77.02% atau sekitar 208 juta pengguna internet. Target spesifik HomePlate adalah segmen urban middle-class yang peduli dengan pengelolaan makanan dan nutrisi, diperkirakan sekitar 15-20% dari pengguna internet aktif atau sekitar 30-40 juta potential users. Dalam tahap MVP (Minimum Viable Product), sistem dirancang untuk menangani 1,000-10,000 concurrent users dengan arsitektur yang dapat di-scale sesuai kebutuhan. Populasi testing awal difokuskan pada 50-100 beta users untuk validasi fitur utama, kemudian expanded ke 1,000 users untuk load testing dan performance optimization.

#### 10.2.1 Unit Testing

**Testing Framework:** Jest + React Testing Library (untuk future implementation)

**Components yang akan di-test:**
- **IngredientCard Component:**
  ```typescript
  // Test cases:
  // 1. Renders ingredient data correctly
  // 2. Handles favorite toggle functionality
  // 3. Shows appropriate expiry warnings
  // 4. Responds to user interactions
  ```

- **AI Integration Functions:**
  ```typescript
  // Test cases:
  // 1. Recipe recommendation flow
  // 2. Ingredient search parsing
  // 3. Error handling untuk API failures
  // 4. Fallback mechanisms
  ```

- **Database Operations:**
  ```typescript
  // Test cases:
  // 1. CRUD operations untuk ingredients
  // 2. User profile management
  // 3. RLS policy enforcement
  // 4. Data validation
  ```

**Testing Coverage Target:** 80%+ untuk critical business logic

#### 10.2.2 User Acceptance Testing

**Testing Groups:**
1. **Primary Users (n=25):** Home cooks, meal planners, health-conscious individuals
2. **Secondary Users (n=15):** Food bloggers, nutrition enthusiasts, busy professionals  
3. **Admin Users (n=5):** System administrators, content moderators

**UAT Scenarios:**
- **Scenario 1:** New user onboarding dan profile setup
- **Scenario 2:** Adding ingredients ke digital pantry
- **Scenario 3:** Getting AI recipe recommendations
- **Scenario 4:** Nutrition tracking dan goal setting
- **Scenario 5:** Admin dashboard functionality

**Success Criteria:**
- 90%+ task completion rate
- <5 seconds average task completion time
- 4.0+ user satisfaction score (1-5 scale)
- <10% error rate in critical workflows

#### 10.2.3 Pengujian Fungsional

**Test Categories:**

**Authentication Testing:**
- ✅ User registration dengan email/password
- ✅ Google OAuth integration
- ✅ Session management dan token refresh
- ✅ Password reset functionality
- ✅ Role-based access control

**Core Feature Testing:**
- ✅ Digital pantry CRUD operations
- ✅ AI recipe recommendation accuracy
- ✅ Ingredient search functionality
- ✅ Nutrition tracking calculations
- ✅ Expiry date predictions
- ✅ Notification system

**Integration Testing:**
- ✅ Supabase database connectivity
- ✅ Google Gemini AI responses
- ✅ Real-time data synchronization
- ✅ Email notification delivery
- ✅ Admin dashboard functions

**Performance Testing:**
- ✅ Page load times (<3 seconds)
- ✅ API response times (<500ms)
- ✅ Database query optimization
- ✅ AI model response times (<2 seconds)
- ✅ Mobile responsiveness

#### 10.2.4 A/B Testing

**Test 1: Recipe Recommendation Interface**
- **Variant A:** Grid layout dengan card-based design
- **Variant B:** List layout dengan detailed preview
- **Metric:** Click-through rate dan recipe saves
- **Expected Result:** Card design shows 15%+ higher engagement

**Test 2: AI Search Query Interface**
- **Variant A:** Simple text input dengan placeholder
- **Variant B:** Guided input dengan example queries
- **Metric:** Search completion rate dan result satisfaction
- **Expected Result:** Guided input reduces query errors by 25%

**Test 3: Nutrition Goal Setting Flow**
- **Variant A:** Manual input semua values
- **Variant B:** AI-suggested values berdasarkan profile
- **Metric:** Goal completion rate dan accuracy
- **Expected Result:** AI suggestions increase completion by 40%

**Test 4: Ingredient Expiry Notifications**
- **Variant A:** Daily email notifications
- **Variant B:** Smart notifications (3 days, 1 day, today)
- **Metric:** Email open rates dan user engagement
- **Expected Result:** Smart notifications show 20%+ better engagement

---

## BAB XI DOKUMENTASI FITUR DAN AKSES SISTEM

### 11.1 Daftar Fitur yang Dikembangkan

#### 11.1.1 AI Recipe Recommendation System

**Deskripsi:** Sistem rekomendasi resep cerdas yang menggunakan Google Gemini AI untuk memberikan saran resep berdasarkan bahan yang tersedia di pantry digital pengguna atau berdasarkan query kreatif pengguna.

**Fungsionalitas:**
- Generate 4-8 resep sekaligus dengan detail lengkap
- Mode "Use My Storage" untuk resep berdasarkan bahan tersedia
- Mode "Creative Mode" untuk eksperasi resep berdasarkan query
- Filter berdasarkan cuisine (Indonesian, Asian, Western)
- Indikator ketersediaan bahan untuk setiap resep
- Detail resep lengkap dengan ingredients, instructions, nutrition info

**Pengguna:** Regular users dan Admin users (authenticated users only)

**Cara Penggunaan:**
1. Login ke sistem dan navigate ke halaman "Recipes"
2. Pilih mode rekomendasi:
   - **Use My Storage:** Automatically menggunakan bahan di pantry
   - **Creative Mode:** Input query manual (contoh: "spicy chicken curry")
3. Pilih tipe cuisine yang diinginkan
4. Klik "Generate Recipes" untuk mendapat rekomendasi AI
5. Browse hasil rekomendasi dengan indikator ketersediaan bahan
6. Klik "View Recipe" untuk detail lengkap dan "Add to Meal Log" untuk tracking

**Screenshot:** [Recipe recommendation interface dengan AI-generated cards showing Indonesian cuisine recommendations]

#### 11.1.2 Digital Pantry Management

**Deskripsi:** Sistem manajemen penyimpanan bahan makanan digital yang memungkinkan pengguna melacak inventori, tanggal kadaluarsa, dan lokasi penyimpanan dengan prediksi AI untuk optimasi penggunaan bahan.

**Fungsionalitas:**
- Add/Edit/Delete ingredients dengan detail lengkap
- Kategori otomatis (vegetable, fruit, protein, dairy, grain, spice, oil, other)
- Lokasi penyimpanan (refrigerator, freezer, pantry, counter, cabinet)
- AI-powered expiry date prediction
- Visual indicators untuk bahan yang akan kadaluarsa
- Search dan filter functionality
- Integration dengan recipe recommendations

**Pengguna:** Regular users dan Admin users (authenticated users only)

**Cara Penggunaan:**
1. Navigate ke halaman "Storage" dari dashboard
2. Klik "+ Add Ingredient" untuk menambah bahan baru
3. Input detail bahan:
   - Nama bahan (akan di-suggest AI untuk kategori)
   - Quantity dan unit measurement
   - Lokasi penyimpanan
   - Purchase date
   - Expiry date (AI prediction atau manual override)
4. Save ingredient ke digital pantry
5. Manage existing ingredients dengan edit/delete actions
6. Monitor expiry warnings di dashboard

**Screenshot:** [Digital pantry interface showing ingredient list with expiry warnings and add ingredient modal]

#### 11.1.3 AI Ingredient Specification Search

**Deskripsi:** Pencarian spesifikasi bahan makanan menggunakan natural language processing yang memberikan informasi komprehensif tentang nutrisi, cara penyimpanan, manfaat kesehatan, dan tips memasak.

**Fungsionalitas:**
- Natural language query processing
- Comprehensive ingredient information (nutrition, storage, benefits)
- Cooking tips dan preparation methods
- Storage recommendations untuk freshness optimization
- Health benefits dan dietary considerations
- Ingredient pairing suggestions

**Pengguna:** Regular users dan Admin users (authenticated users only)

**Cara Penggunaan:**
1. Navigate ke halaman "Ingredients" 
2. Klik tab "AI Search"
3. Input natural language query, contoh:
   - "kandungan protein tinggi dalam bayam"
   - "cara menyimpan daging sapi agar tahan lama"
   - "manfaat kesehatan dari kunyit"
4. AI akan memproses query dan memberikan informasi terstruktur
5. Browse hasil dengan sections: nutrition, storage, benefits, cooking tips

**Screenshot:** [AI ingredient search interface showing natural language query and comprehensive ingredient information results]

#### 11.1.4 Admin Dashboard & User Management

**Deskripsi:** Panel administrasi komprehensif untuk monitoring sistem, manajemen pengguna, dan akses ke debugging tools dengan real-time analytics dan user role management.

**Fungsionalitas:**
- Real-time user statistics dan system health monitoring
- User role management (user ↔ admin) dengan bulk operations
- Database status checker untuk table verification
- Manual notification trigger untuk testing email system
- User activity logs dan system diagnostics
- Admin-only RPC function access

**Pengguna:** Admin users only (role-based access control)

**Cara Penggunaan:**
1. Login dengan account yang memiliki admin role
2. Navigate ke "/admin" (akan redirect jika bukan admin)
3. Dashboard overview menampilkan:
   - Total users dan breakdown by role
   - Recent user registrations
   - System health indicators
4. User management section:
   - View all registered users dengan profile data
   - Toggle user roles dengan confirmation dialog
   - Bulk actions untuk multiple users
5. System tools:
   - Database checker untuk verify table setup
   - Manual notification trigger untuk testing
   - System logs dan error monitoring

**Screenshot:** [Admin dashboard showing user statistics, role management interface, and system monitoring tools]

#### 11.1.5 Email Notification System

**Deskripsi:** Sistem notifikasi email otomatis untuk expiry alerts dengan smart categorization, scheduling, dan personalization berdasarkan user preferences.

**Fungsionalitas:**
- Automated expiry date notifications (configurable 1-30 days ahead)
- Smart email categorization (urgent, soon, later, meal planning)
- Personalized notification preferences dan scheduling
- Manual trigger capability untuk testing
- Email template dengan HTML formatting dan mobile optimization
- Integration dengan Resend API untuk reliable delivery

**Pengguna:** All authenticated users dengan opt-in preferences

**Cara Penggunaan:**
1. Navigate ke "Profile" → "Notification Settings"
2. Configure notification preferences:
   - Enable/disable email notifications
   - Set days ahead untuk expiry alerts (1-30 days)
   - Choose notification time (default 9:00 AM)
3. System akan automatically send emails berdasarkan schedule
4. Admin dapat manually trigger notifications untuk testing
5. Users receive categorized emails dengan priority levels

**Screenshot:** [Notification settings interface dan sample email template with categorized ingredient expiry alerts]

### 11.2 Fitur LLM yang Diimplementasikan

#### 11.2.1 AI Recipe Recommendation Engine

**Deskripsi:** Advanced recipe generation system menggunakan Google Gemini 1.5 Flash dengan context-aware prompting dan structured output untuk personalized recipe recommendations.

**Input:**
- Array of available ingredients dari digital pantry
- Cuisine preference (Indonesian, Asian, Western, atau all)
- Search mode (storage-based atau creative query)
- Optional: dietary restrictions, cooking time preferences

**Processing:**
- **Prompt Engineering:** Structured prompts dengan role definition dan context awareness
- **Context Analysis:** AI memahami ingredient availability dan user preferences
- **Recipe Generation:** Generate multiple recipes dengan complete details
- **Validation:** Zod schema validation untuk output consistency
- **Fallback:** Sample recipes jika AI service unavailable

**Output:**
- Array of 4-8 complete recipes dengan structure:
  - Recipe name dan description
  - Complete ingredient list dengan quantities
  - Step-by-step cooking instructions
  - Estimated cooking time dan difficulty level
  - Nutrition information (calories, protein, carbs, fat)
  - Missing ingredients indicator

**Demo:** [Video/screenshot showing AI generating Indonesian recipes based on available ingredients with real-time processing]

#### 11.2.2 Natural Language Ingredient Search

**Deskripsi:** Intelligent ingredient information system yang memproses natural language queries dan memberikan comprehensive nutritional dan culinary information.

**Input:**
- Natural language queries dalam Bahasa Indonesia atau English
- Examples: "kandungan vitamin C jeruk", "cara menyimpan daging", "manfaat kunyit untuk kesehatan"
- Context-aware search dengan ingredient name extraction

**Processing:**
- **Query Understanding:** AI parses intent dan extracts key information
- **Knowledge Retrieval:** Access comprehensive nutritional database
- **Information Synthesis:** Combine multiple data sources untuk complete picture
- **Structured Response:** Format output untuk user-friendly presentation

**Output:**
- Structured ingredient specification meliputi:
  - Nutritional breakdown (per 100g): calories, protein, carbs, fat, vitamins, minerals
  - Storage recommendations dengan optimal conditions
  - Health benefits dan dietary considerations
  - Cooking methods dan preparation tips
  - Ingredient pairing suggestions
  - Freshness indicators dan selection tips

**Demo:** [Screenshot showing natural language query "protein tinggi sayuran hijau" returning comprehensive information about high-protein vegetables]

### 11.3 Akses Sistem

#### 11.3.1 Link Akses

**URL Aplikasi:** https://homeplate-app.vercel.app (akan di-update setelah deployment)
**Repository Code:** https://github.com/yourusername/homeplate-app
**API Documentation:** https://fxeogbzwstepyyjgvkrq.supabase.co/rest/v1/ (Supabase Auto-docs)
**Demo Video:** https://youtube.com/watch?v=homeplate-demo (akan dibuat untuk submission)

**Development URLs:**
- **Local Development:** http://localhost:3000
- **Supabase Dashboard:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq
- **Vercel Dashboard:** https://vercel.com/dashboard (setelah deployment)

#### 11.3.2 Kredensial Testing

| Role | Email | Password | Akses Level |
|------|-------|----------|-------------|
| Admin | admin@homeplate.com | admin123 | Full system access, user management, admin dashboard |
| Regular User | user1@homeplate.com | user123 | Standard features, personal data, recipe recommendations |
| Test User | test@homeplate.com | test123 | Limited testing account dengan sample data |

**TABEL 11 Kredensial Testing**

#### 11.3.3 Panduan Akses

**Untuk Admin:**
1. **Login Akses:**
   - Visit application URL
   - Login dengan kredensial admin atau Google OAuth
   - Automatic redirect ke admin dashboard jika role = 'admin'

2. **Admin Dashboard Navigation:**
   - `/admin` - Main admin dashboard dengan user statistics
   - User management section dengan role toggle functionality
   - System tools: database checker, notification trigger
   - Real-time monitoring dan system health indicators

3. **Admin Functions:**
   - View all registered users dengan profile information
   - Toggle user roles (user ↔ admin) dengan confirmation
   - Test email notification system
   - Monitor system performance dan error logs
   - Access admin-only RPC functions

**Untuk Regular User:**
1. **Registrasi/Login:**
   - Visit application URL
   - Register dengan email/password atau Google OAuth
   - Complete profile setup (height, weight, age, gender)
   - Automatic redirect ke main dashboard

2. **Feature Access Flow:**
   - **Dashboard** `/` - Overview dengan quick actions
   - **Recipes** `/recipes` - AI recommendations dengan filtering
   - **Ingredients** `/ingredients` - Browse dan AI search functionality
   - **Storage** `/storage` - Digital pantry management
   - **Nutrition** `/nutrition` - Goal setting dan meal tracking
   - **Profile** `/profile` - Personal settings dan preferences

3. **Typical User Journey:**
   - Setup profile dan nutrition goals
   - Add ingredients ke digital pantry
   - Get AI recipe recommendations berdasarkan available ingredients
   - Log meals dan track nutrition progress
   - Receive email notifications untuk expiring ingredients

**Support Information:**
- **Documentation:** Comprehensive guides dalam repository README
- **Issue Reporting:** GitHub Issues untuk bug reports
- **Feature Requests:** GitHub Discussions untuk enhancement suggestions
- **Contact:** Email support untuk critical issues
