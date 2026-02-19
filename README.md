# 🚀 Smart Bookmark Manager (Full-Stack Challenge)

A real-time, secure bookmark management application built with **Next.js**, **Supabase**, and **Tailwind CSS**. 

## ⚡ The "4-Hour" Challenge
I completed the technical development of this project in just **4 hours** during my office breaks. Coming from a **3-year background in .NET and Python**, I used this challenge to prove how quickly I can adapt to a modern stack (Next.js/Supabase) by using **AI (Gemini)** as a technical pair-programmer to accelerate my transition.

## 🔗 Links
- **Live Demo:** [https://bookmark-manager-rho-teal.vercel.app/login](https://bookmark-manager-rho-teal.vercel.app/login)
- **Primary Tech:** Next.js (App Router), Supabase Auth & DB, Tailwind CSS, Vercel.

## ✨ Key Features
- **Google OAuth:** Secure login via Google Cloud.
- **Real-Time Updates:** Uses PostgreSQL Change Data Capture (CDC) to update the UI instantly when bookmarks are added or deleted without a page refresh.
- **Row Level Security (RLS):** Fully secure database architecture where users can only access their own data.
- **Production-Ready:** Optimized with React hooks (`useCallback`, `useMemo`) to ensure stable performance and zero-defect deployment.

## 🛠️ Challenges & Solutions
- **The Learning Curve:** Shifting from .NET's structured backend to Supabase's real-time listeners. I solved this by mapping my knowledge of SQL and WebSockets to the Supabase client logic.
- **Deployment:** Resolving TypeScript interface errors during the Vercel build process. I fixed this by implementing strict type-checking for the bookmark objects.
- **Hardware Constraints:** Developed on a PC system and recorded the walkthrough via mobile/tablet due to lack of a personal laptop at home, showing my resourcefulness in meeting deadlines.

## 👩‍💻 About Me
I am a Full-Stack Developer with 3+ years of experience in industrial automation (including fingerprint and facial recognition modules). I am passionate about pivoting my expertise in system reliability into the modern Web and AI/ML space.
