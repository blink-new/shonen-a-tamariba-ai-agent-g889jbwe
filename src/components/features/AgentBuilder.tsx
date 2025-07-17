import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Sparkles, 
  Save, 
  Play, 
  Settings, 
  Brain, 
  MessageSquare,
  Code,
  Zap,
  Plus,
  Trash2,
  Copy
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Agent {
  id: string
  name: string
  description: string
  personality: string
  capabilities: string[]
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  isActive: boolean
  createdAt: Date
}

const predefinedCapabilities = [
  'テキスト生成',
  '画像解析',
  'コード生成',
  'データ分析',
  'ファイル処理',
  'ウェブ検索',
  '音声認識',
  '翻訳',
  '要約',
  'Q&A'
]

const modelOptions = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (高速)' },
  { value: 'gpt-4o', label: 'GPT-4o (バランス)' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (高品質)' }
]

export function AgentBuilder() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'コーディングアシスタント',
      description: 'プログラミングとコード生成を専門とするAIエージェント',
      personality: 'フレンドリーで技術的に正確',
      capabilities: ['コード生成', 'デバッグ', 'コードレビュー'],
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: 'あなたは経験豊富なプログラマーです。正確で効率的なコードを生成し、ベストプラクティスに従ってください。',
      isActive: true,
      createdAt: new Date()
    }
  ])

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    description: '',
    personality: '',
    capabilities: [],
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: '',
    isActive: true
  })

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.description) return

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      personality: newAgent.personality || '',
      capabilities: newAgent.capabilities || [],
      model: newAgent.model || 'gpt-4o-mini',
      temperature: newAgent.temperature || 0.7,
      maxTokens: newAgent.maxTokens || 1000,
      systemPrompt: newAgent.systemPrompt || '',
      isActive: newAgent.isActive || true,
      createdAt: new Date()
    }

    setAgents(prev => [...prev, agent])
    setNewAgent({
      name: '',
      description: '',
      personality: '',
      capabilities: [],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '',
      isActive: true
    })
    setIsCreating(false)
  }

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id))
    if (selectedAgent?.id === id) {
      setSelectedAgent(null)
    }
  }

  const handleToggleCapability = (capability: string) => {
    setNewAgent(prev => ({
      ...prev,
      capabilities: prev.capabilities?.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...(prev.capabilities || []), capability]
    }))
  }

  const testAgent = async (agent: Agent) => {
    try {
      const { text } = await blink.ai.generateText({
        prompt: 'こんにちは！自己紹介をしてください。',
        model: agent.model as any,
        maxTokens: agent.maxTokens,
        temperature: agent.temperature,
        messages: [
          {
            role: 'system',
            content: agent.systemPrompt
          }
        ]
      })
      
      alert(`エージェントのテスト結果:\n\n${text}`)
    } catch (error) {
      alert('エージェントのテストに失敗しました。')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">オリジナルエージェント作成</h1>
                <p className="text-yellow-100 mt-1">
                  あなただけのAIエージェントをカスタマイズ
                </p>
              </div>
            </div>
            <p className="text-yellow-100 max-w-2xl">
              専門的なタスクに特化したAIエージェントを作成し、独自の性格や能力を設定できます。
            </p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <Card className="border-0 soft-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-yellow-600" />
                    エージェント一覧
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setIsCreating(true)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    新規作成
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAgent?.id === agent.id
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                      <div className="flex items-center gap-1">
                        {agent.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAgent(agent.id)
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{agent.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 2).map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{agent.capabilities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Agent Details/Creator */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <Card className="border-0 soft-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    新しいエージェントを作成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">基本設定</TabsTrigger>
                      <TabsTrigger value="capabilities">機能設定</TabsTrigger>
                      <TabsTrigger value="advanced">詳細設定</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">エージェント名</Label>
                        <Input
                          id="name"
                          value={newAgent.name}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="例: マーケティングアシスタント"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">説明</Label>
                        <Textarea
                          id="description"
                          value={newAgent.description}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="このエージェントの役割と目的を説明してください"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personality">性格・トーン</Label>
                        <Input
                          id="personality"
                          value={newAgent.personality}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, personality: e.target.value }))}
                          placeholder="例: フレンドリーで専門的"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="capabilities" className="space-y-4">
                      <div className="space-y-2">
                        <Label>機能・能力</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {predefinedCapabilities.map((capability) => (
                            <div
                              key={capability}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                newAgent.capabilities?.includes(capability)
                                  ? 'border-yellow-500 bg-yellow-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => handleToggleCapability(capability)}
                            >
                              <span className="text-sm font-medium">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">AIモデル</Label>
                        <Select
                          value={newAgent.model}
                          onValueChange={(value) => setNewAgent(prev => ({ ...prev, model: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {modelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperature">創造性 (Temperature): {newAgent.temperature}</Label>
                        <input
                          type="range"
                          id="temperature"
                          min="0"
                          max="1"
                          step="0.1"
                          value={newAgent.temperature}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxTokens">最大トークン数</Label>
                        <Input
                          id="maxTokens"
                          type="number"
                          value={newAgent.maxTokens}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                          min="100"
                          max="4000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="systemPrompt">システムプロンプト</Label>
                        <Textarea
                          id="systemPrompt"
                          value={newAgent.systemPrompt}
                          onChange={(e) => setNewAgent(prev => ({ ...prev, systemPrompt: e.target.value }))}
                          placeholder="エージェントの行動指針を詳しく記述してください"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={newAgent.isActive}
                          onCheckedChange={(checked) => setNewAgent(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">作成後すぐに有効化</Label>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleCreateAgent}
                      disabled={!newAgent.name || !newAgent.description}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      エージェントを作成
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      キャンセル
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedAgent ? (
              <Card className="border-0 soft-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-yellow-600" />
                      {selectedAgent.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testAgent(selectedAgent)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        テスト
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        複製
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">説明</h3>
                    <p className="text-slate-600">{selectedAgent.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">性格・トーン</h3>
                    <p className="text-slate-600">{selectedAgent.personality || '設定なし'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">機能・能力</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capabilities.map((cap) => (
                        <Badge key={cap} variant="secondary">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">AIモデル</h3>
                      <p className="text-slate-600">{selectedAgent.model}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">創造性</h3>
                      <p className="text-slate-600">{selectedAgent.temperature}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">システムプロンプト</h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <code className="text-sm text-slate-700">
                        {selectedAgent.systemPrompt || '設定なし'}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedAgent.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                      <span className="text-sm text-slate-600">
                        {selectedAgent.isActive ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      作成日: {selectedAgent.createdAt.toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 soft-shadow">
                <CardContent className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      エージェントを選択してください
                    </h3>
                    <p className="text-slate-600">
                      左側のリストからエージェントを選択するか、新しいエージェントを作成してください。
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}