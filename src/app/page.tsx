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
    
    // 1. Format the URL
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    // 2. Clear inputs immediately for a better user experience
    const savedTitle = title
    const savedUrl = formattedUrl
    setTitle('')
    setUrl('')

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ title: savedTitle, url: savedUrl }])
      .select() 

    if (error) {
      alert("Error saving: " + error.message)
      return
    }

    // 4. Update the list locally so it shows up instantly without refresh
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

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-xl">Loading...</div>

  return (
    <main className="max-w-2xl mx-auto p-8 font-[family-name:var(--font-geist-sans)] text-black">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Smart Bookmarks</h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
          className="text-sm font-semibold bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Input Section */}
      <section className="mb-12">
        <form onSubmit={addBookmark} className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
          <h2 className="text-lg font-bold text-gray-700">Add New Link</h2>
          <div className="grid grid-cols-1 gap-3">
            <input 
              type="text" placeholder="Title (e.g., GitHub)"
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" required 
            />
            <input 
              type="text" placeholder="URL (example.com)"
              value={url} onChange={(e) => setUrl(e.target.value)}
              className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all" required 
            />
          </div>
          <button type="submit" className="bg-black text-white font-bold p-3 rounded-xl hover:opacity-90 transition-all active:scale-95">
            Save Bookmark
          </button>
        </form>
      </section>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 flex justify-between">
          Your Saved Links
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{bookmarks.length}</span>
        </h2>
        
        {bookmarks.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="italic">No bookmarks yet. Start by adding one above!</p>
          </div>
        )}

        {bookmarks.map((b) => (
          <div key={b.id} className="group p-5 border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all bg-white">
            <div className="overflow-hidden mr-4">
              <h3 className="font-bold text-lg truncate text-gray-800">{b.title}</h3>
              <a href={b.url} target="_blank" className="text-blue-500 hover:text-blue-700 text-sm truncate block transition-colors">
                {b.url}
              </a>
            </div>
            <button 
              onClick={() => deleteBookmark(b.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white text-xs font-bold"
            >
              DELETE
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}