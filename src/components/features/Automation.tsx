import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Repeat,
  Zap,
  Settings,
  Plus,
  Trash2,
  Calendar,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AutomationTask {
  id: string
  name: string
  description: string
  type: 'scheduled' | 'trigger' | 'manual'
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
    time: string
    days?: string[]
  }
  trigger?: {
    event: string
    condition: string
  }
  actions: {
    id: string
    type: 'email' | 'api' | 'file' | 'notification' | 'ai'
    config: any
  }[]
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  status: 'idle' | 'running' | 'completed' | 'failed'
}

export function Automation() {
  const [tasks, setTasks] = useState<AutomationTask[]>([
    {
      id: '1',
      name: '日次レポート生成',
      description: '毎日午前9時にAIが日次レポートを生成してメール送信',
      type: 'scheduled',
      schedule: {
        frequency: 'daily',
        time: '09:00'
      },
      actions: [
        {
          id: '1',
          type: 'ai',
          config: { prompt: '昨日のデータを分析してレポートを生成' }
        },
        {
          id: '2',
          type: 'email',
          config: { to: 'user@example.com', subject: '日次レポート' }
        }
      ],
      isActive: true,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 60 * 60 * 1000),
      runCount: 15,
      status: 'idle'
    },
    {
      id: '2',
      name: 'ファイル整理',
      description: 'ダウンロードフォルダのファイルを自動分類',
      type: 'trigger',
      trigger: {
        event: 'file_added',
        condition: 'downloads_folder'
      },
      actions: [
        {
          id: '1',
          type: 'file',
          config: { action: 'organize', destination: 'categorized_folders' }
        }
      ],
      isActive: true,
      runCount: 42,
      status: 'idle'
    }
  ])

  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTask, setNewTask] = useState<Partial<AutomationTask>>({
    name: '',
    description: '',
    type: 'scheduled',
    schedule: {
      frequency: 'daily',
      time: '09:00'
    },
    actions: [],
    isActive: true
  })

  const runTask = async (task: AutomationTask) => {
    setTasks(prev => 
      prev.map(t => 
        t.id === task.id 
          ? { ...t, status: 'running' as const }
          : t
      )
    )

    // シミュレーション実行
    setTimeout(() => {
      setTasks(prev => 
        prev.map(t => 
          t.id === task.id 
            ? { 
                ...t, 
                status: 'completed' as const,
                lastRun: new Date(),
                runCount: t.runCount + 1
              }
            : t
        )
      )
    }, 3000)
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(t => 
        t.id === taskId 
          ? { ...t, isActive: !t.isActive }
          : t
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
  }

  const createTask = () => {
    if (!newTask.name || !newTask.description) return

    const task: AutomationTask = {
      id: Date.now().toString(),
      name: newTask.name,
      description: newTask.description,
      type: newTask.type || 'scheduled',
      schedule: newTask.schedule,
      trigger: newTask.trigger,
      actions: newTask.actions || [],
      isActive: newTask.isActive || true,
      runCount: 0,
      status: 'idle'
    }

    setTasks(prev => [...prev, task])
    setNewTask({
      name: '',
      description: '',
      type: 'scheduled',
      schedule: {
        frequency: 'daily',
        time: '09:00'
      },
      actions: [],
      isActive: true
    })
    setIsCreating(false)
  }

  const getStatusIcon = (status: AutomationTask['status']) => {
    switch (status) {
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getTypeIcon = (type: AutomationTask['type']) => {
    switch (type) {
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'trigger':
        return <Zap className="h-4 w-4 text-yellow-600" />
      default:
        return <Target className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">自動化・ワークフロー</h1>
                <p className="text-emerald-100 mt-1">
                  繰り返し作業を自動化
                </p>
              </div>
            </div>
            <p className="text-emerald-100 max-w-2xl">
              スケジュール実行やイベントトリガーで作業を自動化し、効率性を向上させます。
            </p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 soft-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">アクティブタスク</p>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.isActive).length}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 soft-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">今日の実行</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 soft-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">成功率</p>
                  <p className="text-3xl font-bold">98%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 soft-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">時間節約</p>
                  <p className="text-3xl font-bold">4.2h</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-1">
            <Card className="border-0 soft-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-emerald-600" />
                    自動化タスク
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setIsCreating(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    新規作成
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTask?.id === task.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(task.type)}
                        <h3 className="font-semibold text-slate-900">{task.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <Switch
                          checked={task.isActive}
                          onCheckedChange={() => toggleTask(task.id)}
                          size="sm"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>実行回数: {task.runCount}</span>
                      {task.nextRun && (
                        <span>次回: {task.nextRun.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Task Details/Creator */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <Card className="border-0 soft-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-600" />
                    新しい自動化タスクを作成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">基本設定</TabsTrigger>
                      <TabsTrigger value="trigger">トリガー設定</TabsTrigger>
                      <TabsTrigger value="actions">アクション設定</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="taskName">タスク名</Label>
                        <Input
                          id="taskName"
                          value={newTask.name}
                          onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="例: 日次レポート生成"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taskDescription">説明</Label>
                        <Textarea
                          id="taskDescription"
                          value={newTask.description}
                          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="このタスクの目的と動作を説明してください"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taskType">実行タイプ</Label>
                        <select
                          id="taskType"
                          value={newTask.type}
                          onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="scheduled">スケジュール実行</option>
                          <option value="trigger">イベントトリガー</option>
                          <option value="manual">手動実行</option>
                        </select>
                      </div>
                    </TabsContent>

                    <TabsContent value="trigger" className="space-y-4">
                      {newTask.type === 'scheduled' ? (
                        <>
                          <div className="space-y-2">
                            <Label>実行頻度</Label>
                            <select
                              value={newTask.schedule?.frequency}
                              onChange={(e) => setNewTask(prev => ({
                                ...prev,
                                schedule: { ...prev.schedule!, frequency: e.target.value as any }
                              }))}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="daily">毎日</option>
                              <option value="weekly">毎週</option>
                              <option value="monthly">毎月</option>
                              <option value="custom">カスタム</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>実行時刻</Label>
                            <Input
                              type="time"
                              value={newTask.schedule?.time}
                              onChange={(e) => setNewTask(prev => ({
                                ...prev,
                                schedule: { ...prev.schedule!, time: e.target.value }
                              }))}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label>トリガーイベント</Label>
                            <select
                              value={newTask.trigger?.event}
                              onChange={(e) => setNewTask(prev => ({
                                ...prev,
                                trigger: { ...prev.trigger!, event: e.target.value }
                              }))}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="file_added">ファイル追加</option>
                              <option value="email_received">メール受信</option>
                              <option value="api_call">API呼び出し</option>
                              <option value="time_based">時間ベース</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>条件</Label>
                            <Input
                              value={newTask.trigger?.condition}
                              onChange={(e) => setNewTask(prev => ({
                                ...prev,
                                trigger: { ...prev.trigger!, condition: e.target.value }
                              }))}
                              placeholder="トリガー条件を入力"
                            />
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="actions" className="space-y-4">
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          アクション設定
                        </h3>
                        <p className="text-slate-600">
                          実行するアクションを設定してください
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={createTask}
                      disabled={!newTask.name || !newTask.description}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      タスクを作成
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
            ) : selectedTask ? (
              <Card className="border-0 soft-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedTask.type)}
                      {selectedTask.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => runTask(selectedTask)}
                        disabled={selectedTask.status === 'running'}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        実行
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTask(selectedTask.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        削除
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">説明</h3>
                    <p className="text-slate-600">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">実行タイプ</h3>
                      <Badge variant="secondary">
                        {selectedTask.type === 'scheduled' ? 'スケジュール' :
                         selectedTask.type === 'trigger' ? 'トリガー' : '手動'}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">ステータス</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTask.status)}
                        <span className="text-sm">
                          {selectedTask.status === 'running' ? '実行中' :
                           selectedTask.status === 'completed' ? '完了' :
                           selectedTask.status === 'failed' ? '失敗' : '待機中'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedTask.schedule && (
                    <div>
                      <h3 className="font-semibold mb-2">スケジュール</h3>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm">
                          {selectedTask.schedule.frequency === 'daily' ? '毎日' :
                           selectedTask.schedule.frequency === 'weekly' ? '毎週' :
                           selectedTask.schedule.frequency === 'monthly' ? '毎月' : 'カスタム'} 
                          {selectedTask.schedule.time} に実行
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">実行統計</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900">{selectedTask.runCount}</p>
                        <p className="text-sm text-slate-600">総実行回数</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900">
                          {selectedTask.lastRun ? selectedTask.lastRun.toLocaleDateString('ja-JP') : '-'}
                        </p>
                        <p className="text-sm text-slate-600">最終実行</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-900">
                          {selectedTask.nextRun ? selectedTask.nextRun.toLocaleDateString('ja-JP') : '-'}
                        </p>
                        <p className="text-sm text-slate-600">次回実行</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 soft-shadow">
                <CardContent className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      タスクを選択してください
                    </h3>
                    <p className="text-slate-600">
                      左側のリストからタスクを選択するか、新しいタスクを作成してください。
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