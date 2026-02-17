'use client'
import { createClient } from '@/utils/supabase'

export default function Login() {
  const supabase = createClient()

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md w-full">
        {/* Logo/Icon Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
             </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Smart Bookmarks
          </h1>
          <p className="text-gray-400 text-lg">
            Organize your digital world in one place.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111] border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl text-center">
          <h2 className="text-white text-xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-sm">Please sign in to manage your library</p>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg"
          >
            {/* Google G Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-600 text-xs mt-8 tracking-widest uppercase font-bold">
          Secure • Real-time • Private
        </p>
      </div>
    </main>
  )
}