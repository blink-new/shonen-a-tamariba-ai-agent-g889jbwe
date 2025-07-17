import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Image, 
  Wand2, 
  Download,
  Copy,
  Sparkles,
  Settings,
  RefreshCw
} from 'lucide-react'
import { blink } from '@/blink/client'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
  settings: any
}

export function MediaGeneration() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  
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
      
      const newImages: GeneratedImage[] = data.map((item, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: item.url,
        prompt: imagePrompt,
        timestamp: new Date(),
        settings: { size: imageSize, quality: imageQuality, style: imageStyle }
      }))
      
      setGeneratedImages(prev => [...newImages, ...prev])
      setImagePrompt('')
      
    } catch (error) {
      console.error('画像生成に失敗しました:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a')
    link.download = `image-${image.id}.png`
    link.href = image.url
    link.click()
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const regenerateImage = async (image: GeneratedImage) => {
    setImagePrompt(image.prompt)
    await generateImage()
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Wand2 className="h-5 w-5 text-rose-600" />
            </div>
            AI 画像生成
            <Badge variant="secondary" className="ml-auto">
              画像
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* 生成結果 */}
      {generatedImages.length > 0 && (
        <Card className="border-0 soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Image className="h-5 w-5 text-emerald-600" />
              </div>
              生成結果
              <Badge variant="secondary" className="ml-auto">
                {generatedImages.length}件
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={image.url} 
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="default">
                        画像
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {image.prompt}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {image.timestamp.toLocaleString('ja-JP')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => downloadImage(image)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        保存
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(image.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => regenerateImage(image)}
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