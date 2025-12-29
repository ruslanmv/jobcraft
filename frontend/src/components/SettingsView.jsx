import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Lock,
  Laptop,
  Bot,
  Activity,
  ArrowRight,
  Globe,
  WifiOff,
  AlertTriangle
} from 'lucide-react';

const OllaBridgeSetup = ({ config, onTest, testing, testResult }) => {
    const [url, setUrl] = useState(config?.base_url || 'http://localhost:11435');
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState(config?.model || 'deepseek-r1');

    const isConnected = config?.configured || false;

    if (isConnected) {
        return (
            <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
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
                    <button
                        onClick={() => onTest('ollabridge')}
                        disabled={testing}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                        title="Test Connection"
                    >
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
                           {model}
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">URL</span>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium text-xs truncate">
                           {config?.base_url || url}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                         <span>JobCraft</span> <ArrowRight size={10} /> <span>OllaBridge</span> <ArrowRight size={10} /> <span>Your PC</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-slate-800">Connect OllaBridge</h4>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">OllaBridge URL</label>
                    <div className="relative">
                        <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="http://localhost:11435"
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Usually http://localhost:11435 or your secure tunnel URL.</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-ollabridge-..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Copy from `ollabridge start` output</p>
                </div>

                <button
                    onClick={() => onTest('ollabridge')}
                    disabled={testing || !url || !apiKey}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {testing ? <><RefreshCw className="animate-spin" size={16} /> Testing...</> : 'Test Connection'}
                </button>

                {testResult && (
                    <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                        {testResult.success ? '✅ Connected successfully!' : `❌ ${testResult.error}`}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProviderCard = ({ provider, selected, onSelect, onTest, testing, testResult, children }) => {
    const IconComponent = provider.icon === 'laptop' ? Laptop : Bot;
    const isConfigured = provider.configured;

    return (
        <div>
            <button
                onClick={() => onSelect(provider.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${
                    selected
                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
                <div className={`p-3 rounded-lg shrink-0 ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <IconComponent size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${selected ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {provider.label}
                        </span>
                        {provider.recommended && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold tracking-wide">
                                RECOMMENDED
                            </span>
                        )}
                        {isConfigured && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                CONFIGURED
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                        {provider.description}
                    </div>
                </div>
                {selected && <CheckCircle2 size={24} className="text-indigo-600 shrink-0" />}
            </button>

            {selected && children}
        </div>
    );
};

const SettingsView = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('ollabridge');
    const [providerStatus, setProviderStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        fetchProviders();
        fetchStatus();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await fetch('/api/providers/');
            const data = await response.json();
            setProviders(data);
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/providers/status');
            const data = await response.json();
            setProviderStatus(data);
            setSelectedProvider(data.active_provider || 'ollabridge');
        } catch (error) {
            console.error('Failed to fetch provider status:', error);
        }
    };

    const testConnection = async (providerId) => {
        setTesting(true);
        setTestResult(null);
        try {
            const response = await fetch(`/api/providers/test/${providerId}`, {
                method: 'POST'
            });
            const data = await response.json();
            setTestResult(data);

            // Refresh status after test
            if (data.success) {
                await fetchStatus();
            }
        } catch (error) {
            setTestResult({
                success: false,
                error: error.message || 'Connection test failed'
            });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 mt-1">Manage global preferences and AI configurations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Cpu size={18} /> AI Engine
                    </h3>
                    <span className="text-xs text-slate-400">Your computer is now your private AI engine.</span>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {providers.map(provider => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                selected={selectedProvider === provider.id}
                                onSelect={setSelectedProvider}
                                onTest={testConnection}
                                testing={testing}
                                testResult={selectedProvider === provider.id ? testResult : null}
                            >
                                {provider.id === 'ollabridge' && (
                                    <OllaBridgeSetup
                                        config={providerStatus?.providers?.ollabridge}
                                        onTest={testConnection}
                                        testing={testing}
                                        testResult={testResult}
                                    />
                                )}
                                {/* Add other provider-specific config panels here */}
                            </ProviderCard>
                        ))}
                    </div>
                </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                    <Globe size={18} /> Regional Defaults
                </h3>
                <div className="text-sm text-slate-600">
                    <p className="mb-2">Current defaults for new application packets:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-500">
                        <li>Countries: IT, DE, GB, CH</li>
                        <li>Locale: en-GB</li>
                        <li>Timezone: Europe/Rome</li>
                    </ul>
                    <p className="mt-4 text-xs text-slate-400">Configure these in your .env file on the backend.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
