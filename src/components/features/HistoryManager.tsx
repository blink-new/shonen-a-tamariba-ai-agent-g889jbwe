import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  History, 
  Search, 
  Trash2, 
  Download,
  Filter,
  Calendar,
  MessageSquare,
  Image,
  Monitor,
  Mic,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { blink } from '@/blink/client'

interface HistoryItem {
  id: string
  type: 'chat' | 'screen-capture' | 'voice' | 'media-generation'
  title: string
  content: string
  timestamp: Date
  metadata?: any
}

interface HistorySettings {
  enabled: boolean
  autoDelete: boolean
  retentionDays: number
  categories: {
    chat: boolean
    screenCapture: boolean
    voice: boolean
    mediaGeneration: boolean
  }
}

export function HistoryManager() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [settings, setSettings] = useState<HistorySettings>({
    enabled: true,
    autoDelete: false,
    retentionDays: 30,
    categories: {
      chat: true,
      screenCapture: true,
      voice: true,
      mediaGeneration: true
    }
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadHistory()
    loadSettings()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const savedHistory = localStorage.getItem('app-history')
      if (savedHistory) {
        const historyData = JSON.parse(savedHistory)
        const formattedHistory: HistoryItem[] = historyData.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setHistory(formattedHistory)
      }
    } catch (error) {
      console.error('履歴の読み込みに失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('history-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const saveSettings = (newSettings: HistorySettings) => {
    setSettings(newSettings)
    localStorage.setItem('history-settings', JSON.stringify(newSettings))
  }

  const addHistoryItem = async (item: Omit<HistoryItem, 'id'>) => {
    if (!settings.enabled) return
    if (!settings.categories[item.type]) return

    try {
      const formattedItem: HistoryItem = {
        id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.type,
        title: item.title,
        content: item.content,
        timestamp: new Date(),
        metadata: item.metadata
      }
      
      const updatedHistory = [formattedItem, ...history]
      setHistory(updatedHistory)
      localStorage.setItem('app-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('履歴の保存に失敗しました:', error)
    }
  }

  const deleteHistoryItem = async (id: string) => {
    try {
      const updatedHistory = history.filter(item => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem('app-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('履歴の削除に失敗しました:', error)
    }
  }

  const clearAllHistory = async () => {
    try {
      setHistory([])
      localStorage.removeItem('app-history')
    } catch (error) {
      console.error('履歴の全削除に失敗しました:', error)
    }
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `history-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return MessageSquare
      case 'screen-capture': return Monitor
      case 'voice': return Mic
      case 'media-generation': return Image
      default: return History
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'chat': return 'チャット'
      case 'screen-capture': return '画面キャプチャ'
      case 'voice': return '音声'
      case 'media-generation': return 'メディア生成'
      default: return '不明'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'chat': return 'bg-indigo-100 text-indigo-700'
      case 'screen-capture': return 'bg-emerald-100 text-emerald-700'
      case 'voice': return 'bg-purple-100 text-purple-700'
      case 'media-generation': return 'bg-rose-100 text-rose-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              <History className="h-5 w-5 text-slate-600" />
            </div>
            履歴管理
            <Badge variant="secondary" className="ml-auto">
              {history.length}件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">履歴</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>

            {/* 履歴タブ */}
            <TabsContent value="history" className="space-y-4">
              {/* 検索・フィルター */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="履歴を検索..."
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">すべて</option>
                  <option value="chat">チャット</option>
                  <option value="screen-capture">画面キャプチャ</option>
                  <option value="voice">音声</option>
                  <option value="media-generation">メディア生成</option>
                </select>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button onClick={exportHistory} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  エクスポート
                </Button>
                <Button onClick={clearAllHistory} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  全削除
                </Button>
              </div>

              {/* 履歴リスト */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin mx-auto mb-2">
                      <Settings className="h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground">読み込み中...</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">履歴がありません</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const Icon = getTypeIcon(item.type)
                    return (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <Icon className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                <Badge className={`text-xs ${getTypeBadgeColor(item.type)}`}>
                                  {getTypeLabel(item.type)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {item.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {item.timestamp.toLocaleString('ja-JP')}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteHistoryItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>

            {/* 設定タブ */}
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-6">
                {/* 基本設定 */}
                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    基本設定
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.enabled ? (
                          <Eye className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="font-medium">履歴保存</span>
                      </div>
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(enabled) => 
                          saveSettings({ ...settings, enabled })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-slate-600" />
                        <span className="font-medium">自動削除</span>
                      </div>
                      <Switch
                        checked={settings.autoDelete}
                        onCheckedChange={(autoDelete) => 
                          saveSettings({ ...settings, autoDelete })
                        }
                      />
                    </div>
                    
                    {settings.autoDelete && (
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">保存期間</label>
                        <Input
                          type="number"
                          value={settings.retentionDays}
                          onChange={(e) => 
                            saveSettings({ 
                              ...settings, 
                              retentionDays: parseInt(e.target.value) || 30 
                            })
                          }
                          className="w-20"
                          min="1"
                          max="365"
                        />
                        <span className="text-sm text-muted-foreground">日</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* カテゴリ設定 */}
                <Card className="p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    保存カテゴリ
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(settings.categories).map(([key, enabled]) => {
                      const Icon = getTypeIcon(key)
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-600" />
                            <span className="font-medium">{getTypeLabel(key)}</span>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => 
                              saveSettings({
                                ...settings,
                                categories: {
                                  ...settings.categories,
                                  [key]: checked
                                }
                              })
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

