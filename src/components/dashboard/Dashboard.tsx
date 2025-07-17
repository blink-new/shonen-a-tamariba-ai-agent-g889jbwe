import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Lightbulb,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Users,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react'

const stats = [
  {
    title: 'AI相談回数',
    value: '24',
    change: '+12%',
    icon: MessageSquare,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    trend: 'up'
  },
  {
    title: 'エージェント数',
    value: '5',
    change: '+2',
    icon: Lightbulb,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    trend: 'up'
  },
  {
    title: '自動化タスク',
    value: '12',
    change: '+3',
    icon: Target,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    trend: 'up'
  },
  {
    title: '節約時間',
    value: '4.2h',
    change: '+1.5h',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up'
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'chat',
    title: 'AIエージェントとの相談',
    time: '2時間前',
    status: 'completed',
    icon: MessageSquare,
    color: 'text-indigo-600'
  },
  {
    id: 2,
    type: 'agent',
    title: '新しいエージェントを作成',
    time: '5時間前',
    status: 'completed',
    icon: Lightbulb,
    color: 'text-yellow-600'
  },
  {
    id: 3,
    type: 'automation',
    title: '自動化タスクを実行',
    time: '1日前',
    status: 'completed',
    icon: Target,
    color: 'text-emerald-600'
  },
  {
    id: 4,
    type: 'pc-control',
    title: 'PC操作スクリプトを実行',
    time: '2日前',
    status: 'completed',
    icon: BarChart3,
    color: 'text-blue-600'
  }
]

const currentGoals = [
  {
    id: 1,
    title: 'エージェント機能拡張',
    progress: 75,
    deadline: '2025年2月末',
    priority: 'high',
    color: 'bg-yellow-500'
  },
  {
    id: 2,
    title: 'PC自動化スクリプト完成',
    progress: 45,
    deadline: '2025年2月15日',
    priority: 'medium',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'ワークフロー最適化',
    progress: 20,
    deadline: '2025年3月末',
    priority: 'low',
    color: 'bg-emerald-500'
  }
]

const quickActions = [
  {
    title: 'AIチャット',
    description: '新しい質問をする',
    icon: MessageSquare,
    action: 'chat',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100'
  },
  {
    title: 'エージェント作成',
    description: 'カスタムAIエージェント',
    icon: Lightbulb,
    action: 'agent-builder',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100'
  },
  {
    title: 'PC操作',
    description: '自動化・遠隔操作',
    icon: BarChart3,
    action: 'pc-control',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    title: '自動化設定',
    description: 'ワークフロー管理',
    icon: Users,
    action: 'automation',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100'
  }
]

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">おかえりなさい！</h1>
                <p className="text-indigo-100 mt-1">
                  今日もAIエージェントと一緒に効率化を進めましょう
                </p>
              </div>
            </div>
            <p className="text-indigo-100 max-w-2xl">
              オリジナルAIエージェントとPC自動化機能で、あなたの作業を劇的に効率化します。カスタマイズから実行まで、すべてをサポート。
            </p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="card-hover border-0 soft-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-600">{stat.change}</p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Current Goals */}
          <Card className="border-0 soft-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                進行中のプロジェクト
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentGoals.map((goal) => (
                <div key={goal.id} className="space-y-3 p-4 rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                    <Badge 
                      variant={
                        goal.priority === 'high' ? 'destructive' :
                        goal.priority === 'medium' ? 'default' : 'secondary'
                      }
                      className="font-medium"
                    >
                      {goal.priority === 'high' ? '高優先度' :
                       goal.priority === 'medium' ? '中優先度' : '低優先度'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{goal.progress}% 完了</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {goal.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4 border-dashed hover:bg-slate-50"
                onClick={() => onNavigate('automation')}
              >
                自動化設定を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-0 soft-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
                最近のアクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50/50 transition-colors">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 soft-shadow">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
              クイックアクション
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className={`h-auto flex-col gap-3 p-6 ${action.bgColor} ${action.hoverColor} border-0 card-hover`}
                    onClick={() => onNavigate(action.action)}
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-semibold text-slate-900">{action.title}</p>
                      <p className="text-sm text-slate-600">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Insights */}
        <Card className="border-0 soft-shadow">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-slate-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-slate-600" />
              </div>
              今日のインサイト
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-l-4 border-yellow-500">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100/50 rounded-full -mr-10 -mt-10"></div>
              <h4 className="font-semibold text-yellow-900 mb-2">エージェント活用状況</h4>
              <p className="text-yellow-700 leading-relaxed">
                カスタムエージェントの利用率が前月比45%向上しました。
                新しいエージェントを作成してさらに効率化しませんか？
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-l-4 border-blue-500">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-full -mr-10 -mt-10"></div>
              <h4 className="font-semibold text-blue-900 mb-2">自動化の提案</h4>
              <p className="text-blue-700 leading-relaxed">
                繰り返し作業を3つ検出しました。
                PC自動化機能で時間を節約できる可能性があります。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}