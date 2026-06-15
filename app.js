/**
 * Password Strength Checker - Core Application
 * Modularized from inline script in index.html
 * v2.1 - Code organization improvement
 */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const STORAGE_KEYS = {
    STATS: 'password-stats',
    THEME: 'password-checker-theme',
    HISTORY: 'password-history',
    TUTORIAL_SHOWN: 'tutorial-shown'
};

const MAX_HISTORY = 10;
const GUESSES_PER_SECOND = 10000000000; // 10 billion guesses/sec

// ============================================
// PASSWORD STRENGTH ANALYSIS
// ============================================
function toggleVisibility() {
    const input = document.getElementById('passwordInput');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function checkStrength() {
    const password = document.getElementById('passwordInput')?.value || '';
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    if (!fill || !text) return;

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)
    };

    // Update criteria indicators
    updateCriterion('lengthCheck', checks.length);
    updateCriterion('upperCheck', checks.upper);
    updateCriterion('lowerCheck', checks.lower);
    updateCriterion('numberCheck', checks.number);
    updateCriterion('specialCheck', checks.special);

    // Calculate score
    let score = 0;
    if (checks.length) score++;
    if (checks.upper) score++;
    if (checks.lower) score++;
    if (checks.number) score++;
    if (checks.special) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Update strength display
    fill.className = 'strength-fill';
    let strengthLevel = '';

    if (password.length === 0) {
        text.textContent = 'Enter a password';
        text.style.color = '#9ca3af';
    } else if (score <= 2) {
        fill.classList.add('strength-weak');
        text.textContent = '🔴 Weak';
        text.style.color = '#ef4444';
        strengthLevel = 'weak';
    } else if (score <= 4) {
        fill.classList.add('strength-fair');
        text.textContent = '🟡 Fair';
        text.style.color = '#f59e0b';
        strengthLevel = 'fair';
    } else if (score <= 6) {
        fill.classList.add('strength-good');
        text.textContent = '🔵 Good';
        text.style.color = '#3b82f6';
        strengthLevel = 'good';
    } else {
        fill.classList.add('strength-strong');
        text.textContent = '🟢 Strong';
        text.style.color = '#10b981';
        strengthLevel = 'strong';
    }

    calculateCrackTime(password);

    // Update stats when password is checked
    if (password.length > 0) {
        updatePasswordStats(password, strengthLevel);
    }
}

function updateCriterion(id, passed) {
    const el = document.getElementById(id);
    if (!el) return;

    if (passed) {
        el.className = 'check-icon check-pass';
        el.textContent = '✓';
    } else {
        el.className = 'check-icon check-pending';
        el.textContent = '○';
    }
}

function calculateCrackTime(password) {
    const crackTimeEl = document.getElementById('crackTime');
    if (!crackTimeEl) return;

    if (password.length === 0) {
        crackTimeEl.textContent = '-';
        return;
    }

    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

    const combinations = Math.pow(charset, password.length);
    const seconds = combinations / GUESSES_PER_SECOND;

    let timeText;
    if (seconds < 1) {
        timeText = 'Instantly';
    } else if (seconds < 60) {
        timeText = Math.round(seconds) + ' seconds';
    } else if (seconds < 3600) {
        timeText = Math.round(seconds / 60) + ' minutes';
    } else if (seconds < 86400) {
        timeText = Math.round(seconds / 3600) + ' hours';
    } else if (seconds < 31536000) {
        timeText = Math.round(seconds / 86400) + ' days';
    } else if (seconds < 3153600000) {
        timeText = Math.round(seconds / 31536000) + ' years';
    } else {
        timeText = 'Centuries';
    }

    crackTimeEl.textContent = timeText;
}

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 'weak', label: 'Weak' };
    if (score <= 4) return { level: 'fair', label: 'Fair' };
    if (score <= 6) return { level: 'good', label: 'Good' };
    return { level: 'strong', label: 'Strong' };
}

// ============================================
// PASSWORD GENERATOR
// ============================================
function updateLengthDisplay() {
    const slider = document.getElementById('lengthSlider');
    const display = document.getElementById('lengthValue');
    if (slider && display) {
        display.textContent = slider.value;
    }
}

function generatePasswords() {
    const lengthSlider = document.getElementById('lengthSlider');
    const includeUpper = document.getElementById('includeUppercase');
    const includeLower = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');

    if (!lengthSlider) return;

    const length = parseInt(lengthSlider.value);
    const hasUpper = includeUpper?.checked ?? true;
    const hasLower = includeLower?.checked ?? true;
    const hasNumbers = includeNumbers?.checked ?? true;
    const hasSymbols = includeSymbols?.checked ?? true;

    // Validate at least one option is selected
    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
        showToast('Please select at least one character type');
        return;
    }

    // Generate 3 password options
    const passwords = [];
    for (let i = 0; i < 3; i++) {
        passwords.push(generateSinglePassword(length, hasUpper, hasLower, hasNumbers, hasSymbols));
    }

    displayGeneratedPasswords(passwords);
    showToast('✨ New passwords generated!');
}

function generateSinglePassword(length, includeUpper, includeLower, includeNumbers, includeSymbols) {
    let charset = '';
    const requiredChars = [];

    if (includeLower) {
        charset += 'abcdefghijklmnopqrstuvwxyz';
        requiredChars.push('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
    }
    if (includeUpper) {
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        requiredChars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
    }
    if (includeNumbers) {
        charset += '0123456789';
        requiredChars.push('0123456789'[Math.floor(Math.random() * 10)]);
    }
    if (includeSymbols) {
        const symbols = '!@#$%^&*';
        charset += symbols;
        requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    let password = requiredChars.join('');

    for (let i = requiredChars.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function displayGeneratedPasswords(passwords) {
    const container = document.getElementById('generatedPasswords');
    if (!container) return;

    container.innerHTML = '';

    passwords.forEach((password) => {
        const strength = getPasswordStrength(password);

        const optionDiv = document.createElement('div');
        optionDiv.className = 'password-option';
        optionDiv.innerHTML = `
            <div class="password-text">${escapeHtml(password)}</div>
            <span class="password-strength-badge badge-${strength.level}">${strength.label}</span>
            <button class="copy-btn" onclick="copyToClipboard('${escapeHtml(password)}', this)">
                📋 Copy
            </button>
            <button class="use-btn" onclick="usePassword('${escapeHtml(password)}')">
                Use
            </button>
        `;
        container.appendChild(optionDiv);
    });

    // Save first generated password to history
    if (passwords.length > 0) {
        const strength = getPasswordStrength(passwords[0]);
        savePasswordToHistory(passwords[0], strength.level);
    }
}

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Copied!';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }
        showToast('Copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!');
    });
}

function usePassword(password) {
    const input = document.getElementById('passwordInput');
    if (input) {
        input.value = password;
        input.type = 'text';
        checkStrength();
        showToast('Password applied to checker!');
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ============================================
// PASSWORD STATISTICS
// ============================================
function getStats() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.STATS);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load stats:', e);
    }

    return {
        totalChecked: 0,
        strengthCounts: { weak: 0, fair: 0, good: 0, strong: 0 },
        totalLength: 0,
        lastReset: new Date().toISOString()
    };
}

function saveStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
        console.warn('Failed to save stats:', e);
    }
}

function updatePasswordStats(password, strength) {
    const stats = getStats();

    // Increment total
    stats.totalChecked++;

    // Update strength counts
    if (strength && stats.strengthCounts.hasOwnProperty(strength)) {
        stats.strengthCounts[strength]++;
    }

    // Update total length for average calculation
    stats.totalLength += password.length;

    saveStats(stats);
    renderStats();
}

function calculateAverageLength(stats) {
    if (stats.totalChecked === 0) return 0;
    return (stats.totalLength / stats.totalChecked).toFixed(1);
}

function calculateSecurityScore(stats) {
    const total = stats.totalChecked;
    if (total === 0) return 0;

    const goodOnes = stats.strengthCounts.good + stats.strengthCounts.strong;
    return Math.round((goodOnes / total) * 100);
}

function getPercentage(count, total) {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
}

function renderStats() {
    const stats = getStats();
    const total = stats.totalChecked;

    // Update stat cards
    const totalCheckedEl = document.getElementById('total-checked');
    const avgLengthEl = document.getElementById('avg-length-stat');
    const strongCountEl = document.getElementById('strong-count');
    const securityScoreEl = document.getElementById('security-score');
    const avgLengthBigEl = document.getElementById('avg-length-big');

    if (totalCheckedEl) totalCheckedEl.textContent = total.toLocaleString();
    if (avgLengthEl) avgLengthEl.textContent = calculateAverageLength(stats);
    if (strongCountEl) strongCountEl.textContent = stats.strengthCounts.strong;
    if (securityScoreEl) securityScoreEl.textContent = calculateSecurityScore(stats) + '%';
    if (avgLengthBigEl) avgLengthBigEl.textContent = calculateAverageLength(stats);

    // Update strength bars
    const strengths = ['weak', 'fair', 'good', 'strong'];
    strengths.forEach(strength => {
        const count = stats.strengthCounts[strength];
        const percentage = getPercentage(count, total);

        const bar = document.getElementById('bar-' + strength);
        const countEl = document.getElementById('count-' + strength);

        if (bar) bar.style.width = percentage + '%';
        if (countEl) countEl.textContent = count;
    });
}

function resetStats() {
    if (confirm('Reset all password statistics? This cannot be undone.')) {
        const newStats = {
            totalChecked: 0,
            strengthCounts: { weak: 0, fair: 0, good: 0, strong: 0 },
            totalLength: 0,
            lastReset: new Date().toISOString()
        };
        saveStats(newStats);
        renderStats();
        showToast('📊 Statistics reset!');
    }
}

// ============================================
// PASSWORD HISTORY
// ============================================
function getPasswordHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load history:', e);
    }
    return [];
}

function savePasswordToHistory(password, strength) {
    if (!password || password.length === 0) return;

    const history = getPasswordHistory();

    // Don't save duplicates of the most recent entry
    if (history.length > 0 && history[0].password === password) return;

    const entry = {
        password: password,
        strength: strength,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };

    history.unshift(entry);
    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
        console.warn('Failed to save history:', e);
    }

    renderPasswordHistory();
}

function deleteHistoryItem(index) {
    const history = getPasswordHistory();
    history.splice(index, 1);
    try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
        console.warn('Failed to save history:', e);
    }
    renderPasswordHistory();
    showToast('🗑️ Removed from history');
}

function clearHistory() {
    if (confirm('Clear all password history? This cannot be undone.')) {
        try {
            localStorage.removeItem(STORAGE_KEYS.HISTORY);
        } catch (e) {
            console.warn('Failed to clear history:', e);
        }
        renderPasswordHistory();
        showToast('🗑️ History cleared');
    }
}

function maskPassword(password) {
    if (password.length <= 4) return password;
    return password.substring(0, 4) + '•'.repeat(Math.min(password.length - 4, 8));
}

function renderPasswordHistory() {
    const history = getPasswordHistory();
    const container = document.getElementById('password-history-list');
    const countEl = document.getElementById('history-count');

    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <div class="history-empty-icon">📝</div>
                <p>No passwords generated yet</p>
                <p style="font-size: 0.85em; margin-top: 5px;">Generated passwords will appear here</p>
            </div>
        `;
    } else {
        container.innerHTML = history.map((item, index) => `
            <div class="history-item">
                <div class="history-password">${escapeHtml(maskPassword(item.password))}</div>
                <div class="history-meta">
                    <span class="history-strength ${item.strength}">${item.strength}</span>
                    <span class="history-date">${item.date}</span>
                    <div class="history-actions">
                        <button class="history-btn" onclick="usePassword('${escapeHtml(item.password)}')" title="Use this password">📋</button>
                        <button class="history-btn" onclick="deleteHistoryItem(${index})" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (countEl) {
        countEl.textContent = `${history.length}/${MAX_HISTORY}`;
    }
}

// ============================================
// THEME MANAGEMENT
// ============================================
function initThemeToggle() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const themeIcon = document.getElementById('themeIcon');

    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
        }
    }

    // Setup toggle button
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('themeIcon');

    if (isDark) {
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        localStorage.setItem(STORAGE_KEYS.THEME, 'light');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + D = Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }

        // Ctrl/Cmd + G = Generate password
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            generatePasswords();
        }

        // Ctrl/Cmd + C (when not in input) = Copy current password
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' &&
            !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            e.preventDefault();
            const input = document.getElementById('passwordInput');
            if (input && input.value) {
                navigator.clipboard.writeText(input.value);
                showToast('📋 Password copied!');
            }
        }

        // Escape = Clear input
        if (e.key === 'Escape') {
            const input = document.getElementById('passwordInput');
            if (input && document.activeElement === input) {
                input.value = '';
                checkStrength();
                input.blur();
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initThemeToggle();
    initKeyboardShortcuts();
    renderStats();
    renderPasswordHistory();
    updateLengthDisplay();

    // Log initialization
    console.log('%c🔐 Password Strength Checker v2.1', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
    console.log('%cLoaded successfully!', 'color: #10b981;');
});

// ============================================
// SHARE FUNCTIONALITY
// ============================================
function initShareButton() {
    const existingBtn = document.getElementById('shareBtn');
    if (existingBtn) return;

    const shareBtn = document.createElement('button');
    shareBtn.id = 'shareBtn';
    shareBtn.textContent = '🔗 Share';
    shareBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 20px;background:#6f42c1;color:white;border:none;border-radius:20px;cursor:pointer;z-index:999;';
    shareBtn.onclick = () => {
        if (navigator.share) {
            navigator.share({ title: document.title, url: location.href });
        } else {
            navigator.clipboard.writeText(location.href);
            shareBtn.textContent = '✅ Copied!';
            setTimeout(() => shareBtn.textContent = '🔗 Share', 2000);
        }
    };
    document.body.appendChild(shareBtn);
}

// Initialize share button after DOM load
document.addEventListener('DOMContentLoaded', initShareButton);
