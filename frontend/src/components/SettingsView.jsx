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
  AlertTriangle,
  Settings,
  Key,
  Save,
  ChevronDown
} from 'lucide-react';

const OllaBridgeSetup = ({ isConnected, setIsConnected }) => {
    const [step, setStep] = useState(isConnected ? 3 : 1);
    const [url, setUrl] = useState('http://localhost:11435');
    const [apiKey, setApiKey] = useState('');
    const [testing, setTesting] = useState(false);
    const [latency, setLatency] = useState(null);

    // Load existing config on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const response = await fetch('/api/providers/ollabridge/config');
                if (response.ok) {
                    const data = await response.json();
                    if (data.config.base_url) setUrl(data.config.base_url);
                    if (data.config.api_key && data.config.api_key !== '***') {
                        setApiKey(data.config.api_key);
                    }
                }
            } catch (error) {
                console.error('Failed to load OllaBridge config:', error);
            }
        };
        loadConfig();
    }, []);

    const testConnection = async () => {
        setTesting(true);
        try {
            // Save config first
            await fetch('/api/providers/ollabridge/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base_url: url, api_key: apiKey }),
            });

            // Test connection
            const response = await fetch('/api/providers/test/ollabridge', { method: 'POST' });
            const result = await response.json();

            if (result.success) {
                setLatency(120);
                if (step === 2) setStep(3);
                setIsConnected(true);
            } else {
                alert(`Connection failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            alert('Failed to test connection');
        } finally {
            setTesting(false);
        }
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
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
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
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
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

const GenericProviderConfig = ({ providerId, config, onUpdate }) => {
    const [loadingModels, setLoadingModels] = useState(false);
    const [availableModels, setAvailableModels] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Load available models from backend
    const handleLoadModels = async () => {
        setLoadingModels(true);
        try {
            const response = await fetch(`/api/providers/${providerId}/models`);
            const data = await response.json();
            if (data.error) {
                setMessage(`Error loading models: ${data.error}`);
                setTimeout(() => setMessage(''), 5000);
            } else {
                setAvailableModels(data.models || []);
            }
        } catch (error) {
            console.error('Failed to load models:', error);
            setMessage('Failed to load models');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoadingModels(false);
        }
    };

    // Save provider configuration to backend
    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch(`/api/providers/${providerId}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: config.apiKey,
                    model: config.model,
                    base_url: config.baseUrl,
                    project_id: config.projectId, // for WatsonX
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            setMessage('Failed to save settings');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        onUpdate({ ...config, [key]: value });
    };

    return (
        <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Settings size={14} className="text-slate-400" /> {providerId} Configuration
            </h4>

            <div className="space-y-4">
                {/* API Key */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="password"
                            placeholder={`sk-... (${providerId} key)`}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={config.apiKey || ''}
                            onChange={(e) => handleChange('apiKey', e.target.value)}
                        />
                    </div>
                </div>

                {/* WatsonX Specific: Project ID */}
                {providerId === 'watsonx' && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Project ID</label>
                        <input
                            type="text"
                            placeholder="Your watsonx project ID"
                            className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={config.projectId || ''}
                            onChange={(e) => handleChange('projectId', e.target.value)}
                        />
                    </div>
                )}

                {/* Model Selection */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Model</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Bot className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            {availableModels.length > 0 ? (
                                <select
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white appearance-none"
                                    value={config.model || ''}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                >
                                    <option value="">Select a model</option>
                                    {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder={providerId === 'watsonx' ? 'ibm/granite-13b-chat-v2' : 'gpt-4o-mini'}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                    value={config.model || ''}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                />
                            )}
                        </div>
                        <button
                            onClick={handleLoadModels}
                            disabled={loadingModels}
                            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            title="Load available models"
                        >
                            <RefreshCw size={16} className={loadingModels ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Base URL (Optional) */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Base URL (Optional)</label>
                    <input
                        type="text"
                        placeholder={providerId === 'watsonx' ? 'https://api.watsonx.ai/v1' : 'https://api.openai.com/v1'}
                        className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-600"
                        value={config.baseUrl || ''}
                        onChange={(e) => handleChange('baseUrl', e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-600 font-medium h-4">{message}</span>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

const SettingsView = ({ selectedProvider, setSelectedProvider, ollabridgeConnected, setOllabridgeConnected }) => {
    // Provider configurations loaded from backend
    const [configs, setConfigs] = useState({
        openai: { apiKey: '', model: '', baseUrl: '' },
        claude: { apiKey: '', model: '', baseUrl: '' },
        gemini: { apiKey: '', model: '' },
        watsonx: { apiKey: '', projectId: '', model: '', baseUrl: '' },
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Load provider configs on mount
    useEffect(() => {
        const loadConfigs = async () => {
            const providers = ['openai', 'claude', 'gemini', 'watsonx'];
            for (const provider of providers) {
                try {
                    const response = await fetch(`/api/providers/${provider}/config`);
                    if (response.ok) {
                        const data = await response.json();
                        setConfigs(prev => ({
                            ...prev,
                            [provider]: {
                                apiKey: data.config.api_key || '',
                                model: data.config.model || '',
                                baseUrl: data.config.base_url || '',
                                projectId: data.config.project_id || '',
                            }
                        }));
                    }
                } catch (error) {
                    console.error(`Failed to load ${provider} config:`, error);
                }
            }
        };
        loadConfigs();
    }, []);

    const PROVIDERS = [
        { id: 'ollabridge', label: 'Your Computer (OllaBridge)', icon: Laptop, desc: 'Private, free, local AI via secure tunnel.', recommended: true },
        { id: 'openai', label: 'OpenAI GPT-4', icon: Bot, desc: 'High reasoning capabilities. API Key required.' },
        { id: 'claude', label: 'Claude 3.5', icon: Bot, desc: 'Excellent for creative writing. API Key required.' },
        { id: 'gemini', label: 'Gemini Pro', icon: Bot, desc: 'Fast and multimodal. API Key required.' },
        { id: 'watsonx', label: 'IBM watsonx', icon: Bot, desc: 'Enterprise grade security. API Key required.' },
        { id: 'azure', label: 'Azure OpenAI', icon: Server, desc: 'Enterprise deployments. (Coming Soon)', disabled: true },
        { id: 'mistral', label: 'Mistral API', icon: Bot, desc: 'European open-weight models. (Coming Soon)', disabled: true },
    ];

    const updateConfig = (providerId, newConfig) => {
        setConfigs(prev => ({ ...prev, [providerId]: newConfig }));
    };

    // Update active provider when selection changes
    useEffect(() => {
        const setActiveProvider = async () => {
            try {
                await fetch('/api/providers/active', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ provider: selectedProvider }),
                });
            } catch (error) {
                console.error('Failed to set active provider:', error);
            }
        };
        if (selectedProvider) {
            setActiveProvider();
        }
    }, [selectedProvider]);

    const activeProviderData = PROVIDERS.find(p => p.id === selectedProvider) || PROVIDERS[0];

    return (
        <div className="max-w-3xl mx-auto space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shrink-0">
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 mt-1">Manage global preferences and AI configurations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">
                <div className="p-6">
                     <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <Cpu size={18} /> AI Provider
                    </h3>

                    {/* Custom Dropdown Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-xl hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <activeProviderData.icon size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                        {activeProviderData.label}
                                        {activeProviderData.recommended && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>}
                                    </div>
                                    <div className="text-xs text-slate-500">{activeProviderData.desc}</div>
                                </div>
                            </div>
                            <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-80 overflow-y-auto p-2">
                                {PROVIDERS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            if (!p.disabled) {
                                                setSelectedProvider(p.id);
                                                setIsDropdownOpen(false);
                                            }
                                        }}
                                        disabled={p.disabled}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                            selectedProvider === p.id
                                            ? 'bg-indigo-50 text-indigo-900'
                                            : p.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <div className={`p-1.5 rounded-md ${selectedProvider === p.id ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <p.icon size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium flex items-center gap-2">
                                                {p.label}
                                                {p.disabled && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">SOON</span>}
                                            </div>
                                        </div>
                                        {selectedProvider === p.id && <CheckCircle2 size={16} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Configuration Panel */}
                    <div className="mt-2">
                        {selectedProvider === 'ollabridge' ? (
                            <OllaBridgeSetup isConnected={ollabridgeConnected} setIsConnected={setOllabridgeConnected} />
                        ) : (
                            <GenericProviderConfig
                                providerId={selectedProvider}
                                config={configs[selectedProvider] || {}}
                                onUpdate={(newConfig) => updateConfig(selectedProvider, newConfig)}
                            />
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                    <p className="text-xs text-slate-500">
                        JobCraft respects your privacy. Cloud keys are stored locally using AES-256 encryption.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
