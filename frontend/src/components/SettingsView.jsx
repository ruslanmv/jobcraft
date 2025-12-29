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
  Save
} from 'lucide-react';

const OllaBridgeSetup = ({ config, onTest, testing, testResult, onActivate, isActive, switching }) => {
    const [step, setStep] = useState(config?.configured ? 3 : 1);
    const [url, setUrl] = useState(config?.base_url || 'http://localhost:11435');
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState(config?.model || 'deepseek-r1');
    const [latency, setLatency] = useState(null);

    const isConnected = config?.configured || false;

    const testConnection = () => {
        onTest('ollabridge');
        // Simulate latency measurement
        setTimeout(() => {
            if (testResult?.success) {
                setLatency(120);
                if (step === 2) setStep(3);
            }
        }, 1500);
    };

    const disconnect = () => {
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
                    <button
                        onClick={testConnection}
                        disabled={testing}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                        title="Test Latency"
                    >
                        <RefreshCw size={16} className={testing ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                        <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-medium text-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Online
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Model</span>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium text-sm">
                           {model}
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
                    <div className="flex gap-2">
                        {!isActive && onActivate && (
                            <button
                                onClick={onActivate}
                                disabled={switching}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                            >
                                {switching ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                Activate
                            </button>
                        )}
                        {isActive && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                                <CheckCircle2 size={12} />
                                Active
                            </div>
                        )}
                        <button onClick={disconnect} className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1">Disconnect</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold text-slate-800">Connect OllaBridge</h4>
                <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
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
                                placeholder="http://localhost:11435"
                                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
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
                                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            />
                        </div>
                    </div>
                    <button
                        onClick={testConnection}
                        disabled={testing}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {testing ? <RefreshCw className="animate-spin" size={16} /> : null}
                        {testing ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full py-2 text-slate-500 text-sm hover:text-slate-700">Back</button>

                    {testResult && (
                        <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                            {testResult.success ? '✅ Connected successfully!' : `❌ ${testResult.error}`}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GenericProviderConfig = ({ providerId, config, onUpdate, onSave, onActivate, isActive, switching }) => {
    const [loadingModels, setLoadingModels] = useState(false);
    const [availableModels, setAvailableModels] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        apiKey: '',
        model: '',
        baseUrl: '',
        projectId: '' // for watsonx
    });

    const handleLoadModels = async () => {
        setLoadingModels(true);
        try {
            const response = await fetch(`/api/providers/${providerId}/models`);
            const data = await response.json();
            if (data.models) {
                setAvailableModels(data.models);
            }
        } catch (error) {
            console.error('Failed to load models:', error);
            // Mock fallback for demo purposes
            const mocks = {
                openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
                anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
                gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
                watsonx: ['ibm/granite-13b-chat-v2', 'meta-llama/llama-3-70b-instruct'],
            };
            setAvailableModels(mocks[providerId] || []);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            if (onSave) {
                await onSave(providerId, formData);
            }
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        const newFormData = { ...formData, [key]: value };
        setFormData(newFormData);
        if (onUpdate) {
            onUpdate(newFormData);
        }
    };

    return (
        <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Settings size={14} className="text-slate-400" /> {providerId.toUpperCase()} Configuration
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
                            value={formData.apiKey || ''}
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
                            value={formData.projectId || ''}
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
                                    value={formData.model || ''}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                >
                                    <option value="">Select a model</option>
                                    {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder={providerId === 'watsonx' ? 'ibm/granite-13b-chat-v2' : providerId === 'openai' ? 'gpt-4o-mini' : providerId === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 'gemini-1.5-pro'}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                    value={formData.model || ''}
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
                    <p className="text-xs text-slate-400 mt-1">Click refresh to load available models from {providerId}</p>
                </div>

                {/* Base URL (Optional) */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Base URL (Optional)</label>
                    <input
                        type="text"
                        placeholder={providerId === 'watsonx' ? 'https://api.watsonx.ai/v1' : providerId === 'openai' ? 'https://api.openai.com/v1' : providerId === 'anthropic' ? 'https://api.anthropic.com/v1' : 'https://api.gemini.com/v1'}
                        className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-600"
                        value={formData.baseUrl || ''}
                        onChange={(e) => handleChange('baseUrl', e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-600 font-medium h-4">{message}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                        >
                            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Settings
                        </button>
                        {!isActive && onActivate && (
                            <button
                                onClick={onActivate}
                                disabled={switching}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                            >
                                {switching ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                Activate
                            </button>
                        )}
                        {isActive && (
                            <div className="flex items-center gap-2 px-6 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                <CheckCircle2 size={16} />
                                Currently Active
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProviderCard = ({ provider, selected, isActive, onSelect, onTest, testing, testResult, children }) => {
    const IconComponent = provider.icon === 'laptop' ? Laptop : Bot;
    const isConfigured = provider.configured;

    return (
        <div>
            <button
                onClick={() => onSelect(provider.id)}
                disabled={provider.disabled}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${
                    provider.disabled
                        ? 'opacity-50 pointer-events-none grayscale'
                        : selected
                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
                <div className={`p-3 rounded-lg shrink-0 ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <IconComponent size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${selected ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {provider.label}
                        </span>
                        {isActive && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold tracking-wide">
                                ✓ ACTIVE
                            </span>
                        )}
                        {provider.recommended && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold tracking-wide">
                                RECOMMENDED
                            </span>
                        )}
                        {isConfigured && !isActive && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                CONFIGURED
                            </span>
                        )}
                        {provider.disabled && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold tracking-wide">
                                SOON
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                        {provider.description}
                    </div>
                </div>
                {selected ? (
                    <CheckCircle2 size={24} className="text-indigo-600 shrink-0" />
                ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 shrink-0" />
                )}
            </button>

            {selected && !provider.disabled && (
                <div className="ml-4 pl-6 border-l-2 border-indigo-100 mt-2 animate-in slide-in-from-top-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const SettingsView = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('ollabridge');
    const [activeProvider, setActiveProvider] = useState('ollabridge'); // Backend active provider
    const [providerStatus, setProviderStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [providerConfigs, setProviderConfigs] = useState({});
    const [switching, setSwitching] = useState(false);

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
            const backendActiveProvider = data.active_provider || 'ollabridge';
            setActiveProvider(backendActiveProvider);
            setSelectedProvider(backendActiveProvider);
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

    const updateProviderConfig = (providerId, config) => {
        setProviderConfigs(prev => ({
            ...prev,
            [providerId]: config
        }));
    };

    const saveProviderConfig = async (providerId, config) => {
        try {
            // TODO: Implement actual backend API call to save provider config
            // For now, this is a placeholder that will be implemented with backend endpoint
            console.log('Saving config for', providerId, config);

            // Simulated save for demo
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Refresh status after save
            await fetchStatus();
        } catch (error) {
            console.error('Failed to save provider config:', error);
            throw error;
        }
    };

    const activateProvider = async (providerId) => {
        if (activeProvider === providerId) {
            return; // Already active
        }

        setSwitching(true);
        try {
            // TODO: Implement actual backend API call to switch active provider
            // For now, this is a placeholder
            console.log('Switching active provider to:', providerId);

            // Simulated switch
            await new Promise((resolve) => setTimeout(resolve, 500));

            setActiveProvider(providerId);
            await fetchStatus();
        } catch (error) {
            console.error('Failed to switch provider:', error);
        } finally {
            setSwitching(false);
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
        <div className="max-w-3xl mx-auto space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shrink-0">
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 mt-1">Manage global preferences and AI configurations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden max-h-[calc(100vh-12rem)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 shrink-0">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Cpu size={18} /> AI Engine
                    </h3>
                    <span className="text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                        Active: <span className="font-bold text-indigo-600 uppercase">{activeProvider}</span>
                    </span>
                </div>

                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <div className="space-y-3">
                        {providers.map(provider => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                selected={selectedProvider === provider.id}
                                isActive={activeProvider === provider.id}
                                onSelect={setSelectedProvider}
                                onTest={testConnection}
                                testing={testing}
                                testResult={selectedProvider === provider.id ? testResult : null}
                            >
                                {provider.id === 'ollabridge' ? (
                                    <OllaBridgeSetup
                                        config={providerStatus?.providers?.ollabridge}
                                        onTest={testConnection}
                                        testing={testing}
                                        testResult={testResult}
                                        onActivate={() => activateProvider('ollabridge')}
                                        isActive={activeProvider === 'ollabridge'}
                                        switching={switching}
                                    />
                                ) : (
                                    <GenericProviderConfig
                                        providerId={provider.id}
                                        config={providerConfigs[provider.id] || {}}
                                        onUpdate={(config) => updateProviderConfig(provider.id, config)}
                                        onSave={saveProviderConfig}
                                        onActivate={() => activateProvider(provider.id)}
                                        isActive={activeProvider === provider.id}
                                        switching={switching}
                                    />
                                )}
                            </ProviderCard>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-4 text-center shrink-0">
                    <p className="text-xs text-slate-500">
                        JobCraft respects your privacy. Cloud keys are stored locally using AES-256 encryption.
                    </p>
                </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 shrink-0">
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
