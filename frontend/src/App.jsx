import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Briefcase,
  FileText,
  Settings,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Download,
  Cpu,
  Lock,
  Eye,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Upload,
  Mail,
  RefreshCw,
  Globe,
  Bot,
  Wifi,
  WifiOff,
  Activity,
  Server,
  Laptop,
  Star
} from 'lucide-react';
import SettingsView from './components/SettingsView.jsx';

// --- Mock Data ---

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechNova",
    source: "Greenhouse",
    matchScore: 92,
    status: "Packet Ready",
    location: "Remote",
    posted: "2 days ago",
    skills: {
      matched: ["React", "TypeScript", "Tailwind", "Vite"],
      missing: ["GraphQL", "AWS"]
    }
  },
  {
    id: 2,
    title: "Product Designer",
    company: "FlowState",
    source: "Lever",
    matchScore: 85,
    status: "Discovered",
    location: "New York, NY",
    posted: "5 hours ago",
    skills: {
      matched: ["Figma", "UI Systems", "Prototyping"],
      missing: ["HTML/CSS"]
    }
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Nebula Systems",
    source: "Workable",
    matchScore: 64,
    status: "Discovered",
    location: "Austin, TX",
    posted: "1 day ago",
    skills: {
      matched: ["Node.js", "PostgreSQL"],
      missing: ["React", "Docker", "Kubernetes"]
    }
  }
];

const APP_STATS = [
  { label: "Jobs Discovered", value: "124", change: "+12", icon: Search },
  { label: "Packets Crafted", value: "8", change: "+2", icon: FileText },
  { label: "Compliance Score", value: "100%", change: "Safe", icon: ShieldCheck, color: "text-emerald-600" },
];

const COUNTRIES = [
  { code: 'IT', label: 'Italy', icon: '🇮🇹' },
  { code: 'DE', label: 'Germany', icon: '🇩🇪' },
  { code: 'GB', label: 'UK', icon: '🇬🇧' },
  { code: 'CH', label: 'Switzerland', icon: '🇨🇭' },
];

const PROVIDERS = [
  { id: 'ollabridge', label: 'Your Computer (OllaBridge)', icon: Laptop, desc: 'Private, free, local AI via secure tunnel.', recommended: true },
  { id: 'openai', label: 'OpenAI GPT-4', icon: Bot, desc: 'High reasoning capabilities. API Key required.' },
  { id: 'anthropic', label: 'Claude 3.5', icon: Bot, desc: 'Excellent for creative writing. API Key required.' },
  { id: 'gemini', label: 'Gemini Pro', icon: Bot, desc: 'Fast and multimodal. API Key required.' },
  { id: 'watsonx', label: 'IBM watsonx', icon: Bot, desc: 'Enterprise grade security. API Key required.' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
    <span className="font-medium">{label}</span>
  </button>
);

const ComplianceBadge = () => (
  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
    <ShieldCheck size={14} className="text-emerald-600" />
    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Safe Zone Active</span>
  </div>
);

const ConnectionStatus = ({ provider, status }) => {
    if (provider !== 'ollabridge') return null;

    return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
            status === 'connected'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
            : 'bg-amber-50 border-amber-100 text-amber-700'
        }`}>
            {status === 'connected' ? <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> : <WifiOff size={12} />}
            <span>{status === 'connected' ? 'Using your computer' : 'Waiting for computer...'}</span>
        </div>
    );
};

const MatchScore = ({ score }) => {
  let color = "bg-red-500";
  if (score >= 80) color = "bg-emerald-500";
  else if (score >= 60) color = "bg-amber-500";

  return (
    <div className="flex items-center space-x-2">
      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-sm font-bold text-slate-700">{score}%</span>
    </div>
  );
};

// --- OllaBridge Setup Component ---

const OllaBridgeSetup = ({ isConnected, setIsConnected }) => {
    const [step, setStep] = useState(isConnected ? 3 : 1);
    const [url, setUrl] = useState('http://localhost:11435');
    const [testing, setTesting] = useState(false);
    const [latency, setLatency] = useState(null);

    const testConnection = () => {
        setTesting(true);
        // Simulate network request
        setTimeout(() => {
            setTesting(false);
            setLatency(120);
            if (step === 2) setStep(3);
            setIsConnected(true);
        }, 1500);
    };

    const disconnect = () => {
        setIsConnected(false);
        setStep(1);
        setLatency(null);
    };

    if (isConnected) {
        return (
            <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Laptop size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-emerald-900">Your Computer is Connected</h4>
                            <p className="text-xs text-emerald-700">OllaBridge is active via secure tunnel.</p>
                        </div>
                    </div>
                    <button onClick={testConnection} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg" title="Test Latency">
                        <RefreshCw size={16} className={testing ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                        <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-medium text-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Model</span>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium text-sm">
                           deepseek-r1
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Latency</span>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium text-sm">
                           <Activity size={14} className="text-slate-400" /> ~{latency || 120}ms
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                         <span>JobCraft</span> <ArrowRight size={10} /> <span>OllaBridge</span> <ArrowRight size={10} /> <span>Your PC</span>
                    </div>
                    <button onClick={disconnect} className="text-xs text-red-500 hover:text-red-600 font-medium">Disconnect</button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold text-slate-800">Connect OllaBridge</h4>
                <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">OllaBridge URL</label>
                        <div className="relative">
                            <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Usually http://localhost:11435 or your secure tunnel URL.</p>
                    </div>
                    <button onClick={() => setStep(2)} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key (Optional)</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        onClick={testConnection}
                        disabled={testing}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {testing ? <RefreshCw className="animate-spin" size={16} /> : 'Test Connection'}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full py-2 text-slate-500 text-sm hover:text-slate-700">Back</button>
                </div>
            )}
        </div>
    );
};

// --- Views ---

const DashboardView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Mission Control</h2>
        <p className="text-slate-500 mt-1">Your local-first, compliance-safe application hub.</p>
      </div>
      <div className="text-right text-sm text-slate-400">
        Data encrypted & stored locally
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {APP_STATS.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-slate-50 ${stat.color || 'text-slate-600'}`}>
              <stat.icon size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">
              {stat.change}
            </span>
            <span className="text-slate-400 ml-2">since yesterday</span>
          </div>
        </div>
      ))}
    </div>

    {/* Compliance Monitor */}
    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-indigo-500 opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={18} className="text-emerald-400" />
            Compliance Guardrails
          </h3>
          <p className="text-slate-400 text-sm mt-1 max-w-lg">
            Jobcraft ensures you stay within platform rules. No bots, no scraping, no automated submissions.
          </p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-300">LinkedIn Scraping: <span className="text-emerald-400 font-mono">DISABLED</span></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-300">Human-in-Loop: <span className="text-emerald-400 font-mono">ACTIVE</span></span>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const WorkbenchView = ({ provider }) => {
    const [activeTab, setActiveTab] = useState('coverLetter');
    const [selectedCountry, setSelectedCountry] = useState('IT');

    return (
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Job Context Column */}
        <div className="w-1/3 flex flex-col gap-6">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Briefcase size={16} /> Job Context
                    </h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg" title="Visit ATS Safe Browser">
                            <ExternalLink size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                        <input type="text" defaultValue="Senior Frontend Engineer" className="w-full text-sm font-medium text-slate-900 border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Company</label>
                        <input type="text" defaultValue="TechNova" className="w-full text-sm font-medium text-slate-900 border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Job Description</label>
                        <textarea className="w-full h-32 text-xs text-slate-600 border border-slate-200 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none" defaultValue="We are looking for a Senior Frontend Engineer with 5+ years of experience in React..." />
                    </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col gap-4 flex-1">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Settings size={16} /> Configuration
                </h3>

                <div className="space-y-4">
                    {/* CV Upload */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Source Resume</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                             <FileText size={24} className="text-slate-300 group-hover:text-indigo-400 mb-2" />
                             <span className="text-xs text-slate-600 font-medium">My_Resume_2025.pdf</span>
                             <span className="text-[10px] text-slate-400">Click to change</span>
                        </div>
                    </div>

                     {/* Country Selector */}
                     <div>
                         <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Target Region</label>
                         <div className="flex gap-2">
                            {COUNTRIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => setSelectedCountry(c.code)}
                                    className={`flex-1 py-1.5 rounded-lg text-sm border transition-all ${
                                        selectedCountry === c.code
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {c.icon} {c.code}
                                </button>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <p className="text-xs text-center text-slate-400 mb-2">
                        Powered by <span className="font-semibold text-slate-500">{PROVIDERS.find(p => p.id === provider)?.label}</span>
                    </p>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                        <Cpu size={18} /> Craft Packet
                    </button>
                </div>
             </div>
        </div>

        {/* Workbench Output Column */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {/* Tabs */}
             <div className="px-2 pt-2 border-b border-slate-100 bg-slate-50 flex gap-1">
                {[
                    { id: 'coverLetter', label: 'Cover Letter', icon: FileText },
                    { id: 'bullets', label: 'Resume Bullets', icon: MoreHorizontal },
                    { id: 'questions', label: 'Screening Qs', icon: Bot },
                    { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === tab.id
                            ? 'bg-white text-indigo-600 border-t border-x border-slate-200 shadow-[0_-1px_2px_rgba(0,0,0,0.02)] relative -bottom-px'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-white">
                {activeTab === 'coverLetter' && (
                     <div className="prose prose-sm max-w-none text-slate-600">
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6 flex gap-3 text-amber-800 text-xs">
                             <AlertCircle size={16} className="shrink-0" />
                             <p>This draft is tailored for the <strong>UK/EU market</strong> using <strong>{provider}</strong>'s reasoning. Verify spelling before sending.</p>
                        </div>
                        <p className="mb-4">Dear Hiring Manager,</p>
                        <p className="mb-4">
                            I am writing to express my strong interest in the Senior Frontend Engineer role at TechNova. With over 5 years of experience building scalable applications using
                            <span className="bg-emerald-50 text-emerald-700 px-1 mx-1 rounded border border-emerald-100">React</span> and
                            <span className="bg-emerald-50 text-emerald-700 px-1 mx-1 rounded border border-emerald-100">TypeScript</span>,
                            I am confident in my ability to contribute immediately to your engineering team.
                        </p>
                        <p className="mb-4">
                            In my previous role, I migrated a legacy codebase to Vite, improving build times by 40%—a challenge I see TechNova is currently tackling.
                        </p>
                        <p>Sincerely,<br/>[Your Name]</p>
                    </div>
                )}
                {activeTab === 'bullets' && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase">Tailored Resume Bullets</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                            <li>Orchestrated the migration of a 50k LOC monolith to <strong>React/Vite</strong>, reducing CI/CD build times by <strong>40%</strong>.</li>
                            <li>Implemented a robust <strong>TypeScript</strong> design system used by 3 separate product teams, increasing code reusability by 25%.</li>
                            <li>Optimized frontend performance, achieving a Lighthouse score of 98/100 for Core Web Vitals.</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'questions' && (
                     <div className="space-y-6">
                         <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Why TechNova?</h4>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                I've followed TechNova's open source contributions to the Vite ecosystem for years. I am passionate about developer tooling and want to apply my experience in performance optimization to help your team scale.
                            </p>
                         </div>
                     </div>
                )}
                {activeTab === 'checklist' && (
                    <div className="space-y-2">
                         {['Verify PDF formatting', 'Check for typos in Company Name', 'Update LinkedIn link', 'Review "Remote" status requirements'].map((item, i) => (
                             <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                 <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                 <span className="text-sm text-slate-700">{item}</span>
                             </div>
                         ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-xl">
                <span className="text-xs text-slate-400">Draft saved locally</span>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors">
                        <Download size={16} /> Export Packet
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors group">
                        Track & Apply <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
};

const DiscoveryView = () => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Job Discovery</h2>
                <p className="text-slate-500 mt-1">Direct connector to compliant ATS boards.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto items-center">
                 <div className="flex border border-slate-200 rounded-lg bg-white overflow-hidden p-1">
                     {COUNTRIES.map(c => (
                         <button key={c.code} className="px-2 py-1 text-sm hover:bg-slate-50 rounded">{c.icon}</button>
                     ))}
                 </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex gap-4">
                 <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none">
                     <option>Greenhouse</option>
                     <option>Lever</option>
                     <option>Ashby</option>
                 </select>
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Enter Board Token (e.g. 'stripe') or Company Slug..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                    Fetch Jobs
                </button>
             </div>
             <p className="text-xs text-slate-400 mt-3 ml-1 flex items-center gap-1">
                 <CheckCircle2 size={12} className="text-emerald-500" />
                 Only fetches from official public APIs. No scraping.
             </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Discovery Results</h3>
            {MOCK_JOBS.slice(1).map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md group cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                             <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                                {job.company[0]}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                <p className="text-slate-500 flex items-center gap-2 mt-1">
                                    {job.company}
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    {job.location}
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{job.posted}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                Track
                             </button>
                             <span className="text-[10px] text-slate-400 font-mono">{job.source.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ApplicationsView = () => (
    <div className="space-y-6">
         <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Tracker</h2>
                <p className="text-slate-500 mt-1">Manage your active pipeline.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                <Mail size={16} /> Send Email Digest
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Company</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Last Action</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_JOBS.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                            <td className="px-6 py-4 text-slate-600">{job.company}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                    job.status === 'Packet Ready' ? 'bg-purple-50 text-purple-700' :
                                    job.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {job.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{job.posted}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Main Layout ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalProvider, setGlobalProvider] = useState('ollabridge');
  const [ollabridgeConnected, setOllabridgeConnected] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-indigo-700 mb-8">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Briefcase size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Jobcraft</h1>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Search} label="Find Jobs" active={activeTab === 'discovery'} onClick={() => setActiveTab('discovery')} />
            <SidebarItem icon={Cpu} label="Workbench" active={activeTab === 'workbench'} onClick={() => setActiveTab('workbench')} />
            <SidebarItem icon={FileText} label="Applications" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
            <a
                href="https://github.com/ruslanmv/jobcraft"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors mb-6 shadow-sm group"
            >
                <Star size={16} className="text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                Star this project
            </a>

            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-2">SAFE ZONE STATUS</p>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <ShieldCheck size={16} />
                    <span>Protected</span>
                </div>
            </div>
            <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-2 py-2 w-full transition-colors rounded-lg ${
                    activeTab === 'settings'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
            >
                <Settings size={20} className={activeTab === 'settings' ? 'text-indigo-600' : ''} />
                <span className="font-medium text-sm">Settings</span>
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <a
                    href="https://github.com/ruslanmv/ollabridge"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-medium text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
                >
                    Powered by <span className="font-bold">OllaBridge</span>
                </a>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Title could go here */}
            </div>
            <div className="flex items-center gap-4">
                {/* OllaBridge Status Indicator */}
                <ConnectionStatus provider={globalProvider} status={ollabridgeConnected ? 'connected' : 'disconnected'} />

                <ComplianceBadge />
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    JD
                </div>
            </div>
        </header>

        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'discovery' && <DiscoveryView />}
        {activeTab === 'workbench' && <WorkbenchView provider={globalProvider} />}
        {activeTab === 'applications' && <ApplicationsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default App;
