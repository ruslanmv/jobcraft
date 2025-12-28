import React, { useEffect, useMemo, useState } from 'react'
import { Briefcase, Sparkles, Upload, ShieldCheck, Search, ListChecks, Send, Plug } from 'lucide-react'
import OllaBridgeConnect from './components/OllaBridgeConnect.jsx'

const COUNTRIES = [
  { code: 'IT', label: 'Italy' },
  { code: 'DE', label: 'Germany' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CH', label: 'Switzerland' },
]

const LS_URL = 'jobcraft_ollabridge_url'
const LS_KEY = 'jobcraft_ollabridge_key'

export default function App() {
  const [providers, setProviders] = useState([])
  const [provider, setProvider] = useState('ollabridge')

  const [country, setCountry] = useState('IT')
  const [countriesCsv, setCountriesCsv] = useState('IT,DE,GB,CH')

  const [jobTitle, setJobTitle] = useState('Backend Engineer')
  const [company, setCompany] = useState('Example Inc')
  const [jobDescription, setJobDescription] = useState('Paste the job description here...')
  const [cvFile, setCvFile] = useState(null)

  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  const [boardType, setBoardType] = useState('greenhouse')
  const [boardToken, setBoardToken] = useState('')
  const [foundJobs, setFoundJobs] = useState([])

  const [tracked, setTracked] = useState([])

  const [connectOpen, setConnectOpen] = useState(false)

  useEffect(() => {
    fetch('/api/providers')
      .then(r => r.json())
      .then(d => {
        setProviders(d.providers || [])
        if ((d.providers || []).includes('ollabridge')) setProvider('ollabridge')
      })
      .catch(() => {})

    refreshTracked()

    // First-run prompt if no key saved
    const savedKey = localStorage.getItem(LS_KEY)
    if (!savedKey) setConnectOpen(true)
  }, [])

  const refreshTracked = async () => {
    try {
      const r = await fetch('/api/tracker/jobs')
      const d = await r.json()
      setTracked(d.jobs || [])
    } catch {}
  }

  const canRun = useMemo(() => jobTitle && company && jobDescription && cvFile, [jobTitle, company, jobDescription, cvFile])

  const runPacket = async () => {
    setBusy(true)
    setOut('')
    try {
      // We keep server config in .env for production.
      // The connect modal helps the user store values locally + test connectivity.
      // If you want true runtime server reconfig, add a secure admin endpoint to write .env.
      const fd = new FormData()
      fd.append('provider', provider)
      fd.append('job_title', jobTitle)
      fd.append('company', company)
      fd.append('job_description', jobDescription)
      fd.append('country', country)
      fd.append('cv_file', cvFile)

      const r = await fetch('/api/jobcraft/packet', { method: 'POST', body: fd })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Request failed')
      setOut(d.packet_markdown || '')
    } catch (e) {
      setOut(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const discover = async () => {
    setBusy(true)
    setFoundJobs([])
    try {
      if (!boardToken) throw new Error('Enter a board token/company slug')
      const endpoint = boardType === 'greenhouse'
        ? `/api/discover/greenhouse/${encodeURIComponent(boardToken)}?countries=${encodeURIComponent(countriesCsv)}`
        : `/api/discover/lever/${encodeURIComponent(boardToken)}?countries=${encodeURIComponent(countriesCsv)}`
      const r = await fetch(endpoint)
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Discovery failed')
      setFoundJobs(d.jobs || [])
    } catch (e) {
      setOut(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const trackJob = async (j) => {
    try {
      await fetch('/api/tracker/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: String(j.id),
          title: j.title,
          company: j.company,
          url: j.url,
          location: j.location,
          country: j.country || null,
          source: j.source,
          posted_at: j.posted_at,
          status: 'discovered'
        })
      })
      await refreshTracked()
    } catch {}
  }

  const sendDigest = async () => {
    const to = prompt('Send digest to email:')
    if (!to) return
    try {
      const r = await fetch('/api/digest/email?to_email=' + encodeURIComponent(to), { method: 'POST' })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Email failed')
      alert('Digest sent')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <OllaBridgeConnect
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onSaved={() => {}}
      />

      <header className="flex items-center justify-between mb-8 border-b border-jc-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-jc-800 border border-jc-700"><Briefcase /></div>
          <div>
            <h1 className="text-2xl font-bold">JobCraft Copilot</h1>
            <p className="text-sm text-white/60">EU-first job search + packet builder. OllaBridge-first.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConnectOpen(true)}
            className="text-xs px-3 py-2 rounded-xl bg-white/10 border border-jc-700 hover:bg-white/15 inline-flex items-center gap-2">
            <Plug size={14} /> Connect OllaBridge
          </button>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck size={16} className="text-jc-accent" />
            Safe-zone: no LinkedIn/Indeed automation
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="bg-jc-900 border border-jc-700/60 rounded-2xl p-6 xl:col-span-1">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles size={18} /> Packet Builder</h2>
          <p className="text-sm text-white/60 mt-1">EU/Europe defaults. Choose a country for tone hints.</p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="flex gap-3">
              <input className="w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Job title" />
              <input className="w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
            </div>

            <textarea className="w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2 min-h-[180px]" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="cursor-pointer inline-flex items-center gap-2 bg-jc-800 border border-jc-700 rounded-xl px-3 py-2">
                <Upload size={16} />
                <span className="text-sm">{cvFile ? cvFile.name : 'Upload CV (PDF/DOCX/TXT)'}</span>
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={e => setCvFile(e.target.files?.[0] || null)} />
              </label>

              <select className="bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={provider} onChange={e => setProvider(e.target.value)}>
                {providers.length ? providers.map(p => <option key={p} value={p}>{p}</option>) : <option value="ollabridge">ollabridge</option>}
              </select>

              <select className="bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>

            <button
              disabled={!canRun || busy}
              onClick={runPacket}
              className="rounded-xl px-4 py-2 font-semibold bg-jc-accent text-black disabled:opacity-50 disabled:cursor-not-allowed">
              {busy ? 'Crafting…' : 'Craft Packet'}
            </button>
          </div>
        </section>

        <section className="bg-jc-900 border border-jc-700/60 rounded-2xl p-6 xl:col-span-1">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Search size={18} /> Discover Jobs (Compliant)</h2>
          <p className="text-sm text-white/60 mt-1">ATS job board endpoints (Greenhouse/Lever). Filter IT/DE/GB/CH.</p>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <div className="flex gap-3">
              <select className="bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={boardType} onChange={e => setBoardType(e.target.value)}>
                <option value="greenhouse">Greenhouse</option>
                <option value="lever">Lever</option>
              </select>
              <input className="w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={boardToken} onChange={e => setBoardToken(e.target.value)} placeholder="board token (GH) / company slug (Lever)" />
            </div>

            <input className="w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2" value={countriesCsv} onChange={e => setCountriesCsv(e.target.value)} placeholder="Countries CSV: IT,DE,GB,CH" />

            <button disabled={busy} onClick={discover} className="rounded-xl px-4 py-2 font-semibold bg-white/10 border border-jc-700 hover:bg-white/15">
              {busy ? 'Searching…' : 'Fetch latest jobs (up to 100)'}
            </button>

            <div className="max-h-[300px] overflow-auto border border-jc-700/60 rounded-xl">
              {foundJobs.length === 0 ? (
                <div className="p-3 text-sm text-white/50">No results yet.</div>
              ) : foundJobs.map(j => (
                <div key={j.id} className="p-3 border-b border-jc-700/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{j.title}</div>
                      <div className="text-xs text-white/60">{j.company} • {j.location || '—'} • {j.source}</div>
                    </div>
                    <button onClick={() => trackJob(j)} className="text-xs px-3 py-1 rounded-lg bg-jc-accent text-black">Track</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black/40 border border-jc-700/60 rounded-2xl p-6 xl:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ListChecks size={18} /> Tracker</h2>
            <button onClick={sendDigest} className="text-xs px-3 py-2 rounded-xl bg-white/10 border border-jc-700 hover:bg-white/15 inline-flex items-center gap-2">
              <Send size={14} /> Email digest
            </button>
          </div>
          <p className="text-sm text-white/60 mt-1">Track jobs and statuses. Digest emails require SMTP config.</p>

          <div className="mt-4 max-h-[260px] overflow-auto border border-jc-700/60 rounded-xl">
            {tracked.length === 0 ? (
              <div className="p-3 text-sm text-white/50">No tracked jobs yet.</div>
            ) : tracked.map(r => (
              <div key={r.id} className="p-3 border-b border-jc-700/40">
                <div className="text-xs text-white/60">{r.status.toUpperCase()}</div>
                <div className="font-semibold">{r.company} — {r.title}</div>
                <a className="text-xs text-jc-accent underline" href={r.url} target="_blank" rel="noreferrer">Open posting</a>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="whitespace-pre-wrap text-sm text-white/90">{out || 'Packet output / errors will appear here.'}</pre>
          </div>
        </section>
      </main>

      <footer className="mt-10 text-xs text-white/50">
        <p>JobCraft is an assistant. You must review and submit applications yourself. Use compliant job sources (ATS/company pages) and respect platform terms.</p>
      </footer>
    </div>
  )
}
