import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  Camera, 
  Square, 
  Play, 
  Pause,
  Download,
  Eye,
  Settings,
  AlertCircle
} from 'lucide-react'
import { blink } from '@/blink/client'

interface ScreenCaptureProps {
  onCapture?: (imageData: string) => void
}

export function ScreenCapture({ onCapture }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })

      setStream(mediaStream)
      setIsCapturing(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      // 自動停止の設定
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture()
      })

    } catch (error) {
      console.error('画面キャプチャの開始に失敗しました:', error)
    }
  }, [stopCapture])

  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const captureScreenshot = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/png')
    setCapturedImage(imageData)
    
    if (onCapture) {
      onCapture(imageData)
    }

    // 自動でAI分析を実行
    await analyzeScreen(imageData)
  }, [onCapture])

  const analyzeScreen = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      const { text } = await blink.ai.generateText({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'この画面の内容を詳しく分析して、ビジネスや副業に関連する情報があれば教えてください。また、改善点や活用方法があれば提案してください。'
              },
              {
                type: 'image',
                image: imageData
              }
            ]
          }
        ],
        model: 'gpt-4o'
      })
      setAnalysisResult(text)
    } catch (error) {
      console.error('画面分析に失敗しました:', error)
      setAnalysisResult('画面分析中にエラーが発生しました。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement('a')
    link.download = `screen-capture-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
    link.href = capturedImage
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Monitor className="h-5 w-5 text-indigo-600" />
            </div>
            画面キャプチャ & AI分析
            <Badge variant="secondary" className="ml-auto">
              リアルタイム
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            {!isCapturing ? (
              <Button onClick={startCapture} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                画面共有開始
              </Button>
            ) : (
              <>
                <Button onClick={stopCapture} variant="destructive" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  停止
                </Button>
                <Button onClick={captureScreenshot} variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  スクリーンショット
                </Button>
              </>
            )}
          </div>

          {/* ライブプレビュー */}
          {isCapturing && (
            <div className="relative rounded-lg overflow-hidden bg-slate-100">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-64 object-contain"
                muted
                playsInline
              />
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="animate-pulse">
                  ● LIVE
                </Badge>
              </div>
            </div>
          )}

          {/* キャプチャした画像 */}
          {capturedImage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  キャプチャ結果
                </h4>
                <Button onClick={downloadImage} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
              </div>
              <img 
                src={capturedImage} 
                alt="Screen capture" 
                className="w-full rounded-lg border"
              />
            </div>
          )}

          {/* AI分析結果 */}
          {isAnalyzing && (
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <Settings className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-indigo-700 font-medium">AI分析中...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  AI分析結果
                </h4>
                <div className="text-emerald-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult}
                </div>
              </CardContent>
            </Card>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}