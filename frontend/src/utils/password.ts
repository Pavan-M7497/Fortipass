const weakPasswords = [
  '123456',
  'password',
  '12345678',
  'qwerty',
  'abc123',
  'letmein',
  'iloveyou',
  'monkey',
  'dragon',
]

const breachSamples = new Set(['password', '123456', 'qwerty', 'letmein', 'welcome', 'admin', 'trustno1'])

export function generatePassword(options: {
  length: number
  includeLower: boolean
  includeUpper: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}) {
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{};:<>?/|~'
  let chars = ''
  if (options.includeLower) chars += lower
  if (options.includeUpper) chars += upper
  if (options.includeNumbers) chars += numbers
  if (options.includeSymbols) chars += symbols
  if (!chars) chars = lower + upper + numbers

  const array = new Uint32Array(options.length)
  window.crypto.getRandomValues(array)
  return Array.from(array, (value) => chars[value % chars.length]).join('')
}

export function getEntropy(password: string) {
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[^A-Za-z0-9]/.test(password)) pool += 32
  if (pool === 0) return 0
  return Math.log2(pool ** password.length)
}

export function formatCrackTime(entropy: number) {
  const guessesPerSecond = 1e10
  const seconds = Math.pow(2, entropy) / guessesPerSecond
  if (seconds < 60) return `${Math.round(seconds)} sec`
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hr`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
  return `${Math.max(1, Math.round(seconds / 31536000))} yrs`
}

export function evaluatePassword(password: string) {
  const entropy = getEntropy(password)
  const isWeak = weakPasswords.includes(password.toLowerCase()) || password.length < 8
  const breach = checkBreach(password)
  const strength = Math.min(100, Math.max(0, Math.round((entropy / 48) * 100)))
  const label = strength < 30 ? 'Critical' : strength < 60 ? 'Weak' : strength < 85 ? 'Strong' : 'Excellent'
  const suggestions = []
  if (password.length < 12) suggestions.push('Use 12+ characters')
  if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters')
  if (!/[a-z]/.test(password)) suggestions.push('Add lowercase letters')
  if (!/[0-9]/.test(password)) suggestions.push('Include numbers')
  if (/[^A-Za-z0-9]/.test(password) === false) suggestions.push('Add symbols')

  return {
    entropy,
    strength,
    label,
    crackTime: formatCrackTime(entropy),
    suggestions: suggestions.slice(0, 3),
    isWeak,
    compromised: breach.compromised,
    breachCount: breach.count,
  }
}

export function checkBreach(password: string) {
  const normalized = password.toLowerCase()
  if (breachSamples.has(normalized)) {
    return { compromised: true, count: 8742 }
  }
  return { compromised: false, count: 0 }
}

export function getSecurityScore(items: Array<{ strength: number; compromised: boolean }>) {
  if (!items.length) return 0
  const base = items.reduce((sum, item) => sum + item.strength, 0) / items.length
  const penalty = items.filter((item) => item.compromised).length * 8
  return Math.max(12, Math.min(100, Math.round(base - penalty)))
}
