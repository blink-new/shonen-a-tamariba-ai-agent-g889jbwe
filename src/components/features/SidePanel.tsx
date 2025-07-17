import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PanelRight, 
  PanelLeft,
  X,
  Pin,
  PinOff,
  Settings,

  MessageSquare,
  Image,
  History,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { MediaGeneration } from './MediaGeneration'
import { HistoryManager } from './HistoryManager'
import { AIChat } from '../chat/AIChat'

interface SidePanelProps {
  isOpen: boolean
  onToggle: () => void
  position: 'left' | 'right'
  onPositionChange: (position: 'left' | 'right') => void
}

export function SidePanel({ isOpen, onToggle, position, onPositionChange }: SidePanelProps) {
  const [isPinned, setIsPinned] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [autoHide, setAutoHide] = useState(true)
  const [opacity, setOpacity] = useState(0.95)

  useEffect(() => {
    const handleMouseLeave = () => {
      if (autoHide && !isPinned && isOpen) {
        setTimeout(() => {
          if (!document.querySelector('.side-panel:hover')) {
            onToggle()
          }
        }, 1000)
      }
    }

    const panel = document.querySelector('.side-panel')
    if (panel) {
      panel.addEventListener('mouseleave', handleMouseLeave)
      return () => panel.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [autoHide, isPinned, isOpen, onToggle])

  const handleCommand = (command: string) => {
    if (command.startsWith('ai-query:')) {
      setActiveTab('chat')
      // AIチャットに質問を送信する処理
    } else {
      switch (command) {
        case 'chat':
          setActiveTab('chat')
          break
        case 'dashboard':
          // ダッシュボードに移動する処理
          break
      }
    }
  }

  const togglePosition = () => {
    onPositionChange(position === 'left' ? 'right' : 'left')
  }

  const resetPanel = () => {
    setIsPinned(false)
    setIsMinimized(false)
    setAutoHide(true)
    setOpacity(0.95)
    onPositionChange('right')
  }

  if (!isOpen) return null

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && !isPinned && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* サイドパネル */}
      <div
        className={cn(
          "side-panel fixed top-0 z-50 h-screen bg-white/95 backdrop-blur-xl border shadow-2xl transition-all duration-300 ease-out",
          position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          isMinimized ? 'w-16' : 'w-96',
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
        )}
        style={{ opacity }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-white/80">
          {!isMinimized && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <PanelRight className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-900">少年Aの分身</h2>
              <Badge variant="secondary" className="text-xs">
                サイドパネル
              </Badge>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <Button
                  onClick={togglePosition}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="位置を変更"
                >
                  {position === 'left' ? (
                    <PanelRight className="h-4 w-4" />
                  ) : (
                    <PanelLeft className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  onClick={() => setIsPinned(!isPinned)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title={isPinned ? "ピン解除" : "ピン留め"}
                >
                  {isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
            
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title={isMinimized ? "展開" : "最小化"}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={onToggle}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="閉じる"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 最小化時のクイックアクション */}
        {isMinimized && (
          <div className="p-2 space-y-2">
            <Button
              onClick={() => {
                setActiveTab('chat')
                setIsMinimized(false)
              }}
              variant="ghost"
              size="icon"
              className="w-full h-12"
              title="AIチャット"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => {
                setActiveTab('media')
                setIsMinimized(false)
              }}
              variant="ghost"
              size="icon"
              className="w-full h-12"
              title="メディア生成"
            >
              <Image className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* メインコンテンツ */}
        {!isMinimized && (
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-4 mb-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs">
                  <Image className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs">
                  <History className="h-3 w-3" />
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent value="chat" className="mt-0 h-full">
                  <div className="h-full">
                    <AIChat />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="mt-0">
                  <MediaGeneration />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <HistoryManager />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {/* 設定パネル */}
        {!isMinimized && (
          <div className="border-t p-4 bg-slate-50/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">自動非表示</span>
                <Switch
                  checked={autoHide}
                  onCheckedChange={setAutoHide}
                  size="sm"
                />
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">透明度</span>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <Button
                onClick={resetPanel}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                設定リセット
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// フローティングボタンコンポーネント
export function FloatingPanelButton({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed top-1/2 right-4 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-70",
        isOpen && "bg-destructive hover:bg-destructive/90"
      )}
      size="icon"
      title={isOpen ? "パネルを閉じる" : "少年Aの分身を開く"}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <PanelRight className="h-5 w-5" />
      )}
    </Button>
  )
}