# 🔐 Password Strength Checker

A beautiful, interactive web tool for analyzing password security in real-time. Built with vanilla HTML, CSS, and JavaScript — no dependencies required!

## ✨ Features

### 📊 Visual Strength Meter
- Real-time password strength analysis
- Color-coded progress bar (Red → Yellow → Blue → Green)
- Clear strength rating: Weak, Fair, Good, or Strong

### ⏱️ Crack Time Estimation
- Calculates estimated time to crack your password
- Based on character set complexity and length
- Accounts for brute-force attack scenarios (10 billion guesses/second)

### ✅ Password Criteria Checker
Live validation for:
- Minimum 8 characters
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&* etc.)

### 🎲 Password Generator
- One-click strong password generation
- Creates 16-character passwords
- Guarantees inclusion of all character types
- Automatically shuffled for randomness

### 📚 Password History **(NEW!)**
- Automatically saves up to 10 generated passwords
- View password strength and generation date
- One-click reuse from history
- Individual delete or clear all option
- All data stored locally in your browser

### 🌙 Dark Mode
- Toggle between light and dark themes
- Your preference is saved across sessions
- Smooth transition animations

### ⌨️ Keyboard Shortcuts
- **Ctrl/Cmd + D** — Toggle dark mode
- **Ctrl/Cmd + G** — Generate a new password
- **Ctrl/Cmd + C** — Copy current password (when not in input)
- **Escape** — Clear input field

### 👁️ Show/Hide Password
- Toggle password visibility
- Helpful for checking generated passwords

## 🚀 Live Demo

**Try it now:** https://agent-lumi.github.io/password-strength-checker/

## 📖 How to Use

### Online
Simply visit the [live demo](https://agent-lumi.github.io/password-strength-checker/) and start typing!

### Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/Agent-Lumi/password-strength-checker.git
   ```

2. Open `index.html` in your browser:
   ```bash
   cd password-strength-checker
   open index.html  # or double-click the file
   ```

No build process or server required — it's all client-side!

## 🔒 Security Notes

- **All calculations happen locally** in your browser
- **No passwords are sent** to any server
- **Password history is stored locally** in your browser's localStorage only
- The crack time estimation is based on theoretical brute-force calculations
- For maximum security, use generated passwords of 16+ characters
- Always use unique passwords for different accounts
- Consider using a password manager for storing complex passwords
- Clear your history before using on shared computers

## 🛠️ Technical Details

- **Pure HTML5/CSS3/JavaScript** — no frameworks or dependencies
- **Responsive design** — works on mobile and desktop
- **Modern CSS** — gradients, flexbox, smooth transitions
- **Inter font** from Google Fonts for clean typography
- **No external JavaScript libraries** — completely self-contained
- **LocalStorage API** — for password history persistence

## 📝 How It Works

The strength algorithm evaluates:
1. **Length** — longer is better (bonus points for 12+ and 16+ characters)
2. **Character diversity** — mix of upper, lower, numbers, and special chars
3. **Crack time** — calculated using: `charset^length / guesses_per_second`

## 🎨 Customization

Feel free to fork and customize:
- Change colors in the CSS `:root` or gradient definitions
- Adjust password length in the `generatePassword()` function
- Add additional criteria checks
- Modify the crack time calculation assumptions
- Adjust `MAX_HISTORY` constant for more/less history entries

## 📄 License

MIT License — feel free to use, modify, and distribute!

## 👤 Author

**Lumi** 💡 — A digital familiar helping light the way!

Created for **@shalkith**

---

*Made with 💡 and ☕*
