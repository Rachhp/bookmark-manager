'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setLoading(false)
        fetchBookmarks()
      }
    }
    checkUser()

    // REAL-TIME LISTENER: Handles both INSERT and DELETE instantly
    const channel = supabase
      .channel('realtime-bookmarks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookmarks' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setBookmarks(data)
  }

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    const savedTitle = title
    const savedUrl = formattedUrl
    setTitle('')
    setUrl('')

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ title: savedTitle, url: savedUrl }])
      .select() 

    if (error) {
      alert("Error saving: " + error.message)
      return
    }

    if (data) {
      setBookmarks((prev) => [data[0], ...prev])
    }
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert("Error deleting bookmark")
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-xl bg-black text-white">Loading...</div>

  return (
    <main className="max-w-2xl mx-auto p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] text-white bg-black min-h-screen">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Smart Bookmarks</h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
          className="text-sm font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
        >
          Sign Out
        </button>
      </div>

      {/* Input Section */}
      <section className="mb-12">
        <form onSubmit={addBookmark} className="flex flex-col gap-5 bg-[#111] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-100">Add New Link</h2>
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" placeholder="Title (e.g., GitHub)"
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white" required 
            />
            <input 
              type="text" placeholder="URL (example.com)"
              value={url} onChange={(e) => setUrl(e.target.value)}
              className="p-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white" required 
            />
          </div>
          <button type="submit" className="bg-white text-black font-extrabold p-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg">
            Save Bookmark
          </button>
        </form>
      </section>

      {/* List Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-800 pb-4 flex justify-between items-center text-gray-400">
          Your Saved Links
          <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-black">{bookmarks.length}</span>
        </h2>
        
        {bookmarks.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic">
            <p>No bookmarks yet. Start by adding one above!</p>
          </div>
        )}

        <div className="grid gap-4">
          {bookmarks.map((b) => (
            <div key={b.id} className="p-6 bg-white rounded-[2rem] flex justify-between items-center shadow-lg transition-all border border-transparent">
              <div className="overflow-hidden mr-4">
                <h3 className="font-bold text-xl text-black truncate mb-1">{b.title}</h3>
                <a href={b.url} target="_blank" className="text-blue-600 hover:underline text-sm truncate block font-medium">
                  {b.url}
                </a>
              </div>
              
              {/* Permanent Red Delete Button */}
              <button 
                onClick={() => deleteBookmark(b.id)}
                className="bg-red-50 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shrink-0 shadow-sm"
                title="Delete Bookmark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}