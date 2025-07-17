interface HistoryItem {
  id: string
  type: 'chat' | 'screen-capture' | 'voice' | 'media-generation'
  title: string
  content: string
  timestamp: Date
  metadata?: any
}

interface HistorySettings {
  enabled: boolean
  autoDelete: boolean
  retentionDays: number
  categories: {
    chat: boolean
    screenCapture: boolean
    voice: boolean
    mediaGeneration: boolean
  }
}

// 履歴追加用のヘルパー関数
export const addToHistory = async (item: Omit<HistoryItem, 'id'>) => {
  // この関数は他のコンポーネントから呼び出されます
  const settings: HistorySettings = JSON.parse(
    localStorage.getItem('history-settings') || 
    '{"enabled":true,"categories":{"chat":true,"screenCapture":true,"voice":true,"mediaGeneration":true}}'
  )
  
  if (!settings.enabled || !settings.categories[item.type]) return

  try {
    const formattedItem: HistoryItem = {
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: item.type,
      title: item.title,
      content: item.content,
      timestamp: new Date(),
      metadata: item.metadata
    }
    
    const existingHistory = JSON.parse(localStorage.getItem('app-history') || '[]')
    const updatedHistory = [formattedItem, ...existingHistory]
    localStorage.setItem('app-history', JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('履歴の保存に失敗しました:', error)
  }
}

export type { HistoryItem, HistorySettings }