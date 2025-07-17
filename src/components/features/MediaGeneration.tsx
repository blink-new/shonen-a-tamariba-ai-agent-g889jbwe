import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Image, 
  Video, 
  Wand2, 
  Download,
  Copy,
  Sparkles,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'
import { blink } from '@/blink/client'

interface GeneratedMedia {
  id: string
  type: 'image' | 'video'
  url: string
  prompt: string
  timestamp: Date
  settings: any
}

export function MediaGeneration() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [videoPrompt, setVideoPrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia[]>([])
  
  // 画像生成設定
  const [imageSize, setImageSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [imageQuality, setImageQuality] = useState<'auto' | 'low' | 'medium' | 'high'>('high')
  const [imageStyle, setImageStyle] = useState<'vivid' | 'natural'>('natural')
  const [imageCount, setImageCount] = useState(1)

  const generateImage = async () => {
    if (!imagePrompt.trim()) return
    
    setIsGeneratingImage(true)
    try {
      const { data } = await blink.ai.generateImage({
        prompt: imagePrompt,
        size: imageSize,
        quality: imageQuality,
        style: imageStyle,
        n: imageCount
      })
      
      const newImages: GeneratedMedia[] = data.map((item, index) => ({
        id: `img-${Date.now()}-${index}`,
        type: 'image' as const,
        url: item.url,
        prompt: imagePrompt,
        timestamp: new Date(),
        settings: { size: imageSize, quality: imageQuality, style: imageStyle }
      }))
      
      setGeneratedMedia(prev => [...newImages, ...prev])
      setImagePrompt('')
      
    } catch (error) {
      console.error('画像生成に失敗しました:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const generateVideo = async () => {
    if (!videoPrompt.trim()) return
    
    setIsGeneratingVideo(true)
    try {
      // 注意: 実際のビデオ生成APIは実装されていないため、
      // ここではプレースホルダーとして画像を生成します
      const { data } = await blink.ai.generateImage({
        prompt: `${videoPrompt} (video thumbnail style)`,
        size: '1792x1024',
        quality: 'high',
        style: 'vivid',
        n: 1
      })
      
      const newVideo: GeneratedMedia = {
        id: `vid-${Date.now()}`,
        type: 'video',
        url: data[0].url,
        prompt: videoPrompt,
        timestamp: new Date(),
        settings: { duration: '5s', fps: 24 }
      }
      
      setGeneratedMedia(prev => [newVideo, ...prev])
      setVideoPrompt('')
      
    } catch (error) {
      console.error('動画生成に失敗しました:', error)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const downloadMedia = (media: GeneratedMedia) => {
    const link = document.createElement('a')
    link.download = `${media.type}-${media.id}.${media.type === 'image' ? 'png' : 'mp4'}`
    link.href = media.url
    link.click()
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const regenerateMedia = async (media: GeneratedMedia) => {
    if (media.type === 'image') {
      setImagePrompt(media.prompt)
      await generateImage()
    } else {
      setVideoPrompt(media.prompt)
      await generateVideo()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Wand2 className="h-5 w-5 text-rose-600" />
            </div>
            AI メディア生成
            <Badge variant="secondary" className="ml-auto">
              画像・動画
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="image" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                画像生成
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                動画生成
              </TabsTrigger>
            </TabsList>

            {/* 画像生成タブ */}
            <TabsContent value="image" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">プロンプト</label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="生成したい画像の詳細な説明を入力してください..."
                    className="min-h-20"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">サイズ</label>
                    <Select value={imageSize} onValueChange={(value: any) => setImageSize(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">正方形 (1024×1024)</SelectItem>
                        <SelectItem value="1792x1024">横長 (1792×1024)</SelectItem>
                        <SelectItem value="1024x1792">縦長 (1024×1792)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">品質</label>
                    <Select value={imageQuality} onValueChange={(value: any) => setImageQuality(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">自動</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">スタイル</label>
                    <Select value={imageStyle} onValueChange={(value: any) => setImageStyle(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">自然</SelectItem>
                        <SelectItem value="vivid">鮮やか</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">生成数</label>
                    <Select value={imageCount.toString()} onValueChange={(value) => setImageCount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}枚</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={generateImage} 
                  disabled={!imagePrompt.trim() || isGeneratingImage}
                  className="w-full"
                >
                  {isGeneratingImage ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      画像を生成
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* 動画生成タブ */}
            <TabsContent value="video" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">プロンプト</label>
                  <Textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="生成したい動画の詳細な説明を入力してください..."
                    className="min-h-20"
                  />
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">注意</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    動画生成機能は現在開発中です。現在は動画のサムネイル画像を生成します。
                  </p>
                </div>
                
                <Button 
                  onClick={generateVideo} 
                  disabled={!videoPrompt.trim() || isGeneratingVideo}
                  className="w-full"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      動画を生成
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 生成結果 */}
      {generatedMedia.length > 0 && (
        <Card className="border-0 soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Image className="h-5 w-5 text-emerald-600" />
              </div>
              生成結果
              <Badge variant="secondary" className="ml-auto">
                {generatedMedia.length}件
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedMedia.map((media) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={media.url} 
                      alt={media.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={media.type === 'image' ? 'default' : 'secondary'}>
                        {media.type === 'image' ? '画像' : '動画'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {media.prompt}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {media.timestamp.toLocaleString('ja-JP')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => downloadMedia(media)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        保存
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(media.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => regenerateMedia(media)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}