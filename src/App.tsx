import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import ToasterProvider from './components/Toaster'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import VaultPage from './pages/VaultPage'
import CheckerPage from './pages/CheckerPage'
import GeneratorPage from './pages/GeneratorPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('fortipass-theme')
    document.documentElement.classList.toggle('dark', saved !== 'light')
  }, [])

  return (
    <AuthProvider>
      <ToasterProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/checker" element={<CheckerPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <DashboardPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vault"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <VaultPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generator"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <GeneratorPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <SettingsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </ToasterProvider>
    </AuthProvider>
  )
}

export default App
