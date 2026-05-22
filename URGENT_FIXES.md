# URGENT FIXES REQUIRED - Priority Action Items

## 🔴 IMMEDIATE (Do Today - Security Critical)

### 1. Revoke Exposed API Key
**Status**: ⚠️ ACTION REQUIRED IMMEDIATELY
- **What**: The OpenRouter API key in .env is exposed on GitHub
- **Impact**: Anyone can use your API and incur charges
- **Action**:
  1. Go to https://openrouter.ai/account/api-keys
  2. Delete the exposed key immediately
  3. Generate a new API key
  4. Update .env with the new key locally
  5. DO NOT commit .env file

```bash
# Revoke key in git history (if already pushed)
git filter-branch --tree-filter 'rm -f .env' HEAD
git push origin --force-with-lease
```

### 2. Add .env to .gitignore
```bash
# If .gitignore exists, add to it:
echo ".env" >> .gitignore

# If .gitignore doesn't exist:
echo ".env" > .gitignore

# Remove .env from git tracking (after adding to .gitignore)
git rm --cached .env
git commit -m "Remove .env from version control"
git push origin main
```

### 3. Implement Password Hashing
**Location**: [js/auth.js](js/auth.js) lines 70-80
**Current Code**:
```javascript
// INSECURE - passwords stored as plaintext
users.push(newUser); // where newUser.password is plaintext
localStorage.setItem('bharatfarm_users', JSON.stringify(users));
```

**Fixed Code**:
```javascript
// Install bcryptjs: npm install bcryptjs
const bcrypt = require('bcryptjs');

// When registering:
const hashedPassword = await bcrypt.hash(password, 10);
newUser.password = hashedPassword;

// When logging in:
const passwordMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
if (passwordMatch) {
    // Login successful
} else {
    // Login failed
}
```

---

## 🟠 HIGH PRIORITY (Do This Week)

### 4. Add Input Validation to Server Routes
**Location**: [server.js](server.js)

```javascript
// Add at top of file
function validateInput(input, maxLength = 5000) {
    if (typeof input !== 'string') return false;
    return input.length > 0 && input.length <= maxLength;
}

// In /api/chat route (line ~80):
if (!payload.messages || !Array.isArray(payload.messages)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request format' }));
    return;
}

// In /api/schemes route (line ~145):
if (!validateInput(landSize) || !validateInput(state) || !validateInput(crop)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid input parameters' }));
    return;
}
```

### 5. Fix Event Object Dependencies
**Location**: [js/calculator.js](js/calculator.js) line 11

```javascript
// WRONG (current):
function setLandUnit(unit) {
    event.target.classList.add('active'); // CRASHES if event undefined
}

// CORRECT (fixed):
function setLandUnit(unit) {
    // Remove active from all buttons
    document.querySelectorAll('.land-unit-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    const activeBtn = document.querySelector(`[data-unit="${unit}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    currentLandUnit = unit;
    document.getElementById('landUnitLabel').textContent = labels[unit];
    updateLandConversion();
}

// In HTML, update onclick:
<button data-unit="acre" onclick="setLandUnit('acre')">...</button>
```

### 6. Add Null Checks Before DOM Operations
**Location**: Multiple files

```javascript
// WRONG (current):
document.getElementById('notificationList').innerHTML = notifications.map(...).join('');

// CORRECT (fixed):
const list = document.getElementById('notificationList');
if (!list) {
    console.warn('Notification list element not found');
    return;
}
list.innerHTML = notifications.map(...).join('');
```

### 7. Restrict CORS to Specific Domains
**Location**: [server.js](server.js) lines 68-73

```javascript
// WRONG (current):
res.setHeader('Access-Control-Allow-Origin', '*');

// CORRECT (fixed):
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5000',
    'http://localhost:3000',
    'https://bharatfarm.vercel.app'
];

const origin = req.headers.origin;
if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### 8. Add Rate Limiting
**Location**: [server.js](server.js) - Add at top

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply to all routes
server.on('request', (req, res) => {
    limiter(req, res, () => {
        // Continue with normal handling
    });
});
```

---

## 🟡 MEDIUM PRIORITY (Do This Month)

### 9. Implement Proper Backend Authentication
- Move authentication to backend (use Express.js)
- Implement JWT tokens for secure session management
- Use MongoDB/PostgreSQL for user persistence
- Implement refresh tokens
- Add password reset via email

### 10. Add Error Handling for Async Operations
```javascript
// In config.js aiCall function
async function aiCall({ messages, model, temperature = 0.7, max_tokens = 800 }) {
    let lastErr = '';
    for (const m of (model ? [model] : FREE_MODELS)) {
        try {
            const res = await attempt('/api/chat', { 'X-Title': 'BharatFarm' }, 
                { model: m, messages, temperature, max_tokens });

            if (res.status === 429) { 
                lastErr = 'Rate limit exceeded'; 
                await new Promise(r => setTimeout(r, 2000)); // Wait before retry
                continue; 
            }
            if (!res.ok) { 
                lastErr = `HTTP ${res.status}`; 
                continue; 
            }

            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content?.trim();
            if (content) return content;
            
            lastErr = 'No response from AI';
        } catch (e) {
            lastErr = e.message;
            console.error('AI attempt failed:', e);
            continue;
        }
    }
    
    // Enhanced error message
    throw new Error(`AI service unavailable: ${lastErr}. Please try again later.`);
}

// Always call with try-catch:
try {
    const response = await aiCall({ messages });
} catch (error) {
    console.error('AI call failed:', error);
    showError('Sorry, AI service is temporarily unavailable. Please try again.');
    // Fallback behavior
}
```

---

## ✅ VERIFICATION CHECKLIST

After implementing fixes:

- [ ] API key revoked and new one generated
- [ ] .env added to .gitignore
- [ ] .env removed from git history
- [ ] All user inputs validated on backend
- [ ] Password hashing implemented
- [ ] CORS restricted to known domains
- [ ] Rate limiting enabled
- [ ] Error handling added to async functions
- [ ] Null checks added before DOM operations
- [ ] All sensitive data removed from frontend
- [ ] .env.example created with placeholder values
- [ ] Documentation updated with setup instructions

---

## 📞 SECURITY CONTACTS

In case of security breach:
- Revoke all exposed keys immediately
- Notify users of potential exposure
- Review git logs for sensitive data
- Consider signing commits with GPG keys

---

## 🔗 REFERENCES

- OWASP Top 10: https://owasp.org/Top10/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
- Bcryptjs Documentation: https://www.npmjs.com/package/bcryptjs
- Express Rate Limiting: https://www.npmjs.com/package/express-rate-limit
- Environment Variable Best Practices: https://12factor.net/config

