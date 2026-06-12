/** 
 * Keyboard Shortcuts Module
 * Adds keyboard navigation for improved accessibility and productivity
 */

// Keyboard shortcut definitions
const KEYBOARD_SHORTCUTS = {
    'Slash': { action: 'focusInput', description: 'Focus password input' },
    'Escape': { action: 'clearInput', description: 'Clear input and reset' },
    'KeyG': { action: 'generate', description: 'Generate new passwords (Ctrl/Cmd + G)' },
    'KeyD': { action: 'toggleTheme', description: 'Toggle dark mode (Ctrl/Cmd + D)' },
    'KeyC': { action: 'copyCurrent', description: 'Copy current password (Ctrl/Cmd + C when not in input)' },
    'KeyS': { action: 'showHelp', description: 'Show keyboard shortcuts help (?)' },
    'ArrowUp': { action: 'increaseLength', description: 'Increase password length' },
    'ArrowDown': { action: 'decreaseLength', description: 'Decrease password length' }
};

// Track modifier key state
let isCtrlCmdPressed = false;

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Create help modal
    createHelpModal();
    
    console.log('⌨️ Keyboard shortcuts initialized. Press ? for help.');
}

/**
 * Handle keydown events
 */
function handleKeyDown(e) {
    const inputElement = document.getElementById('passwordInput');
    const isInputFocused = document.activeElement === inputElement;
    
    // Track Ctrl/Cmd key
    if (e.ctrlKey || e.metaKey) {
        isCtrlCmdPressed = true;
    }
    
    // ? key - Show help (anywhere)
    if (e.key === '?' || (e.key === 's' && !isInputFocused && !isCtrlCmdPressed)) {
        e.preventDefault();
        toggleHelpModal();
        return;
    }
    
    // / key - Focus input (anywhere except when in input)
    if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputElement.focus();
        return;
    }
    
    // Escape - Clear input
    if (e.key === 'Escape') {
        e.preventDefault();
        clearInput();
        return;
    }
    
    // Ctrl/Cmd + key combinations
    if (isCtrlCmdPressed) {
        switch (e.code) {
            case 'KeyG':
                e.preventDefault();
                generatePasswords();
                showToast('🎲 Generated new passwords!');
                break;
                
            case 'KeyD':
                e.preventDefault();
                toggleDarkMode();
                break;
                
            case 'KeyC':
                if (!isInputFocused && inputElement.value) {
                    e.preventDefault();
                    copyToClipboard(inputElement.value);
                    showToast('📋 Current password copied!');
                }
                break;
        }
        return;
    }
    
    // Arrow keys for length (when not in input)
    if (!isInputFocused) {
        const slider = document.getElementById('lengthSlider');
        if (slider) {
            const currentValue = parseInt(slider.value);
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const newValue = Math.min(currentValue + 1, max);
                slider.value = newValue;
                updateLengthDisplay();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newValue = Math.max(currentValue - 1, min);
                slider.value = newValue;
                updateLengthDisplay();
            }
        }
    }
}

/**
 * Handle keyup events
 */
function handleKeyUp(e) {
    if (!e.ctrlKey && !e.metaKey) {
        isCtrlCmdPressed = false;
    }
}

/**
 * Clear input field
 */
function clearInput() {
    const input = document.getElementById('passwordInput');
    if (input) {
        input.value = '';
        checkStrength();
        input.blur();
        showToast('🗑️ Input cleared');
    }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

/**
 * Create help modal
 */
function createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'keyboard-help-modal';
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-modal-content">
            <div class="help-header">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <button class="help-close" onclick="toggleHelpModal()">✕</button>
            </div>
            <div class="help-body">
                <div class="shortcut-category">
                    <h3>Navigation</h3>
                    <div class="shortcut-item">
                        <kbd>/</kbd>
                        <span>Focus password input</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Clear input and reset</span>
                    </div>
                </div>
                
                <div class="shortcut-category">
                    <h3>Actions</h3>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>G</kbd>
                        <span>Generate new passwords</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>C</kbd>
                        <span>Copy current password (when not in input)</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>D</kbd>
                        <span>Toggle dark mode</span>
                    </div>
                </div>
                
                <div class="shortcut-category">
                    <h3>Generator</h3>
                    <div class="shortcut-item">
                        <kbd>↑</kbd>
                        <span>Increase password length</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>↓</kbd>
                        <span>Decrease password length</span>
                    </div>
                </div>
                
                <div class="shortcut-category">
                    <h3>Help</h3>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>Show/hide this help</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>S</kbd>
                        <span>Show shortcuts (when not in input)</span>
                    </div>
                </div>
            </div>
            <div class="help-footer">
                <p>Press <kbd>Esc</kbd> or click outside to close</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    const styles = document.createElement('style');
    styles.textContent = `
        .help-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.2s ease;
        }
        
        .help-modal.active {
            display: flex;
        }
        
        .help-modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
        }
        
        .dark-mode .help-modal-content {
            background: #1f2937;
            color: #f3f4f6;
        }
        
        .help-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .dark-mode .help-header {
            border-bottom-color: #374151;
        }
        
        .help-header h2 {
            margin: 0;
            font-size: 1.3em;
        }
        
        .help-close {
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        
        .help-close:hover {
            background: #f3f4f6;
        }
        
        .dark-mode .help-close:hover {
            background: #374151;
        }
        
        .help-body {
            padding: 20px 24px;
        }
        
        .shortcut-category {
            margin-bottom: 20px;
        }
        
        .shortcut-category:last-child {
            margin-bottom: 0;
        }
        
        .shortcut-category h3 {
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 12px;
        }
        
        .dark-mode .shortcut-category h3 {
            color: #9ca3af;
        }
        
        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;
        }
        
        .shortcut-item kbd {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 4px 10px;
            font-family: monospace;
            font-size: 0.85em;
            font-weight: 600;
            color: #374151;
            white-space: nowrap;
        }
        
        .dark-mode .shortcut-item kbd {
            background: #374151;
            border-color: #4b5563;
            color: #e5e7eb;
        }
        
        .shortcut-item span {
            color: #4b5563;
        }
        
        .dark-mode .shortcut-item span {
            color: #d1d5db;
        }
        
        .help-footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 0.85em;
            color: #6b7280;
        }
        
        .dark-mode .help-footer {
            border-top-color: #374151;
            color: #9ca3af;
        }
        
        .help-footer kbd {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 2px 6px;
            font-family: monospace;
            font-size: 0.9em;
        }
        
        .dark-mode .help-footer kbd {
            background: #374151;
            border-color: #4b5563;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleHelpModal();
        }
    });
    
    // Close on Escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleHelpModal();
        }
    });
}

/**
 * Toggle help modal visibility
 */
function toggleHelpModal() {
    const modal = document.getElementById('keyboard-help-modal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardShortcuts);
} else {
    initKeyboardShortcuts();
}
