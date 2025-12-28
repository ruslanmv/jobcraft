import React, { useEffect, useState } from 'react'

const LS_URL = 'jobcraft_ollabridge_url'
const LS_KEY = 'jobcraft_ollabridge_key'

export default function OllaBridgeConnect({ open, onClose, onSaved }) {
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setBaseUrl(localStorage.getItem(LS_URL) || 'http://localhost:11435')
    setApiKey(localStorage.getItem(LS_KEY) || '')
    setStatus(null)
  }, [open])

  const test = async () => {
    setBusy(true); setStatus(null)
    try {
      const r = await fetch('/api/ollabridge/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_url: baseUrl, api_key: apiKey })
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Test failed')
      setStatus({ ok: true, detail: d.health })
    } catch (e) {
      setStatus({ ok: false, detail: e.message })
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    localStorage.setItem(LS_URL, baseUrl)
    localStorage.setItem(LS_KEY, apiKey)
    onSaved?.({ baseUrl, apiKey })
    onClose?.()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl bg-jc-900 border border-jc-700/60 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Connect OllaBridge (your PC)</h3>
            <p className="text-sm text-white/60 mt-1">
              JobCraft will use your local OllaBridge as the default LLM provider.
            </p>
          </div>
          <button className="text-white/70 hover:text-white" onClick={onClose}>✕</button>
        </div>

        <div className="mt-5 grid gap-3">
          <div>
            <label className="text-xs text-white/60">OllaBridge Base URL</label>
            <input
              className="mt-1 w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="http://localhost:11435"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">API Key</label>
            <input
              className="mt-1 w-full bg-jc-800 border border-jc-700 rounded-xl px-3 py-2"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ollabridge-..."
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              disabled={busy || !baseUrl}
              onClick={test}
              className="rounded-xl px-4 py-2 font-semibold bg-white/10 border border-jc-700 hover:bg-white/15 disabled:opacity-50">
              {busy ? 'Testing…' : 'Test connection'}
            </button>
            <button
              disabled={!apiKey || !baseUrl}
              onClick={save}
              className="rounded-xl px-4 py-2 font-semibold bg-jc-accent text-black disabled:opacity-50">
              Save
            </button>
          </div>

          {status && (
            <div className={`mt-3 text-sm rounded-xl border p-3 ${status.ok ? 'border-jc-accent/60 bg-jc-accent/10' : 'border-red-400/40 bg-red-500/10'}`}>
              <div className="font-semibold">{status.ok ? '✅ Connected' : '❌ Not connected'}</div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-white/80">{JSON.stringify(status.detail, null, 2)}</pre>
            </div>
          )}

          <div className="mt-2 text-xs text-white/50">
            Tip: start OllaBridge on your PC with <span className="text-white/80">ollabridge start</span> and copy the key it prints.
          </div>
        </div>
      </div>
    </div>
  )
}
