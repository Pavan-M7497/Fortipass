import { FormEvent, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toaster'
import { createVaultItem, deleteVaultItem, subscribeVault, updateVaultItem } from '../services/vault'
import { evaluatePassword } from '../utils/password'

const initialFormState = {
  id: '',
  website: '',
  username: '',
  password: '',
  notes: '',
}

export default function VaultPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [items, setItems] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'weak' | 'strong'>('all')
  const [form, setForm] = useState(initialFormState)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return undefined
    return subscribeVault(user.uid, setItems)
  }, [user])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = [item.website, item.username].some((value: string) =>
        value.toLowerCase().includes(query.toLowerCase()),
      )
      const matchesFilter =
        filter === 'all' || (filter === 'weak' && item.strength < 60) || (filter === 'strong' && item.strength >= 85)
      return matchesSearch && matchesFilter
    })
  }, [items, query, filter])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    const analysis = evaluatePassword(form.password)
    const payload = {
      website: form.website,
      username: form.username,
      password: form.password,
      notes: form.notes,
      compromised: analysis.compromised,
      strength: analysis.strength,
    }

    try {
      if (isEditing && form.id) {
        await updateVaultItem(user.uid, form.id, payload)
        toast.pushToast('Credential updated.', 'success')
      } else {
        await createVaultItem(user.uid, payload)
        toast.pushToast('Credential added to vault.', 'success')
      }
      setForm(initialFormState)
      setIsEditing(false)
      setShowPasswordId(null)
    } catch (error) {
      toast.pushToast('Unable to save credential.', 'error')
    }
  }

  const handleEdit = (item: any) => {
    setForm({
      id: item.id,
      website: item.website,
      username: item.username,
      password: item.password,
      notes: item.notes,
    })
    setIsEditing(true)
    setShowPasswordId(item.id)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Delete this credential from your vault?')) return
    await deleteVaultItem(itemId)
    toast.pushToast('Credential deleted.', 'info')
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-fortiblue">Password vault</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Encrypted credential mesh</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Store, classify, and analyze secrets with inline strength telemetry—encrypted before leaving your session.
        </p>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.section layout className="card-cyber p-6 sm:p-8" whileHover={{ y: -1 }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add credential</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Payloads are encrypted client-side before persistence.</p>
            </div>
            {isEditing ? (
              <motion.button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setForm(initialFormState)
                  setIsEditing(false)
                  setShowPasswordId(null)
                }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel edit
              </motion.button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Website / App</span>
                <input
                  value={form.website}
                  onChange={(event) => setForm({ ...form, website: event.target.value })}
                  placeholder="Example: fortress.com"
                  required
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Username / Email</span>
                <input
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  placeholder="user@domain.com"
                  required
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter secure password"
                  required
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span>Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Add context for this credential"
                  rows={4}
                />
              </label>
            </div>

            <motion.button type="submit" className="primary-button w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              {isEditing ? 'Update credential' : 'Save credential'}
            </motion.button>
          </form>
        </motion.section>

        <motion.section layout className="card-cyber p-6 sm:p-8" whileHover={{ y: -1 }}>
          <div className="flex flex-wrap items-center gap-3 sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vault search</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Filter entries by posture and metadata.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search website or username"
              className="w-full"
            />
            <div className="flex flex-wrap gap-3">
              {(['all', 'weak', 'strong'] as const).map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  className={`secondary-button ${filter === option ? 'border-fortiblue bg-fortiblue/10 text-fortiblue dark:text-cyber-cyan' : ''}`}
                  onClick={() => setFilter(option)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option === 'all' ? 'All' : option === 'weak' ? 'Weak' : 'Strong'}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      <motion.div layout className="card-cyber p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vault entries</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {filteredItems.length} credential{filteredItems.length === 1 ? '' : 's'} in view
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredItems.length ? (
            filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group rounded-2xl border border-slate-200/80 bg-white/55 p-6 transition-all hover:border-fortiblue/25 hover:shadow-[0_0_32px_rgba(64,183,255,0.08)] dark:border-white/10 dark:bg-slate-950/50"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{item.website}</p>
                    <p className="mt-1 font-mono text-sm text-slate-600 dark:text-slate-400">{item.username}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-fortiblue/10 px-3 py-1 font-mono text-fortiblue dark:text-cyber-cyan">STR {item.strength}</span>
                    {item.compromised ? (
                      <span className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-700 dark:text-rose-300">Compromised</span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
                    <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                      <span className="text-sm font-medium">Password</span>
                      <button type="button" className="text-sm font-semibold text-fortiblue" onClick={() => setShowPasswordId(showPasswordId === item.id ? null : item.id)}>
                        {showPasswordId === item.id ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <p className="mt-3 font-mono text-sm text-slate-900 dark:text-slate-100">
                      {showPasswordId === item.id ? item.password : '••••••••••••••'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <motion.button type="button" className="secondary-button" onClick={() => handleEdit(item)} whileTap={{ scale: 0.98 }}>
                      Edit
                    </motion.button>
                    <motion.button type="button" className="secondary-button" onClick={() => handleDelete(item.id)} whileTap={{ scale: 0.98 }}>
                      Delete
                    </motion.button>
                  </div>
                </div>
                {item.notes ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{item.notes}</p> : null}
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300/90 p-14 text-center text-slate-600 dark:border-white/15 dark:text-slate-400">
              No credentials match the search or filter. Add one to begin monitoring.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
