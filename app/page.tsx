'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Lock, Wallet, LogIn, LogOut, User, X, Home, List } from 'lucide-react'
import PasswordModal from './components/PasswordModal'
import PasswordMenuModal from './components/PasswordMenuModal'
import PasswordListModal from './components/PasswordListModal'
import BudgetModal from './components/BudgetModal'
import BudgetMenuModal from './components/BudgetMenuModal'
import BudgetViewModal from './components/BudgetViewModal'
import RecurringModal from './components/RecurringModal'
import RecurringListModal from './components/RecurringListModal'
import BudgetLimitModal from './components/BudgetLimitModal'
import BudgetLimitsViewModal from './components/BudgetLimitsViewModal'
import AuthModal from './components/AuthModal'
import { usePasswords } from './hooks/usePasswords'
import { useBudget } from './hooks/useBudget'
import { useRecurring } from './hooks/useRecurring'
import { useBudgetLimits } from './hooks/useBudgetLimits'
import { supabase } from '@/lib/supabase'
import { initConsoleGuard } from '@/lib/console-guard'

export default function MobileHome() {
  // Modals state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPasswordMenuOpen, setIsPasswordMenuOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isListModalOpen, setIsListModalOpen] = useState(false)
  const [isBudgetMenuModalOpen, setIsBudgetMenuModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isBudgetViewModalOpen, setIsBudgetViewModalOpen] = useState(false)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  const [isRecurringListModalOpen, setIsRecurringListModalOpen] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [isLimitsViewModalOpen, setIsLimitsViewModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'passwords' | 'budget'>('home')
  
  // User state
  const [userProfile, setUserProfile] = useState<any>(null)
  const [consoleGuard, setConsoleGuard] = useState<any>(null)
  
  // Hooks
  const { passwords, addPassword, user, deletePassword } = usePasswords()
  const { transactions, addTransaction, deleteTransaction, getStats } = useBudget()
  const { recurring, addRecurring, deleteRecurring, toggleActive } = useRecurring()
  const { limits, limitsStatus, addLimit, deleteLimit, toggleActive: toggleLimitActive } = useBudgetLimits()

  // Initialize console guard
  useEffect(() => {
    const guard = initConsoleGuard()
    setConsoleGuard(guard)
  }, [])

  useEffect(() => {
    if (consoleGuard) {
      if (!user) {
        consoleGuard.blockConsole()
      } else {
        consoleGuard.unblockConsole()
      }
    }
  }, [user, consoleGuard])

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setUserProfile(data)
        }
      } else {
        setUserProfile(null)
      }
    }
    loadProfile()
  }, [user])

  const handleSavePassword = (data: any) => {
    addPassword(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
  }

  // Get stats
  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">AK Suite</h1>
              <p className="text-purple-300 text-xs">Mobile</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 bg-purple-500/20 rounded-lg text-purple-300 hover:bg-purple-500/30"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white font-medium text-sm"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-900/95 border-t border-purple-500/20"
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{userProfile?.full_name || 'User'}</p>
                    <p className="text-purple-300 text-xs">{user.email}</p>
                  </div>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full p-3 bg-red-500/20 rounded-lg text-red-300 font-medium text-sm hover:bg-red-500/30 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        {!user ? (
          // Not logged in - show welcome
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Benvenuto</h2>
            <p className="text-purple-300 mb-8 max-w-sm">
              Accedi per gestire le tue password e il bilancio familiare in totale sicurezza
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-500/50"
            >
              Inizia Ora
            </motion.button>
          </div>
        ) : (
          // Logged in - show content based on active tab
          <div className="space-y-4">
            {activeTab === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm p-4 rounded-2xl border border-purple-500/20">
                    <Lock className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-purple-200 text-xs mb-1">Password</p>
                    <p className="text-white text-2xl font-bold">{passwords.length}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-sm p-4 rounded-2xl border border-cyan-500/20">
                    <Wallet className="w-6 h-6 text-cyan-400 mb-2" />
                    <p className="text-cyan-200 text-xs mb-1">Transazioni</p>
                    <p className="text-white text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>

                {/* Budget Summary */}
                {stats && (
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      Riepilogo Mese
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm">Entrate</span>
                        <span className="text-white font-bold">€{stats.totalIncome.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-400 text-sm">Uscite</span>
                        <span className="text-white font-bold">€{stats.totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-purple-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300 font-medium">Saldo</span>
                          <span className={`font-bold text-lg ${stats.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{stats.balance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'passwords' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Password</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPasswordMenuOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium text-sm"
                  >
                    Gestisci
                  </motion.button>
                </div>

                {passwords.length === 0 ? (
                  <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-purple-500/20">
                    <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-purple-300">Nessuna password salvata</p>
                    <p className="text-purple-400 text-sm mt-2">Inizia ad aggiungerne una!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {passwords.slice(0, 5).map((pwd) => (
                      <motion.div
                        key={pwd.id}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{pwd.emoji}</span>
                            <div>
                              <p className="text-white font-medium">{pwd.title}</p>
                              <p className="text-purple-300 text-sm">{pwd.username}</p>
                            </div>
                          </div>
                          <div className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                            {pwd.category}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {passwords.length > 5 && (
                      <p className="text-center text-purple-400 text-sm">
                        +{passwords.length - 5} altre password
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'budget' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Bilancio</h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBudgetMenuModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-medium text-sm"
                  >
                    Gestisci
                  </motion.button>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-cyan-500/20">
                    <Wallet className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <p className="text-cyan-300">Nessuna transazione</p>
                    <p className="text-cyan-400 text-sm mt-2">Inizia a tracciare le tue finanze!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 8).map((txn) => (
                      <motion.div
                        key={txn.id}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{txn.emoji}</span>
                            <div>
                              <p className="text-white font-medium">{txn.description}</p>
                              <p className="text-cyan-300 text-xs">{txn.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                              {txn.type === 'income' ? '+' : '-'}€{txn.amount.toFixed(2)}
                            </p>
                            <p className="text-purple-400 text-xs">
                              {new Date(txn.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {transactions.length > 8 && (
                      <p className="text-center text-cyan-400 text-sm">
                        +{transactions.length - 8} altre transazioni
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20 z-40">
          <div className="grid grid-cols-3 gap-1 p-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('home')}
              className={`p-3 rounded-xl transition-colors ${
                activeTab === 'home'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <Home className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium block">Home</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('passwords')}
              className={`p-3 rounded-xl transition-colors ${
                activeTab === 'passwords'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <Lock className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium block">Password</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('budget')}
              className={`p-3 rounded-xl transition-colors ${
                activeTab === 'budget'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <Wallet className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium block">Bilancio</span>
            </motion.button>
          </div>
        </nav>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PasswordMenuModal
        isOpen={isPasswordMenuOpen}
        onClose={() => setIsPasswordMenuOpen(false)}
        onSelectNew={() => {
          setIsPasswordMenuOpen(false)
          setIsPasswordModalOpen(true)
        }}
        onSelectList={() => {
          setIsPasswordMenuOpen(false)
          setIsListModalOpen(true)
        }}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
      />

      <PasswordListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        passwords={passwords}
        onDelete={deletePassword}
      />

      <BudgetMenuModal
        isOpen={isBudgetMenuModalOpen}
        onClose={() => setIsBudgetMenuModalOpen(false)}
        onSelectNew={() => {
          setIsBudgetMenuModalOpen(false)
          setIsBudgetModalOpen(true)
        }}
        onSelectView={() => {
          setIsBudgetMenuModalOpen(false)
          setIsBudgetViewModalOpen(true)
        }}
        onSelectRecurring={() => {
          setIsBudgetMenuModalOpen(false)
          setIsRecurringModalOpen(true)
        }}
        onSelectRecurringList={() => {
          setIsBudgetMenuModalOpen(false)
          setIsRecurringListModalOpen(true)
        }}
        onSelectLimit={() => {
          setIsBudgetMenuModalOpen(false)
          setIsLimitModalOpen(true)
        }}
        onSelectLimitsList={() => {
          setIsBudgetMenuModalOpen(false)
          setIsLimitsViewModalOpen(true)
        }}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={addTransaction}
      />

      <BudgetViewModal
        isOpen={isBudgetViewModalOpen}
        onClose={() => setIsBudgetViewModalOpen(false)}
        transactions={transactions}
        onDelete={deleteTransaction}
      />

      <RecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onSave={addRecurring}
      />

      <RecurringListModal
        isOpen={isRecurringListModalOpen}
        onClose={() => setIsRecurringListModalOpen(false)}
        recurring={recurring}
        onDelete={deleteRecurring}
        onToggleActive={toggleActive}
      />

      <BudgetLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        onSave={addLimit}
        existingCategories={limits.map(l => l.category)}
      />

      <BudgetLimitsViewModal
        isOpen={isLimitsViewModalOpen}
        onClose={() => setIsLimitsViewModalOpen(false)}
        limits={limitsStatus}
        onToggleActive={toggleLimitActive}
        onDelete={deleteLimit}
      />
    </div>
  )
}
