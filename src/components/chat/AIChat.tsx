import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Calculator,
  FileText,
  Users
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  category?: string
}

const quickActions = [
  {
    id: 'agent-creation',
    label: 'エージェント作成相談',
    icon: Lightbulb,
    prompt: 'カスタムAIエージェントを作成したいです。どのような機能や性格を設定すべきか、アドバイスをください。'
  },
  {
    id: 'automation-help',
    label: '自動化アドバイス',
    icon: TrendingUp,
    prompt: '日常の繰り返し作業を自動化したいです。どのような作業が自動化に適しているか、方法を教えてください。'
  },
  {
    id: 'pc-control',
    label: 'PC操作サポート',
    icon: FileText,
    prompt: 'PC操作の自動化について相談したいです。どのような操作が可能で、どう設定すればよいか教えてください。'
  },
  {
    id: 'workflow-optimization',
    label: 'ワークフロー最適化',
    icon: Calculator,
    prompt: '現在のワークフローを最適化したいです。効率化のポイントや改善案を提案してください。'
  },
  {
    id: 'ai-integration',
    label: 'AI活用方法',
    icon: Users,
    prompt: 'AIを日常業務にもっと活用したいです。具体的な活用方法や事例を教えてください。'
  }
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'こんにちは！少年Aの分身です。オリジナルAIエージェントの作成、PC操作の自動化、ワークフローの最適化など、あなたの作業効率化をサポートします。どのようなことでお手伝いできますか？',
      role: 'assistant',
      timestamp: new Date(),
      category: 'greeting'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let streamingContent = ''
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      await blink.ai.streamText(
        {
          messages: [
            {
              role: 'system',
              content: 'あなたは作業効率化とAI活用を支援する専門的なアシスタントです。日本語で回答し、実践的で具体的なアドバイスを提供してください。カスタムAIエージェントの作成、PC操作の自動化、ワークフローの最適化、AI技術の活用方法など、ユーザーの生産性向上をサポートします。'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: messageToSend
            }
          ],
          model: 'gpt-4o-mini'
        },
        (chunk) => {
          streamingContent += chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: streamingContent }
                : msg
            )
          )
        }
      )
    } catch (error) {
      console.error('AI response error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSend(action.prompt)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">AI効率化アシスタント</h2>
            <p className="text-sm text-muted-foreground">
              作業自動化・エージェント作成サポート
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="mr-1 h-3 w-3" />
            オンライン
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="border-b p-4">
          <p className="mb-3 text-sm font-medium">よく使われる相談</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto justify-start p-3 text-left"
                  onClick={() => handleQuickAction(action)}
                >
                  <Icon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[80%] p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className={`mt-2 text-xs ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </Card>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">考え中...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力してください..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}