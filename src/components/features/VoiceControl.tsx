import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Settings,
  Headphones,
  Activity
} from 'lucide-react'
import { blink } from '@/blink/client'

interface VoiceControlProps {
  onCommand?: (command: string) => void
  onTranscription?: (text: string) => void
}

export function VoiceControl({ onCommand, onTranscription }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    // Web Speech API の初期化
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'ja-JP'
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ''
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }
          
          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)
          
          if (finalTranscript && onTranscription) {
            onTranscription(finalTranscript)
          }
          
          // コマンド処理
          if (finalTranscript && onCommand) {
            processVoiceCommand(finalTranscript)
          }
        }
        
        recognitionRef.current.onerror = (event) => {
          console.error('音声認識エラー:', event.error)
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    // Speech Synthesis の初期化
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCommand, onTranscription])

  const speak = useCallback((text: string) => {
    if (!isVoiceEnabled || !synthRef.current) return
    
    // 既存の音声を停止
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
  }, [isVoiceEnabled])

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    setIsListening(false)
    setAudioLevel(0)
  }, [])

  const processVoiceCommand = useCallback(async (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    // 基本的なコマンド処理
    if (lowerCommand.includes('画面') && lowerCommand.includes('キャプチャ')) {
      if (onCommand) onCommand('screen-capture')
      speak('画面キャプチャを開始します')
    } else if (lowerCommand.includes('チャット') || lowerCommand.includes('相談')) {
      if (onCommand) onCommand('chat')
      speak('AIチャットを開きます')
    } else if (lowerCommand.includes('ダッシュボード')) {
      if (onCommand) onCommand('dashboard')
      speak('ダッシュボードを表示します')
    } else if (lowerCommand.includes('停止') || lowerCommand.includes('終了')) {
      stopListening()
      speak('音声認識を停止しました')
    } else {
      // AIに質問として送信
      if (onCommand) onCommand(`ai-query:${command}`)
    }
  }, [onCommand, speak, stopListening])

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const { text } = await blink.ai.transcribeAudio({
        audio: arrayBuffer,
        language: 'ja'
      })
      
      if (text && onTranscription) {
        onTranscription(text)
      }
      
    } catch (error) {
      console.error('音声転写に失敗しました:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [onTranscription])

  const startListening = useCallback(async () => {
    try {
      // マイクの音声レベル監視を開始
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(average)
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()

      // MediaRecorder での録音開始
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      
      // Web Speech Recognition も同時に開始
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      
      setIsListening(true)
      setTranscript('')
      
    } catch (error) {
      console.error('音声認識の開始に失敗しました:', error)
    }
  }, [transcribeAudio])

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Headphones className="h-5 w-5 text-purple-600" />
            </div>
            音声コントロール
            <Badge variant={isListening ? "destructive" : "secondary"} className="ml-auto">
              {isListening ? "聞き取り中" : "待機中"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 音声認識コントロール */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isListening ? (
                <Button onClick={startListening} className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  音声認識開始
                </Button>
              ) : (
                <Button onClick={stopListening} variant="destructive" className="flex items-center gap-2">
                  <MicOff className="h-4 w-4" />
                  停止
                </Button>
              )}
              
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin">
                    <Settings className="h-4 w-4" />
                  </div>
                  処理中...
                </div>
              )}
            </div>
            
            {/* 音声レベルインジケーター */}
            {isListening && (
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 音声出力コントロール */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isVoiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-slate-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm font-medium">音声応答</span>
              </div>
              <Switch
                checked={isVoiceEnabled}
                onCheckedChange={toggleVoice}
              />
            </div>
            
            {isSpeaking && (
              <Button onClick={stopSpeaking} size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                停止
              </Button>
            )}
          </div>

          {/* 転写結果 */}
          {transcript && (
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  音声認識結果
                </h4>
                <div className="text-indigo-700 text-sm leading-relaxed">
                  {transcript}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 音声コマンド例 */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-800 mb-3">音声コマンド例</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>"画面キャプチャして"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>"チャットを開いて"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>"ダッシュボードを表示"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>"停止して"</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}