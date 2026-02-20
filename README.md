# LocalServe 🚀

**LocalServe** is a premium, localized service marketplace platform designed for India. It connects users with verified local experts and high-end tech professionals through a seamless, role-based onboarding experience.

## ✨ Features

- **Role-Based Onboarding**: Tailored registration flows for Customers (hiring) and Providers (offering services).
- **Interactive Search**: Integrated geolocation and city-based filtering to find the best local talent.
- **Provider Comparisons**: Side-by-side comparison tool for ratings, pricing, and specialized skills.
- **Real-Time Data**: Fully integrated with Supabase for live user profiles and service listings.
- **Premium UI**: Dark-themed glassmorphic interface with 3D perspective enhancements and pink branding.
- **Localized Experience**: Centered on Indian markets with INR (₹) currency and local contact hubs.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Styling**: Vanilla CSS & Tailwind Utility Classes
- **Notifications**: Sonner (Toasts)

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/frontend`: React application (Vite template).
- `/supabase`: Database schemas and migrations.
- `/public`: Static assets and logos.

