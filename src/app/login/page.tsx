'use client'
import { createClient } from '@/utils/supabase'

export default function LoginPage() {
  // This creates the connection to your Supabase project
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This tells Google to send the user back to your home page after login
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="p-8 border rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-black">Welcome to Smart Bookmarks</h1>
        <p className="text-gray-600 mb-8">Please sign in to manage your bookmarks</p>
        
        <button 
          onClick={handleLogin}
          className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}