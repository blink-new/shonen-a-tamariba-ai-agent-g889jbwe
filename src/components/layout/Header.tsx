import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Bot, 
  Settings, 
  User, 
  LogOut, 
  Globe, 
  Bell,
  Menu,
  Sparkles
} from 'lucide-react'
import { blink } from '@/blink/client'

interface HeaderProps {
  onMenuClick: () => void
  user: any
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja')

  const handleLogout = () => {
    blink.auth.logout()
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  少年Aの分身
                </h1>
                <Sparkles className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-xs text-slate-500 font-medium">AI Business Agent</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative hover:bg-slate-100 rounded-xl"
          >
            <Globe className="h-4 w-4" />
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-indigo-100 text-indigo-700 border-0"
            >
              {language.toUpperCase()}
            </Badge>
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="relative hover:bg-slate-100 rounded-xl"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-slate-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {user?.displayName || 'ユーザー'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                <User className="mr-3 h-4 w-4 text-slate-600" />
                <span className="font-medium">プロフィール</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                <Settings className="mr-3 h-4 w-4 text-slate-600" />
                <span className="font-medium">設定</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="p-3 rounded-lg hover:bg-red-50 cursor-pointer text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">ログアウト</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}