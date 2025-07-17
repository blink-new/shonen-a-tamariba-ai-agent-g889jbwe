import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { AIChat } from '@/components/chat/AIChat'

import { MediaGeneration } from '@/components/features/MediaGeneration'
import { HistoryManager } from '@/components/features/HistoryManager'
import { SidePanel, FloatingPanelButton } from '@/components/features/SidePanel'
import { AgentBuilder } from '@/components/features/AgentBuilder'

import { Settings } from '@/components/features/Settings'
import { blink } from '@/blink/client'
import { Sparkles, Bot } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [sidePanelPosition, setSidePanelPosition] = useState<'left' | 'right'>('right')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <AIChat />
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} />

      case 'media-generation':
        return (
          <div className="p-6">
            <MediaGeneration />
          </div>
        )
      case 'history':
        return (
          <div className="p-6">
            <HistoryManager />
          </div>
        )
      case 'agent-builder':
        return (
          <div className="p-6">
            <AgentBuilder />
          </div>
        )

      case 'settings':
        return (
          <div className="p-6">
            <Settings />
          </div>
        )
      default:
        return <Dashboard onNavigate={handleTabChange} />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mx-auto mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            少年Aの分身
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            オリジナルAIエージェント・自動化アシスタント
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span>サインインしています...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex flex-1 flex-col md:ml-72">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {/* サイドパネル */}
      <SidePanel
        isOpen={sidePanelOpen}
        onToggle={() => setSidePanelOpen(!sidePanelOpen)}
        position={sidePanelPosition}
        onPositionChange={setSidePanelPosition}
      />

      {/* フローティングボタン */}
      <FloatingPanelButton
        onClick={() => setSidePanelOpen(!sidePanelOpen)}
        isOpen={sidePanelOpen}
      />
    </div>
  )
}

export default App