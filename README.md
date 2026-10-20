# RNK Photo Frames — Business Portfolio & Product Catalogue

A production-ready, editorial portfolio and product catalogue website for **RNK Photo Frames**, located in **PodaturPet, Tiruttani, Tamil Nadu, India**.

Designed with warm ivory tones, charcoal typography, and restrained muted gold accents, supporting both **Tamil (தமிழ்)** and **English**.

---

## 1. Key Business Information

- **Business Name:** RNK Photo Frames
- **Location:** PodaturPet, Tiruttani, Tamil Nadu - 631208, India
- **Phone:** `+91 8681917433` (`tel:+918681917433`)
- **WhatsApp:** `+91 8681917433` (`https://wa.me/918681917433`)
- **Currency:** Indian Rupee (₹)
- **Languages:** English and Tamil
- **Model:** Customer enquiries directly via phone, WhatsApp, and database contact form. No online checkout or payments required.

---

## 2. Architecture & Tech Stack

### Frontend
- **React 19 + TypeScript**: Modular components, hooks, typed models.
- **Tailwind CSS v4**: Theme tokens for serif typography (`Cormorant Garamond`), clean body (`Plus Jakarta Sans`), and Tamil script (`Noto Sans Tamil`).
- **Lucide Icons**: Consistent iconography for products, combos, phone, and WhatsApp.
- **Vite 8**: Fast bundling and dev server.

### Backend & Database (Dual-Engine Mode)
- **Express + Node.js (`server.ts`)**: Serves public REST APIs, authenticated admin endpoints, image uploads (`multer`), and static asset delivery.
- **Persistent Local Database Engine (`data/rnk_database.json`)**: Pre-seeded with authentic RNK categories, products, combos, banners, and settings. Changes persist across restarts with atomic write protection.
- **Supabase PostgreSQL & Auth Ready**: Complete DDL migration script with Row Level Security (RLS) policies at `supabase/migrations/20261020000000_rnk_schema.sql`.

---

## 3. Product Categories

1. **Photo Frames** (`photo-frames` / `போட்டோ ஃப்ரேம்கள்`)
2. **Return Gift Combos** (`return-gift-combos` / `ரிட்டர்ன் கிஃப்ட் காம்போக்கள்`)
3. **Customized Frames** (`customized-frames` / `தனிப்பயனாக்கப்பட்ட ஃப்ரேம்கள்`)
4. **Birthday Frames** (`birthday-frames` / `பிறந்தநாள் ஃப்ரேம்கள்`)
5. **Wedding Frames** (`wedding-frames` / `திருமண ஃப்ரேம்கள்`)
6. **Other Gift Items** (`other-gift-items` / `பிற பரிசுப் பொருட்கள்`)

---

## 4. Admin Portal Access

The secure Admin Dashboard is located at `/admin` (login at `/admin/login`).

### Initial Admin Credentials:
- **Email:** `rnkphotoframes@gmail.com`
- **Password:** `RNK@Frames2026`

*Note: You can override these via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file.*

### Admin Capabilities:
- **Overview:** Live metrics for total products, active/disabled items, categories, combos, and new/unresolved enquiries.
- **Product Management:** Create, edit, soft-disable, delete, upload multiple photos, and configure multiple size variants with custom original and offer prices.
- **Combo Management:** Add/edit return gift packages, manage included items & quantities, set package pricing, and upload images.
- **Banner Carousel:** Update hero images, headings in Tamil & English, and action destinations.
- **Enquiry Management:** Search inquiries by name or phone, filter by status (`NEW`, `CONTACTED`, `RESOLVED`, `SPAM`), click-to-call, and click-to-WhatsApp.
- **Settings:** Update business phone, WhatsApp, location, intros, and Google Maps URL.
- **Database Tools:** Download full JSON database backup and review Supabase SQL schema.

---

## 5. Supabase Setup Instructions (Optional for Cloud Deployment)

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase and run the SQL migration script:
   ```bash
   cat supabase/migrations/20261020000000_rnk_schema.sql
   ```
3. Copy your project URL, anon key, and service role key into `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="eyJhbGciOi..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
   ```

---

## 6. Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
