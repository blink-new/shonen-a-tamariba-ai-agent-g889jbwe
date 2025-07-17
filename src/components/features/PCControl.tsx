import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Monitor, 
  Mouse, 
  Keyboard, 
  Play, 
  Square, 
  RotateCcw,
  Eye,
  Camera,
  Zap,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface PCAction {
  id: string
  type: 'click' | 'type' | 'scroll' | 'screenshot' | 'wait' | 'custom'
  description: string
  target?: string
  value?: string
  delay?: number
  status: 'pending' | 'running' | 'completed' | 'failed'
}

interface AutomationScript {
  id: string
  name: string
  description: string
  actions: PCAction[]
  isRunning: boolean
  lastRun?: Date
}

export function PCControl() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  const [automationScripts, setAutomationScripts] = useState<AutomationScript[]>([
    {
      id: '1',
      name: 'ブラウザ自動化',
      description: 'ウェブサイトの自動操作とデータ収集',
      actions: [
        { id: '1', type: 'screenshot', description: '画面キャプチャを取得', status: 'pending' },
        { id: '2', type: 'click', description: '検索ボタンをクリック', target: '#search-btn', status: 'pending' },
        { id: '3', type: 'type', description: 'キーワードを入力', value: 'AI automation', status: 'pending' }
      ],
      isRunning: false
    }
  ])
  const [selectedScript, setSelectedScript] = useState<AutomationScript | null>(null)
  const [newAction, setNewAction] = useState<Partial<PCAction>>({
    type: 'click',
    description: '',
    target: '',
    value: '',
    delay: 1000
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const connectToPC = async () => {
    // シミュレーション: 実際の実装では Chrome Extension API を使用
    setIsConnected(true)
    setTimeout(() => {
      setCurrentAction('PC接続が確立されました')
    }, 1000)
  }

  const takeScreenshot = async () => {
    setCurrentAction('スクリーンショットを取得中...')
    
    // シミュレーション: 実際の実装では screen capture API を使用
    setTimeout(() => {
      setCurrentAction('スクリーンショットが取得されました')
      
      // Canvas に模擬スクリーンショットを描画
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // グラデーション背景
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, '#3B82F6')
          gradient.addColorStop(1, '#1E40AF')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // 模擬ウィンドウ
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100)
          
          // テキスト
          ctx.fillStyle = '#1F2937'
          ctx.font = '16px Arial'
          ctx.fillText('模擬デスクトップ画面', 70, 80)
          ctx.fillText('ブラウザウィンドウ', 70, 110)
          
          // 模擬ブラウザバー
          ctx.fillStyle = '#F3F4F6'
          ctx.fillRect(70, 120, canvas.width - 140, 30)
          ctx.fillStyle = '#6B7280'
          ctx.font = '12px Arial'
          ctx.fillText('https://example.com', 80, 140)
        }
      }
    }, 2000)
  }

  const executeAction = async (action: PCAction) => {
    setCurrentAction(`実行中: ${action.description}`)
    
    // アクションのステータスを更新
    if (selectedScript) {
      const updatedScript = {
        ...selectedScript,
        actions: selectedScript.actions.map(a => 
          a.id === action.id ? { ...a, status: 'running' as const } : a
        )
      }
      setSelectedScript(updatedScript)
      setAutomationScripts(prev => 
        prev.map(s => s.id === selectedScript.id ? updatedScript : s)
      )
    }

    // シミュレーション実行
    setTimeout(() => {
      setCurrentAction(`完了: ${action.description}`)
      
      if (selectedScript) {
        const updatedScript = {
          ...selectedScript,
          actions: selectedScript.actions.map(a => 
            a.id === action.id ? { ...a, status: 'completed' as const } : a
          )
        }
        setSelectedScript(updatedScript)
        setAutomationScripts(prev => 
          prev.map(s => s.id === selectedScript.id ? updatedScript : s)
        )
      }
    }, 2000)
  }

  const runScript = async (script: AutomationScript) => {
    setSelectedScript({ ...script, isRunning: true })
    setAutomationScripts(prev => 
      prev.map(s => s.id === script.id ? { ...s, isRunning: true } : s)
    )

    for (const action of script.actions) {
      await executeAction(action)
      await new Promise(resolve => setTimeout(resolve, action.delay || 1000))
    }

    const completedScript = {
      ...script,
      isRunning: false,
      lastRun: new Date(),
      actions: script.actions.map(a => ({ ...a, status: 'completed' as const }))
    }

    setSelectedScript(completedScript)
    setAutomationScripts(prev => 
      prev.map(s => s.id === script.id ? completedScript : s)
    )
  }

  const addAction = () => {
    if (!newAction.description || !selectedScript) return

    const action: PCAction = {
      id: Date.now().toString(),
      type: newAction.type || 'click',
      description: newAction.description,
      target: newAction.target,
      value: newAction.value,
      delay: newAction.delay || 1000,
      status: 'pending'
    }

    const updatedScript = {
      ...selectedScript,
      actions: [...selectedScript.actions, action]
    }

    setSelectedScript(updatedScript)
    setAutomationScripts(prev => 
      prev.map(s => s.id === selectedScript.id ? updatedScript : s)
    )

    setNewAction({
      type: 'click',
      description: '',
      target: '',
      value: '',
      delay: 1000
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">PC操作・自動化</h1>
                <p className="text-blue-100 mt-1">
                  パソコンを遠隔操作・自動化
                </p>
              </div>
            </div>
            <p className="text-blue-100 max-w-2xl">
              Chrome拡張機能を通じてパソコンの操作を自動化し、繰り返し作業を効率化します。
            </p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        {/* Connection Status */}
        <Card className="border-0 soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              接続ステータス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {isConnected ? 'PC接続済み' : 'PC未接続'}
                </span>
                {isConnected && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Chrome Extension
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!isConnected ? (
                  <Button onClick={connectToPC} className="bg-blue-600 hover:bg-blue-700">
                    <Monitor className="h-4 w-4 mr-2" />
                    PC接続
                  </Button>
                ) : (
                  <Button onClick={takeScreenshot} variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    スクリーンショット
                  </Button>
                )}
              </div>
            </div>
            {currentAction && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{currentAction}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Screen */}
          <Card className="border-0 soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                ライブ画面
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Mouse className="h-4 w-4 mr-1" />
                  マウス操作
                </Button>
                <Button size="sm" variant="outline">
                  <Keyboard className="h-4 w-4 mr-1" />
                  キーボード入力
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Automation Scripts */}
          <Card className="border-0 soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                自動化スクリプト
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationScripts.map((script) => (
                <div
                  key={script.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedScript?.id === script.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedScript(script)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{script.name}</h3>
                    <div className="flex items-center gap-2">
                      {script.isRunning && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          runScript(script)
                        }}
                        disabled={script.isRunning || !isConnected}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        実行
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{script.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{script.actions.length} アクション</span>
                    {script.lastRun && (
                      <span>最終実行: {script.lastRun.toLocaleString('ja-JP')}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Script Details */}
        {selectedScript && (
          <Card className="border-0 soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                {selectedScript.name} - アクション詳細
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="actions" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="actions">アクション一覧</TabsTrigger>
                  <TabsTrigger value="add">アクション追加</TabsTrigger>
                </TabsList>

                <TabsContent value="actions" className="space-y-4">
                  {selectedScript.actions.map((action, index) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{action.type}</Badge>
                          <span className="font-medium">{action.description}</span>
                        </div>
                        {action.target && (
                          <p className="text-sm text-slate-600">対象: {action.target}</p>
                        )}
                        {action.value && (
                          <p className="text-sm text-slate-600">値: {action.value}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {action.status === 'pending' && (
                          <Clock className="h-4 w-4 text-slate-400" />
                        )}
                        {action.status === 'running' && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {action.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {action.status === 'failed' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="add" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>アクションタイプ</Label>
                      <select
                        value={newAction.type}
                        onChange={(e) => setNewAction(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="click">クリック</option>
                        <option value="type">テキスト入力</option>
                        <option value="scroll">スクロール</option>
                        <option value="screenshot">スクリーンショット</option>
                        <option value="wait">待機</option>
                        <option value="custom">カスタム</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>待機時間 (ms)</Label>
                      <Input
                        type="number"
                        value={newAction.delay}
                        onChange={(e) => setNewAction(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>説明</Label>
                    <Input
                      value={newAction.description}
                      onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="アクションの説明を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>対象 (CSS セレクタ)</Label>
                    <Input
                      value={newAction.target}
                      onChange={(e) => setNewAction(prev => ({ ...prev, target: e.target.value }))}
                      placeholder="#button-id, .class-name, など"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>値 (入力テキストなど)</Label>
                    <Input
                      value={newAction.value}
                      onChange={(e) => setNewAction(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="入力する値"
                    />
                  </div>
                  <Button
                    onClick={addAction}
                    disabled={!newAction.description}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    アクションを追加
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Warning */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">重要な注意事項</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• PC操作機能を使用するには専用のChrome拡張機能のインストールが必要です</li>
                  <li>• 自動化スクリプトは慎重に設定し、テスト環境で十分に検証してください</li>
                  <li>• 重要なデータの操作前には必ずバックアップを取ってください</li>
                  <li>• 他人のコンピューターを操作する際は適切な許可を得てください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}