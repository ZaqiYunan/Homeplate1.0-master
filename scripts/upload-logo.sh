# Upload logo to Supabase Storage via CLI

# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref fxeogbzwstepyyjgvkrq

# 4. Upload file to storage
supabase storage upload assets homeplate-logo.png --project-ref fxeogbzwstepyyjgvkrq

# 5. Make bucket public (if needed)
supabase storage update-bucket assets --public --project-ref fxeogbzwstepyyjgvkrq
