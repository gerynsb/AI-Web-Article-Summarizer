"use client";
import { useState } from "react";

// Komponen Spinner kecil untuk loading state
function LoadingSpinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset state sebelum memulai
    setLoading(true);
    setSummary(""); 
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      // Beri sedikit delay buatan agar animasi loading terlihat smooth (opsional)
      setTimeout(() => {
         setSummary(data.summary);
         setLoading(false);
      }, 500);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-gray-900 font-sans selection:bg-blue-100">
      {/* Header Minimalis */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2 tracking-tight cursor-pointer">
          <span className="text-blue-600 text-3xl">❖</span> 
          <span>Dean<span className="text-blue-600">AI</span></span>
        </div>
      </header>

      {/* Container Utama */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl w-full space-y-12 text-center">
          
          {/* Judul & Subjudul */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#111827]">
              Website Summarizer with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Dean AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Simplify your reading. Paste any article URL below to get instant, AI-powered summaries.
            </p>
          </div>

          {/* Area Form Input */}
          <form onSubmit={handleSummarize} className="max-w-3xl mx-auto flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            <div className="w-full relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <input
                type="url"
                id="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your link here (e.g., https://techcrunch.com/...)"
                className="relative w-full px-8 py-5 text-lg bg-white border-0 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 placeholder-gray-400 text-center transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center px-14 py-4 rounded-full text-lg font-semibold text-white shadow-xl transition-all duration-300 ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed pl-10 pr-14" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-600 hover:shadow-blue-500/40 hover:-translate-y-1"
              }`}
            >
              {loading && <LoadingSpinner />}
              {loading ? "Processing..." : "Summarize"}
            </button>
          </form>

          {/* Notifikasi Error */}
          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-200 animate-in fade-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          {/* Hasil Rangkuman yang Dipoles */}
          {summary && !loading && (
            <div className="max-w-3xl mx-auto mt-16 text-left animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgb(8,112,184,0.1)] border border-blue-50/50 relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 pb-4 border-b border-gray-100">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">✨</span> 
                  Summary Result
                </h2>
                <div 
                  // Kustomisasi prose tailwind untuk bullet points biru
                  className="prose prose-lg prose-slate max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900 
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-li:text-gray-700 prose-li:marker:text-blue-500 prose-ul:space-y-3"
                  dangerouslySetInnerHTML={{ __html: summary }} 
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}