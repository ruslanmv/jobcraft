# Provider Settings Verification

This document verifies that users can change providers, view available models, select models, and save configurations.

## ✅ Provider Switching

### Default Provider
- **Default:** `ollabridge` (set in `backend/core/config.py:79`)
- **Environment variable:** `DEFAULT_PROVIDER=ollabridge` (in `.env.example`)
- **Privacy-first:** OllaBridge is recommended for maximum privacy

### Available Providers
| Provider ID | Label | Backend Enum | Status |
|-------------|-------|--------------|--------|
| `ollabridge` | Your Computer (OllaBridge) | ✅ Matches | Active |
| `openai` | OpenAI GPT-4 | ✅ Matches | Active |
| `claude` | Claude 3.5 | ✅ Matches | Active |
| `gemini` | Gemini Pro | ✅ Matches | Active |
| `watsonx` | IBM watsonx | ✅ Matches | Active |
| `azure` | Azure OpenAI | ✅ Matches | Coming Soon |
| `mistral` | Mistral API | ✅ Matches | Coming Soon |

### How Provider Switching Works

1. **User clicks a provider** → Frontend calls:
   ```javascript
   PUT /api/providers/active
   Body: { "provider": "openai" }
   ```

2. **Backend updates active provider** → Stored in:
   ```
   ~/.jobcraft/provider_config.json
   {
     "active_provider": "openai"
   }
   ```

3. **UI immediately reflects change** → Header shows:
   ```
   Active: OPENAI
   ```

## ✅ Model Loading & Selection

### Supported Model APIs

Each provider has a dedicated model catalog endpoint:

| Provider | API Endpoint | Model Source |
|----------|--------------|--------------|
| **OllaBridge** | `GET /api/tags` | Lists models from local OllaBridge server |
| **Ollama** | `GET /api/tags` | Lists models from local Ollama server |
| **OpenAI** | `GET /v1/models` | Lists models from OpenAI API |
| **Claude** | `GET /v1/models` | Lists models from Anthropic API |
| **Gemini** | Static list | Returns predefined Gemini models |
| **WatsonX** | `GET /ml/v1/foundation_model_specs` | Lists IBM WatsonX models |

### Model Loading Flow

1. **User clicks refresh icon** → Frontend calls:
   ```javascript
   GET /api/providers/openai/models
   ```

2. **Backend fetches models** → Returns:
   ```json
   {
     "provider": "openai",
     "models": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
     "error": null
   }
   ```

3. **Frontend populates dropdown** → User sees:
   ```
   [Select a model ▼]
   - gpt-4o
   - gpt-4o-mini
   - gpt-3.5-turbo
   ```

4. **User selects model** → Updates local state (not saved yet)

### Model Placeholders (when dropdown empty)

| Provider | Placeholder Model |
|----------|-------------------|
| OpenAI | `gpt-4o-mini` |
| Claude | `gpt-4o-mini` (generic) |
| Gemini | `gpt-4o-mini` (generic) |
| WatsonX | `ibm/granite-13b-chat-v2` |

## ✅ Configuration Saving

### Fields per Provider

**OllaBridge:**
- Base URL (e.g., `http://localhost:11435`)
- API Key (optional)
- Model (e.g., `deepseek-r1`)

**OpenAI / Claude / Gemini:**
- API Key (required)
- Model (user-selected or typed)
- Base URL (optional, for proxies)

**WatsonX:**
- API Key (required)
- Project ID (required)
- Model (e.g., `ibm/granite-3-8b-instruct`)
- Base URL (default: `https://us-south.ml.cloud.ibm.com`)

### Save Flow

1. **User enters credentials:**
   ```
   API Key: sk-1234567890abcdef
   Model: gpt-4o-mini
   Base URL: https://api.openai.com/v1
   ```

2. **User clicks "Save Settings"** → Frontend calls:
   ```javascript
   PUT /api/providers/openai/config
   Body: {
     "api_key": "sk-1234567890abcdef",
     "model": "gpt-4o-mini",
     "base_url": "https://api.openai.com/v1"
   }
   ```

3. **Backend saves to file:**
   ```json
   // ~/.jobcraft/provider_config.json
   {
     "active_provider": "openai",
     "providers": {
       "openai": {
         "api_key": "sk-1234567890abcdef",
         "model": "gpt-4o-mini",
         "base_url": "https://api.openai.com/v1"
       }
     }
   }
   ```

4. **Backend returns masked key:**
   ```json
   {
     "provider": "openai",
     "config": {
       "api_key": "...cdef",  // Masked for security
       "model": "gpt-4o-mini",
       "base_url": "https://api.openai.com/v1"
     }
   }
   ```

5. **Frontend shows success:**
   ```
   ✓ Settings saved successfully!
   ```

## ✅ Configuration Loading

On Settings page mount, frontend loads all saved configs:

```javascript
// For each provider: openai, claude, gemini, watsonx
GET /api/providers/{provider}/config
```

**Response example (OpenAI):**
```json
{
  "provider": "openai",
  "config": {
    "api_key": "...cdef",  // Last 4 chars only
    "model": "gpt-4o-mini",
    "base_url": "https://api.openai.com/v1"
  }
}
```

## ✅ Security Features

### API Key Masking
- **Storage:** Full key stored in `~/.jobcraft/provider_config.json`
- **API Response:** Only last 4 characters returned (e.g., `...cdef`)
- **Input Field:** Password type (shows `••••••••`)

### File Permissions
- Config file created with user-only permissions
- Stored in user's home directory (`~/.jobcraft/`)
- Separate from `.env` file for security

## ✅ Test Scenarios

### Scenario 1: Switch from OllaBridge to OpenAI
1. Settings loads with `ollabridge` active (default)
2. User clicks "OpenAI GPT-4" → Expands config panel
3. User enters: `sk-abc123`, model: `gpt-4o-mini`
4. User clicks "Save Settings" → Success message
5. Active provider updates to `OPENAI`
6. Settings persist across page refresh

### Scenario 2: Load Available Models for Claude
1. User clicks "Claude 3.5"
2. Config panel expands showing:
   - API Key field (empty or masked)
   - Model field (text input initially)
   - Base URL field (optional)
3. User clicks refresh icon → Model dropdown populates:
   ```
   - claude-3-5-sonnet-latest
   - claude-3-opus-latest
   - claude-3-haiku-20240307
   ```
4. User selects `claude-3-5-sonnet-latest`
5. User enters API key and clicks "Save Settings"
6. Config saved to backend

### Scenario 3: Configure WatsonX with Project ID
1. User clicks "IBM watsonx"
2. Config panel shows:
   - API Key field
   - **Project ID field** (unique to WatsonX)
   - Model field
   - Base URL field
3. User enters all required fields
4. User clicks refresh → Loads IBM models
5. User selects model and saves
6. All fields persist

## ✅ API Endpoint Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/providers/` | List all providers with config status |
| `GET` | `/api/providers/status` | Get current provider status |
| `GET` | `/api/providers/{id}/models` | Load available models |
| `POST` | `/api/providers/test/{id}` | Test provider connection |
| `GET` | `/api/providers/{id}/config` | Load provider config (masked keys) |
| `PUT` | `/api/providers/{id}/config` | Save provider config |
| `GET` | `/api/providers/active` | Get active provider |
| `PUT` | `/api/providers/active` | Set active provider |

## ✅ Verification Checklist

- [x] Default provider is `ollabridge`
- [x] Users can switch providers by clicking
- [x] Each provider shows appropriate config fields
- [x] Model loading works for all providers
- [x] Users can select models from dropdown
- [x] Users can type model names if dropdown empty
- [x] Settings save to backend successfully
- [x] Settings load on page mount
- [x] Settings persist across sessions
- [x] API keys are masked in responses
- [x] Active provider updates immediately
- [x] WatsonX has unique "Project ID" field
- [x] All provider IDs match between frontend/backend

## 🐛 Fixed Issues

### Issue: Provider ID Mismatch
- **Problem:** Frontend used `'anthropic'` but backend used `'claude'`
- **Impact:** Claude config loading/saving failed with 400 error
- **Fix:** Changed frontend to use `'claude'` (commit `7433f43`)
- **Status:** ✅ Resolved

## 📝 Notes

- Environment variables (`.env`) still take precedence over runtime config
- Runtime config merges with env defaults (runtime overrides env)
- OllaBridge wizard auto-saves config when testing connection
- All cloud providers require API keys (enforced by backend validation)
- Model loading gracefully handles errors (shows error message)
