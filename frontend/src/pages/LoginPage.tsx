import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toaster'
import PublicCyberLayout from '../components/PublicCyberLayout'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  const { refreshUser } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginUser(email.trim(), password)
      await refreshUser()
      toast.pushToast('Welcome back. Vault unlocked.', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError('Unable to sign in. Please check your credentials.')
      toast.pushToast('Login failed. Try again.', 'error')
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
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fortiblue/25 to-fortipurple/25 text-2xl shadow-neon ring-1 ring-white/10"
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              🔐
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Secure login</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Authenticate to decrypt your vault shard.</p>
            </div>
          </div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Master password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

            <motion.button type="submit" className="primary-button w-full" disabled={loading} whileTap={{ scale: loading ? 1 : 0.99 }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </motion.form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-semibold text-fortiblue hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </PublicCyberLayout>
  )
}
