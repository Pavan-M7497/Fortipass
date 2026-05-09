import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerUser } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toaster'
import { evaluatePassword } from '../utils/password'
import PublicCyberLayout from '../components/PublicCyberLayout'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

export default function SignupPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { refreshUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const result = evaluatePassword(value)
    setStrength(result.strength)
    setLabel(result.label)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await registerUser(email.trim(), password, name.trim() || 'FortiPass User')
      await refreshUser()
      toast.pushToast('Account created successfully.', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError('Unable to create account. Please verify your details.')
      toast.pushToast('Signup failed. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicCyberLayout>
      <div className="min-h-screen px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl card-cyber p-8 sm:p-10"
        >
          <div className="mb-10 flex flex-col gap-4 text-center">
            <motion.div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fortipurple/25 to-fortiblue/25 text-2xl shadow-neon ring-1 ring-white/10"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              🔐
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Initialize FortiPass</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Provision your neural vault with a hardened master key.</p>
            </div>
          </div>

          <motion.form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Master password</label>
                {label ? <span className="font-mono text-xs text-fortiblue">{label}</span> : null}
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => handlePasswordChange(event.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full"
              />
              <PasswordStrengthMeter strength={strength} label={label || undefined} compact />
            </div>

            {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

            <motion.button type="submit" className="primary-button relative w-full" disabled={loading} whileTap={{ scale: loading ? 1 : 0.99 }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Provisioning…
                </span>
              ) : (
                'Create account'
              )}
            </motion.button>
          </motion.form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-fortiblue hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PublicCyberLayout>
  )
}
