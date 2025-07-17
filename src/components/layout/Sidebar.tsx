import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  Users, 
  Lightbulb,
  TrendingUp,
  FileText,
  Calculator,
  X,
  Crown,
  Monitor,
  Mic,
  Image,
  History
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    id: 'chat',
    label: 'AIチャット',
    icon: MessageSquare,
    badge: 'ChatGPT',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    activeBg: 'bg-indigo-100'
  },
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: BarChart3,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    activeBg: 'bg-emerald-100'
  },
  {
    id: 'screen-capture',
    label: '画面キャプチャ',
    icon: Monitor,
    badge: 'AI分析',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    activeBg: 'bg-cyan-100'
  },
  {
    id: 'voice-control',
    label: '音声コントロール',
    icon: Mic,
    badge: 'New',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    activeBg: 'bg-purple-100'
  },
  {
    id: 'media-generation',
    label: 'メディア生成',
    icon: Image,
    badge: 'AI',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    activeBg: 'bg-rose-100'
  },
  {
    id: 'history',
    label: '履歴管理',
    icon: History,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    activeBg: 'bg-slate-100'
  },
  {
    id: 'agent-builder',
    label: 'エージェント作成',
    icon: Lightbulb,
    badge: 'Custom',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    activeBg: 'bg-yellow-100'
  },

  {
    id: 'settings',
    label: '設定',
    icon: Users,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    activeBg: 'bg-slate-100'
  }
]

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 transform border-r border-slate-200/60 bg-white/80 backdrop-blur-xl transition-transform duration-300 ease-out md:relative md:top-0 md:h-screen md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-6 md:hidden">
            <h2 className="text-lg font-semibold text-slate-900">メニュー</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 px-4 rounded-xl font-medium transition-all duration-200",
                    isActive 
                      ? `${item.activeBg} ${item.color} shadow-sm` 
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                  onClick={() => {
                    onTabChange(item.id)
                    onClose()
                  }}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive ? "bg-white shadow-sm" : item.bgColor
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? item.color : "text-slate-600"
                    )} />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto text-xs bg-indigo-100 text-indigo-700 border-0 font-medium"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200/60 p-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-4 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4" />
                  <p className="font-semibold">Pro版にアップグレード</p>
                </div>
                <p className="text-xs text-indigo-100 mb-3 leading-relaxed">
                  より高度なAI機能と無制限のアクセスを利用
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-medium shadow-sm"
                >
                  アップグレード
                </Button>
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}