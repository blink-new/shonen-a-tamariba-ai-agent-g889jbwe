import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Key,
  Database,
  Zap
} from 'lucide-react'
import { blink } from '@/blink/client'

interface UserSettings {
  profile: {
    displayName: string
    email: string
    avatar?: string
    bio: string
  }
  preferences: {
    language: string
    theme: 'light' | 'dark' | 'auto'
    timezone: string
    dateFormat: string
  }
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    sound: boolean
  }
  privacy: {
    dataCollection: boolean
    analytics: boolean
    crashReports: boolean
  }
  ai: {
    defaultModel: string
    temperature: number
    maxTokens: number
    autoSave: boolean
  }
}

export function Settings() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      displayName: '少年A',
      email: 'user@example.com',
      bio: 'AIエージェントを活用して効率的に作業しています。'
    },
    preferences: {
      language: 'ja',
      theme: 'light',
      timezone: 'Asia/Tokyo',
      dateFormat: 'YYYY/MM/DD'
    },
    notifications: {
      email: true,
      push: true,
      desktop: false,
      sound: true
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      crashReports: true
    },
    ai: {
      defaultModel: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
      autoSave: true
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [exportData, setExportData] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 実際の実装では blink.auth.updateMe() を使用
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('設定が保存されました')
    } catch (error) {
      alert('設定の保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    setExportData(JSON.stringify(data, null, 2))
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.settings) {
            setSettings(data.settings)
            alert('設定をインポートしました')
          }
        } catch (error) {
          alert('無効なファイル形式です')
        }
      }
      reader.readAsText(file)
    }
  }

  const resetSettings = () => {
    if (confirm('すべての設定をリセットしますか？この操作は元に戻せません。')) {
      setSettings({
        profile: {
          displayName: '',
          email: '',
          bio: ''
        },
        preferences: {
          language: 'ja',
          theme: 'light',
          timezone: 'Asia/Tokyo',
          dateFormat: 'YYYY/MM/DD'
        },
        notifications: {
          email: true,
          push: true,
          desktop: false,
          sound: true
        },
        privacy: {
          dataCollection: true,
          analytics: true,
          crashReports: true
        },
        ai: {
          defaultModel: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 1000,
          autoSave: true
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-600 via-gray-600 to-slate-800 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <SettingsIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">設定</h1>
                <p className="text-slate-100 mt-1">
                  アプリの動作をカスタマイズ
                </p>
              </div>
            </div>
            <p className="text-slate-100 max-w-2xl">
              プロフィール、通知、プライバシー、AI設定などを管理できます。
            </p>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        <Card className="border-0 soft-shadow">
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  プロフィール
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  表示設定
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  通知
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  プライバシー
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI設定
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">プロフィール情報</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">表示名</Label>
                      <Input
                        id="displayName"
                        value={settings.profile.displayName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          profile: { ...prev.profile, displayName: e.target.value }
                        }))}
                        placeholder="表示名を入力"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          profile: { ...prev.profile, email: e.target.value }
                        }))}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">自己紹介</Label>
                    <Textarea
                      id="bio"
                      value={settings.profile.bio}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, bio: e.target.value }
                      }))}
                      placeholder="自己紹介を入力してください"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">表示・言語設定</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>言語</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ja">日本語</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ko">한국어</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>テーマ</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value: 'light' | 'dark' | 'auto') => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">ライト</SelectItem>
                          <SelectItem value="dark">ダーク</SelectItem>
                          <SelectItem value="auto">自動</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>タイムゾーン</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, timezone: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>日付形式</Label>
                      <Select
                        value={settings.preferences.dateFormat}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, dateFormat: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">通知設定</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">メール通知</Label>
                        <p className="text-sm text-muted-foreground">
                          重要な更新をメールで受信
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">プッシュ通知</Label>
                        <p className="text-sm text-muted-foreground">
                          ブラウザでのプッシュ通知
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="desktop-notifications">デスクトップ通知</Label>
                        <p className="text-sm text-muted-foreground">
                          システムレベルの通知
                        </p>
                      </div>
                      <Switch
                        id="desktop-notifications"
                        checked={settings.notifications.desktop}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, desktop: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sound-notifications">通知音</Label>
                        <p className="text-sm text-muted-foreground">
                          通知時に音を再生
                        </p>
                      </div>
                      <Switch
                        id="sound-notifications"
                        checked={settings.notifications.sound}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sound: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">プライバシー・データ</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-collection">データ収集</Label>
                        <p className="text-sm text-muted-foreground">
                          サービス改善のためのデータ収集を許可
                        </p>
                      </div>
                      <Switch
                        id="data-collection"
                        checked={settings.privacy.dataCollection}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, dataCollection: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">使用状況分析</Label>
                        <p className="text-sm text-muted-foreground">
                          匿名の使用状況データを送信
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, analytics: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="crash-reports">クラッシュレポート</Label>
                        <p className="text-sm text-muted-foreground">
                          エラー発生時の自動レポート送信
                        </p>
                      </div>
                      <Switch
                        id="crash-reports"
                        checked={settings.privacy.crashReports}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, crashReports: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">AI設定</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>デフォルトAIモデル</Label>
                      <Select
                        value={settings.ai.defaultModel}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, defaultModel: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini (高速)</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (バランス)</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (高品質)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>創造性 (Temperature): {settings.ai.temperature}</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.ai.temperature}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, temperature: parseFloat(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>保守的</span>
                        <span>創造的</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>最大トークン数</Label>
                      <Input
                        type="number"
                        value={settings.ai.maxTokens}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, maxTokens: parseInt(e.target.value) }
                        }))}
                        min="100"
                        max="4000"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-save">自動保存</Label>
                        <p className="text-sm text-muted-foreground">
                          AI生成コンテンツを自動保存
                        </p>
                      </div>
                      <Switch
                        id="auto-save"
                        checked={settings.ai.autoSave}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, autoSave: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  エクスポート
                </Button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('import-file')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    インポート
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  リセット
                </Button>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? '保存中...' : '設定を保存'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Data Modal */}
        {exportData && (
          <Card className="border-0 soft-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                エクスポートデータ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={exportData}
                readOnly
                rows={10}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(exportData)
                    alert('クリップボードにコピーしました')
                  }}
                  variant="outline"
                >
                  クリップボードにコピー
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([exportData], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  variant="outline"
                >
                  ファイルとしてダウンロード
                </Button>
                <Button
                  onClick={() => setExportData('')}
                  variant="outline"
                >
                  閉じる
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}