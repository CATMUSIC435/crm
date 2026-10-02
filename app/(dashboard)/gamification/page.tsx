"use client"
import React, { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { LeaderboardAgent, GamificationQuest, GamificationBadge, RewardItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Trophy, Medal, Target, Zap, Star, Crown, 
  Swords, Flame, ArrowUpCircle, ArrowDownCircle, Award, Crosshair, Users, Mail,
  PhoneCall, Compass, Send, CheckCircle2, X, Gift, ShoppingBag, Sparkles, Clock,
  ChevronRight, Share2, Download, ExternalLink, TrendingUp, Heart, ThumbsUp,
  ShieldCheck, Layers, Calendar, DollarSign, Building2, Check, Radio, AlertCircle,
  Search
} from 'lucide-react'

export default function GamificationPage() {
  const { 
    gamificationAgents,
    gamificationQuests,
    gamificationBadges,
    gamificationRewards,
    currentUserExp,
    currentUserLevel,
    claimQuestReward,
    redeemReward,
    sendKudos,
    createChallenge,
    checkinDailyExp
  } = useStore()

  // State bộ lọc và tab
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'week' | 'quarter' | 'year'>('month')
  const [activeTab, setActiveTab] = useState<'podium' | 'leaderboard' | 'quests' | 'badges' | 'store'>('podium')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals state
  const [selectedAgentForDetail, setSelectedAgentForDetail] = useState<LeaderboardAgent | null>(null)
  
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [challengeTarget, setChallengeTarget] = useState<LeaderboardAgent | null>(null)
  const [challengeForm, setChallengeForm] = useState({
    goal: 'Chốt cọc căn hộ trước 23:59 Chủ Nhật',
    betExp: 500,
    note: 'Chiến binh nào thắng sẽ được vinh danh toàn sàn!'
  })

  const [showRewardStoreModal, setShowRewardStoreModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)

  const [showKudosModal, setShowKudosModal] = useState(false)
  const [kudosTarget, setKudosTarget] = useState<LeaderboardAgent | null>(null)
  const [kudosMessage, setKudosMessage] = useState('Chúc mừng chiến binh! Phong độ chốt deal quá đỉnh cao! 🔥')

  const [showBossRaidModal, setShowBossRaidModal] = useState(false)

  // Floating Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Handle Daily Checkin
  const handleDailyCheckin = () => {
    checkinDailyExp()
    triggerToast('🎉 Điểm danh thành công! Bạn nhận được +200 EXP chiến binh hôm nay!')
  }

  // Handle Claim Quest
  const handleClaimQuest = (quest: GamificationQuest) => {
    if (quest.rewardClaimed) return
    claimQuestReward(quest.id)
    triggerToast(`🏆 Chúc mừng! Bạn đã hoàn thành "${quest.title}" và nhận +${quest.exp} EXP!`)
  }

  // Handle Redeem Reward
  const handleConfirmRedeem = () => {
    if (!selectedReward) return
    if (currentUserExp < selectedReward.costExp) {
      triggerToast('❌ Điểm EXP tích lũy không đủ để đổi phần thưởng này!')
      return
    }
    if (selectedReward.quantityRemaining <= 0) {
      triggerToast('❌ Phần thưởng này đã hết lượt quy đổi trong tuần!')
      return
    }
    redeemReward(selectedReward.id)
    setShowRewardStoreModal(false)
    triggerToast(`🎁 Đổi quà thành công! "${selectedReward.title}" sẽ được gửi đến bạn trong 24h!`)
  }

  // Handle Send Kudos
  const handleSendKudosSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!kudosTarget) return
    sendKudos(kudosTarget.id, kudosMessage)
    setShowKudosModal(false)
    triggerToast(`👏 Đã gửi lời chúc mừng và tặng +100 EXP tình thân tới ${kudosTarget.name}!`)
  }

  // Handle Create Challenge
  const handleSendChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!challengeTarget) return
    if (currentUserExp < challengeForm.betExp) {
      triggerToast('❌ Bạn không đủ điểm EXP để đặt cược thách đấu này!')
      return
    }
    createChallenge(challengeTarget.id, challengeForm.goal, challengeForm.betExp)
    setShowChallengeModal(false)
    triggerToast(`⚔️ Đã phát lệnh thách đấu PK tới ${challengeTarget.name} với mức cược ${challengeForm.betExp} EXP!`)
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Hạng', 'Họ Tên', 'Phòng Kinh Doanh', 'Doanh Số', 'Số Deal Cọc', 'Điểm EXP', 'Cấp Độ', 'Danh Hiệu', 'Xu Hướng']
    const rows = gamificationAgents.map(ag => [
      `"${ag.rank}"`,
      `"${ag.name}"`,
      `"${ag.team}"`,
      `"${ag.revenueDisplay}"`,
      `"${ag.dealsCount}"`,
      `"${ag.exp}"`,
      `"Level ${ag.level}"`,
      `"${ag.title}"`,
      `"${ag.trend === 'up' ? 'Tăng hạng' : ag.trend === 'down' ? 'Tụt hạng' : 'Ổn định'}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bang_Vang_Doanh_So_Gamification_${selectedPeriod}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerToast('Đã xuất Bảng Vàng Doanh Số chuẩn UTF-8 BOM thành công!')
  }

  // Filtered leaderboard
  const filteredAgents = useMemo(() => {
    return gamificationAgents.filter(ag => {
      const matchSearch = ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ag.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ag.title.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchSearch) return false

      if (selectedTeam === 'all') return true
      return ag.team.includes(selectedTeam)
    })
  }, [gamificationAgents, searchQuery, selectedTeam])

  // Top 3 for Podium
  const top1 = gamificationAgents[0]
  const top2 = gamificationAgents[1]
  const top3 = gamificationAgents[2]

  return (
    <div className="space-y-6">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-amber-500/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <Button variant="ghost" size="icon" onClick={() => setToastMessage(null)} className="h-6 w-6 text-slate-400 hover:text-white ml-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* HEADER & EXECUTIVE STRATEGY COCKPIT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 opacity-10 pointer-events-none">
          <Trophy className="h-80 w-80 text-yellow-400" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl text-slate-950 shadow-md">
              <Trophy className="h-6 w-6 font-black" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Đua Top & Gamification</h1>
            <Badge className="bg-amber-400 text-slate-950 border-none text-xs font-black px-2.5 py-0.5">
              MÙA GIẢI Q3/2026
            </Badge>
          </div>
          <p className="text-sm text-amber-200/80 max-w-2xl">
            Đấu trường doanh số 500 Tỷ: Vinh danh chiến thần chốt deal, hệ thống thăng cấp bậc danh giá và đổi thưởng hiện vật giá trị cao.
          </p>
        </div>

        {/* Header Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-900/90 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value as any)
                triggerToast(`Đã chuyển chu kỳ xếp hạng sang: ${e.target.options[e.target.selectedIndex].text}`)
              }}
              className="bg-transparent text-white outline-none cursor-pointer text-xs font-bold"
            >
              <option value="month" className="bg-slate-900">Tháng Này (T7/2026)</option>
              <option value="week" className="bg-slate-900">Tuần Này (Week 29)</option>
              <option value="quarter" className="bg-slate-900">Quý 3 (Q3/2026)</option>
              <option value="year" className="bg-slate-900">Cả Năm 2026</option>
            </select>
          </div>

          {/* Daily Checkin */}
          <Button 
            onClick={handleDailyCheckin}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs h-9 shadow-md shadow-amber-500/30"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Điểm Danh +200 EXP
          </Button>

          {/* Reward Store trigger */}
          <Button 
            onClick={() => setActiveTab('store')}
            variant="outline" 
            className="border-amber-400/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-bold h-9"
          >
            <Gift className="h-4 w-4 mr-1.5 text-amber-400" />
            Đổi Quà Thưởng
          </Button>

          {/* Export CSV */}
          <Button 
            onClick={handleExportCSV}
            variant="ghost" 
            className="text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold h-9"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Xuất Bảng Vàng
          </Button>
        </div>
      </div>

      {/* 4 STRATEGY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh Số Đua Top</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-baseline gap-2">
              148.5 Tỷ
              <span className="text-xs font-bold text-emerald-600">+24.5%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">48 hợp đồng cọc thành công</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quỹ Thưởng & Hiện Vật</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-baseline gap-2">
              1.25 Tỷ VNĐ
              <span className="text-xs font-semibold text-emerald-600">Mercedes C200</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">3 Chuyến du lịch Châu Âu & Vàng SJC</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Gift className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chiến Binh Đạt Chuẩn MVP</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 flex items-baseline gap-2">
              18 / 65
              <span className="text-xs font-semibold text-blue-600">Chiến binh</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Đã vượt mốc 10 Tỷ doanh số cá nhân</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <Flame className="h-6 w-6 text-rose-500" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">EXP Tích Lũy Toàn Sàn</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 flex items-baseline gap-2">
              1,420,500
              <span className="text-xs font-bold text-amber-500">Tier Vàng</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Toàn đội đạt chuẩn mở rương Boss</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <Zap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* PLAYER PROFILE HERO CARD (THẺ CHIẾN BINH BĐS CÁ NHÂN) */}
      <Card className="bg-slate-900 border-amber-500/40 shadow-2xl overflow-hidden relative text-white">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-600/20 via-indigo-600/10 to-transparent pointer-events-none"></div>
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            
            {/* Avatar & Level Crown */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 blur-lg opacity-60 animate-pulse"></div>
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-amber-400/80 bg-slate-800 flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                  alt="Tuấn Tú" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-3.5 py-1 rounded-full border-2 border-slate-900 z-20 shadow-lg text-xs tracking-wider">
                LV {currentUserLevel}
              </div>
            </div>

            {/* Info & Achievements */}
            <div className="flex-1 text-center md:text-left w-full space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      Nguyễn Trần Tuấn Tú
                    </h2>
                    <span className="text-xs bg-red-500 text-white font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                      Top 1 MVP
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                      Sàn Novaland Gallery Q1
                    </Badge>
                    <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black border-none text-xs flex items-center gap-1 shadow-md">
                      <Swords className="h-3.5 w-3.5" /> Chiến Thần Chốt Cọc
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs flex items-center gap-1">
                      <Flame className="h-3 w-3 text-rose-400" /> Streak 5 Tuần Liên Tục
                    </Badge>
                  </div>
                </div>

                {/* Score & EXP Big */}
                <div className="text-center md:text-right shrink-0">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">
                    Điểm EXP Khả Dụng
                  </span>
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                    {currentUserExp.toLocaleString()} <span className="text-sm text-amber-400 font-bold">EXP</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Doanh số cọc: <strong className="text-emerald-400 text-sm font-black">25.5 Tỷ VNĐ</strong> (6 Deals)
                  </div>
                </div>
              </div>

              {/* EXP Progress Bar */}
              <div className="space-y-1.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> Tiến trình thăng cấp (Level {currentUserLevel + 1})
                  </span>
                  <span className="text-amber-400">{currentUserExp.toLocaleString()} / 105,000 EXP</span>
                </div>
                <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (currentUserExp / 105000) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Còn <strong className="text-amber-400">{(105000 - currentUserExp).toLocaleString()} EXP</strong> nữa để mở khóa danh hiệu vĩnh viễn <strong className="text-yellow-300">"Thống Đốc Địa Ốc Q1"</strong> và nhận chuyến du lịch Phú Quốc.
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setActiveTab('podium')}
            variant={activeTab === 'podium' ? 'default' : 'ghost'}
            className={`font-bold text-xs md:text-sm h-9 rounded-xl ${activeTab === 'podium' ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : ''}`}
          >
            <Crown className="h-4 w-4 mr-1.5" /> Bục Vinh Danh Top 3
          </Button>
          <Button 
            onClick={() => setActiveTab('leaderboard')}
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
            className={`font-bold text-xs md:text-sm h-9 rounded-xl ${activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : ''}`}
          >
            <Trophy className="h-4 w-4 mr-1.5" /> Bảng Xếp Hạng ({gamificationAgents.length})
          </Button>
          <Button 
            onClick={() => setActiveTab('quests')}
            variant={activeTab === 'quests' ? 'default' : 'ghost'}
            className={`font-bold text-xs md:text-sm h-9 rounded-xl ${activeTab === 'quests' ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : ''}`}
          >
            <Target className="h-4 w-4 mr-1.5" /> Thử Thách & Boss ({gamificationQuests.length})
          </Button>
          <Button 
            onClick={() => setActiveTab('badges')}
            variant={activeTab === 'badges' ? 'default' : 'ghost'}
            className={`font-bold text-xs md:text-sm h-9 rounded-xl ${activeTab === 'badges' ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : ''}`}
          >
            <Medal className="h-4 w-4 mr-1.5" /> Huy Hiệu Danh Giá ({gamificationBadges.length})
          </Button>
          <Button 
            onClick={() => setActiveTab('store')}
            variant={activeTab === 'store' ? 'default' : 'ghost'}
            className={`font-bold text-xs md:text-sm h-9 rounded-xl ${activeTab === 'store' ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : ''}`}
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" /> Cửa Hàng Thưởng ({gamificationRewards.length})
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={() => setShowBossRaidModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8"
          >
            <Crown className="h-3.5 w-3.5 mr-1" /> Săn Boss Toàn Sàn
          </Button>
        </div>
      </div>

      {/* TAB 1: BỤC VINH DANH TOP 3 GRAND PODIUM */}
      {activeTab === 'podium' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* 3 PODIUM STAGES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 pb-4">
            
            {/* TOP 2 (SILVER - LEFT) */}
            {top2 && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-300 shadow-xl overflow-hidden bg-slate-200">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt={top2.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 -right-2 bg-slate-300 text-slate-900 h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
                    2
                  </div>
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{top2.name}</h3>
                  <p className="text-xs text-muted-foreground">{top2.team}</p>
                  <div className="text-xl font-black text-slate-700 dark:text-slate-300 mt-1">{top2.revenueDisplay}</div>
                  <Badge variant="outline" className="mt-1 text-[10px] border-slate-300 font-bold">{top2.title}</Badge>
                </div>

                {/* Silver Pedestal */}
                <div className="w-full h-44 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-t-2xl p-4 flex flex-col justify-between items-center shadow-lg border-t-4 border-slate-400">
                  <div className="text-slate-700 dark:text-slate-200 font-black text-xl tracking-wider">HẠNG NHÌ 🥈</div>
                  <div className="text-center text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div>🎁 Thưởng: <strong>Du lịch Nhật Bản + 50tr</strong></div>
                    <div>🔥 5 Hợp đồng cọc</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setKudosTarget(top2)
                      setShowKudosModal(true)
                    }}
                    className="w-full h-7 text-xs font-bold bg-white/80 dark:bg-slate-900/80"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> Chúc Mừng 👏
                  </Button>
                </div>
              </div>
            )}

            {/* TOP 1 (GOLD - CENTER - HIGHEST) */}
            {top1 && (
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <Crown className="h-10 w-10 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                  </div>
                  <div className="h-32 w-32 rounded-full border-4 border-yellow-400 shadow-2xl overflow-hidden bg-amber-100 ring-4 ring-yellow-400/30">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt={top1.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-md uppercase">
                    Quán Quân
                  </div>
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-black text-lg text-amber-900 dark:text-amber-300">{top1.name}</h3>
                  <p className="text-xs text-muted-foreground">{top1.team}</p>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{top1.revenueDisplay}</div>
                  <Badge className="mt-1 bg-amber-400 text-slate-950 font-black text-[10px]">{top1.title}</Badge>
                </div>

                {/* Gold Pedestal */}
                <div className="w-full h-56 bg-gradient-to-t from-amber-400 via-yellow-400 to-amber-300 text-slate-950 rounded-t-2xl p-4 flex flex-col justify-between items-center shadow-2xl border-t-4 border-yellow-200">
                  <div className="font-black text-2xl tracking-widest flex items-center gap-1.5">
                    <Trophy className="h-6 w-6" /> QUÁN QUÂN 👑
                  </div>
                  <div className="text-center text-xs text-amber-950 font-bold space-y-1">
                    <div className="text-sm font-black">🎁 Thụy Sĩ 8N7Đ + 100 Triệu</div>
                    <div>🔥 6 Hợp đồng cọc • 98,500 EXP</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setKudosTarget(top1)
                      setShowKudosModal(true)
                    }}
                    className="w-full h-8 text-xs font-black bg-slate-950 text-white hover:bg-slate-900 shadow-md"
                  >
                    <Trophy className="h-3.5 w-3.5 mr-1 text-amber-400" /> Tôn Vinh MVP 🏆
                  </Button>
                </div>
              </div>
            )}

            {/* TOP 3 (BRONZE - RIGHT) */}
            {top3 && (
              <div className="order-3 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="h-24 w-24 rounded-full border-4 border-amber-700 shadow-xl overflow-hidden bg-amber-200">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" alt={top3.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 -right-2 bg-amber-700 text-white h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
                    3
                  </div>
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{top3.name}</h3>
                  <p className="text-xs text-muted-foreground">{top3.team}</p>
                  <div className="text-xl font-black text-amber-800 dark:text-amber-500 mt-1">{top3.revenueDisplay}</div>
                  <Badge variant="outline" className="mt-1 text-[10px] border-amber-700 font-bold">{top3.title}</Badge>
                </div>

                {/* Bronze Pedestal */}
                <div className="w-full h-36 bg-gradient-to-t from-amber-800 to-amber-700 text-white rounded-t-2xl p-4 flex flex-col justify-between items-center shadow-lg border-t-4 border-amber-600">
                  <div className="font-black text-lg tracking-wider">HẠNG BA 🥉</div>
                  <div className="text-center text-xs text-amber-100 space-y-1">
                    <div>🎁 Thưởng: <strong>iPhone 16 Pro Max + 30tr</strong></div>
                    <div>🔥 4 Hợp đồng cọc</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setKudosTarget(top3)
                      setShowKudosModal(true)
                    }}
                    className="w-full h-7 text-xs font-bold bg-white/20 text-white border-white/40 hover:bg-white/30"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> Chúc Mừng 👏
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* SÀN ĐẤU THÁCH ĐẤU BANNER */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-950 p-5 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-500/30">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <Swords className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-base">Sàn Đấu Thách Đấu PK 1-1 (Sales Duel Arena)</h4>
                <p className="text-xs text-indigo-200">
                  Thách đấu đồng nghiệp chốt hợp đồng hoặc đua doanh số tuần. Người thắng nhận trọn điểm cược EXP!
                </p>
              </div>
            </div>
            <Button 
              onClick={() => {
                setChallengeTarget(top2)
                setShowChallengeModal(true)
              }}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs h-9 px-4 shrink-0"
            >
              <Swords className="h-4 w-4 mr-1.5" /> Phát Lệnh Thách Đấu
            </Button>
          </div>

        </div>
      )}

      {/* TAB 2: BẢNG XẾP HẠNG TOÀN SÀN (LEADERBOARD) */}
      {activeTab === 'leaderboard' && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Bảng Xếp Hạng Doanh Số Chi Tiết
                </CardTitle>
                <CardDescription>Cập nhật theo thời gian thực từ các giao dịch cọc và HĐMB đã giải ngân.</CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên, sàn, danh hiệu..." 
                    className="pl-9 h-9 text-xs" 
                  />
                </div>
                
                <select 
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                >
                  <option value="all">Tất cả sàn giao dịch</option>
                  <option value="Novaland Gallery Q1">Sàn Novaland Gallery Q1</option>
                  <option value="Masterise Thủ Đức">Sàn Masterise Thủ Đức</option>
                  <option value="Aqua City Đồng Nai">Sàn Aqua City Đồng Nai</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 text-center w-16">Hạng</th>
                  <th className="py-3 px-4 text-left">Chiến Binh</th>
                  <th className="py-3 px-4 text-left">Phòng Kinh Doanh</th>
                  <th className="py-3 px-4 text-right">Doanh Số Cọc</th>
                  <th className="py-3 px-4 text-center">Số Deals</th>
                  <th className="py-3 px-4 text-right">Điểm EXP</th>
                  <th className="py-3 px-4 text-center">Danh Hiệu</th>
                  <th className="py-3 px-4 text-center">Biến Động</th>
                  <th className="py-3 px-4 text-center">Tác Vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAgents.map((ag) => {
                  const isTop1 = ag.rank === 1
                  const isTop2 = ag.rank === 2
                  const isTop3 = ag.rank === 3

                  return (
                    <tr 
                      key={ag.id} 
                      className={`hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors ${
                        isTop1 ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center">
                        <div className={`h-7 w-7 rounded-full mx-auto flex items-center justify-center font-black text-xs ${
                          isTop1 ? 'bg-amber-400 text-slate-950 shadow-sm' :
                          isTop2 ? 'bg-slate-300 text-slate-900' :
                          isTop3 ? 'bg-amber-700 text-white' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {isTop1 ? '👑' : ag.rank}
                        </div>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-full border border-slate-200">
                            <AvatarFallback className="text-xs font-bold bg-indigo-100 text-indigo-700">
                              {ag.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {ag.name}
                              {ag.mvp && (
                                <Badge className="bg-red-500 text-white text-[9px] h-3.5 px-1 font-bold">MVP</Badge>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground">Level {ag.level}</div>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                        {ag.team}
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-black text-sm ${isTop1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {ag.revenueDisplay}
                        </span>
                      </td>

                      {/* Deals */}
                      <td className="py-3.5 px-4 text-center font-bold">
                        {ag.dealsCount} căn
                      </td>

                      {/* EXP */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ag.exp.toLocaleString()}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className="text-[10px] font-semibold bg-white dark:bg-slate-900">
                          {ag.title}
                        </Badge>
                      </td>

                      {/* Trend */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                          ag.trend === 'up' ? 'text-emerald-600' :
                          ag.trend === 'down' ? 'text-rose-600' :
                          'text-slate-400'
                        }`}>
                          {ag.trend === 'up' && <ArrowUpCircle className="h-3.5 w-3.5" />}
                          {ag.trend === 'down' && <ArrowDownCircle className="h-3.5 w-3.5" />}
                          {ag.trend === 'up' ? 'Tăng' : ag.trend === 'down' ? 'Giảm' : '—'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedAgentForDetail(ag)}
                            className="h-7 text-[11px] text-indigo-600 hover:text-indigo-700 font-bold"
                          >
                            Hồ Sơ
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setChallengeTarget(ag)
                              setShowChallengeModal(true)
                            }}
                            className="h-7 text-[11px] font-bold text-amber-700 border-amber-300 hover:bg-amber-50"
                          >
                            <Swords className="h-3 w-3 mr-0.5" /> PK
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: THỬ THÁCH TUẦN & SĂN BOSS (QUESTS) */}
      {activeTab === 'quests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* CỘT TRÁI: DANH SÁCH NHIỆM VỤ TUẦN (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Nhiệm Vụ Chiến Binh Tuần Này
                </CardTitle>
                <CardDescription>Hoàn thành nhiệm vụ để tích lũy lượng lớn EXP và tăng tỷ lệ chốt deal.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                {gamificationQuests.map((quest) => {
                  const percent = Math.min(100, Math.round((quest.current / quest.max) * 100))
                  const isDone = quest.current >= quest.max

                  return (
                    <div key={quest.id} className="p-4 md:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          isDone ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {quest.category === 'special' ? <Crown className="h-5 w-5 text-amber-500" /> :
                           quest.category === 'daily' ? <Clock className="h-5 w-5 text-blue-500" /> :
                           <Target className="h-5 w-5 text-indigo-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-bold text-sm truncate ${quest.rewardClaimed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                              {quest.title}
                            </h4>
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black text-xs">
                              +{quest.exp.toLocaleString()} EXP
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{quest.desc}</p>

                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Progress value={percent} className="h-2" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-16 text-right">
                              {quest.current} / {quest.max}
                            </span>
                          </div>

                          <div className="flex justify-end mt-3">
                            {quest.rewardClaimed ? (
                              <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 text-[10px]">
                                <Check className="h-3 w-3 mr-1" /> Đã Nhận Thưởng
                              </Badge>
                            ) : isDone ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleClaimQuest(quest)}
                                className="h-7 text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-md"
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-1" /> Nhận Thưởng +{quest.exp} EXP
                              </Button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Đang tiến hành ({percent}%)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* CỘT PHẢI: BOSS RAID TOÀN SÀN (1/3) */}
          <div className="space-y-4">
            <Card className="shadow-lg border-indigo-500/40 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white overflow-hidden relative">
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-400 text-slate-950 font-black text-xs">BOSS RAID TUẦN</Badge>
                  <span className="text-xs text-indigo-300 font-mono">Còn 3 Ngày 08 Giờ</span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">Chinh Phục Đại Dự Án Aqua City</h3>
                  <p className="text-xs text-indigo-200/80 mt-1">
                    Toàn sàn Novaland Gallery cùng hợp lực chốt 10 căn biệt thự để mở Rương Kho Báu Doanh Số.
                  </p>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-indigo-500/30 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Tiến độ toàn sàn:</span>
                    <strong className="text-amber-400">7 / 10 Căn (70%)</strong>
                  </div>
                  <Progress value={70} className="h-2.5 bg-slate-800" />
                  <p className="text-[10px] text-slate-300">
                    Chỉ còn 3 căn nữa để toàn bộ 65 chuyên viên nhận thưởng nóng 50.000.000 VNĐ quỹ teambuilding!
                  </p>
                </div>

                <Button 
                  onClick={() => setShowBossRaidModal(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs h-9"
                >
                  <Crown className="h-4 w-4 mr-1.5" /> Xem Chi Tiết Thể Lệ Săn Boss
                </Button>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* TAB 4: BỘ SƯU TẬP HUY HIỆU DANH GIÁ (BADGES) */}
      {activeTab === 'badges' && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-500" />
              Tủ Kính Huy Hiệu Danh Giá BĐS
            </CardTitle>
            <CardDescription>Mở khóa các thành tựu cao cấp để khẳng định vị thế và uy tín với khách hàng VIP.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gamificationBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    badge.unlocked 
                      ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-900/60 shadow-md hover:scale-[1.02]' 
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${badge.color}`}>
                        {badge.name.includes('Blood') ? <Flame className="h-6 w-6" /> :
                         badge.name.includes('Whale') ? <Crown className="h-6 w-6" /> :
                         badge.name.includes('MVP') ? <Trophy className="h-6 w-6" /> :
                         badge.name.includes('Centurion') ? <PhoneCall className="h-6 w-6" /> :
                         <Award className="h-6 w-6" />}
                      </div>
                      <Badge className={`text-[10px] font-bold ${
                        badge.rarity === 'Huyền thoại' ? 'bg-amber-400 text-slate-950' :
                        badge.rarity === 'Sử thi' ? 'bg-purple-600 text-white' :
                        badge.rarity === 'Hiếm' ? 'bg-blue-600 text-white' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {badge.rarity}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{badge.desc}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-amber-600 font-bold">+{badge.bonusExp} EXP</span>
                    {badge.unlocked ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đã mở {badge.unlockedDate}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold">Chưa mở khóa</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: CỬA HÀNG ĐỔI QUÀ THƯỞNG (REWARD STORE) */}
      {activeTab === 'store' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-5 rounded-2xl text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8" />
              <div>
                <h3 className="font-black text-lg">Cửa Hàng Đổi Điểm Thưởng EXP</h3>
                <p className="text-xs text-amber-950 font-medium">Quy đổi điểm chiến công tích lũy lấy các phần thưởng giá trị cao.</p>
              </div>
            </div>
            <div className="bg-slate-950 text-white px-4 py-2 rounded-xl text-center shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Số Dư EXP Của Bạn</span>
              <span className="text-xl font-black text-amber-400">{currentUserExp.toLocaleString()} EXP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamificationRewards.map((reward) => {
              const canAfford = currentUserExp >= reward.costExp
              return (
                <div 
                  key={reward.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-amber-400 transition-colors"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <img src={reward.image} alt={reward.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                      <Badge className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold">
                        Còn lại: {reward.quantityRemaining}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{reward.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{reward.description}</p>
                      
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400 pt-1">
                        {reward.costExp.toLocaleString()} <span className="text-xs font-bold">EXP</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedReward(reward)
                        setShowRewardStoreModal(true)
                      }}
                      disabled={!canAfford || reward.quantityRemaining <= 0}
                      className={`w-full h-8 text-xs font-bold ${
                        canAfford && reward.quantityRemaining > 0 
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {reward.quantityRemaining <= 0 ? 'Hết Lượt Tuần Này' : canAfford ? 'Đổi Quà Ngay' : 'Chưa Đủ EXP'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5 MODALS TÁC NGHIỆP HOÀN TOÀN TƯƠNG TÁC (ZERO DEAD BUTTONS) */}
      {/* ======================================================== */}

      {/* MODAL 1: THÁCH ĐẤU PK 1-1 */}
      {showChallengeModal && challengeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-red-950 to-indigo-950 text-white">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-base">Thách Đấu PK Doanh Số 1-1</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowChallengeModal(false)} className="h-7 w-7 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSendChallengeSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">{challengeTarget.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">Đối thủ thách đấu:</div>
                  <strong className="text-sm text-slate-800 dark:text-slate-200">{challengeTarget.name}</strong>
                  <div className="text-[10px] text-amber-600 font-bold">{challengeTarget.title} ({challengeTarget.revenueDisplay})</div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mục Tiêu Thách Đấu</label>
                <select 
                  value={challengeForm.goal}
                  onChange={(e) => setChallengeForm({ ...challengeForm, goal: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                >
                  <option value="Chốt cọc căn hộ trước 23:59 Chủ Nhật">Chốt cọc căn hộ trước 23:59 Chủ Nhật</option>
                  <option value="Ai có doanh số tuần này cao hơn">Ai có doanh số tuần này cao hơn</option>
                  <option value="Ai đón tiếp nhiều lượt sa bàn hơn (Target 5 lượt)">Ai đón tiếp nhiều lượt sa bàn hơn (Target 5 lượt)</option>
                  <option value="Thực hiện 100 cuộc gọi telesale chất lượng">Thực hiện 100 cuộc gọi telesale chất lượng</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mức Cược EXP (Từ Quỹ Của Bạn)</label>
                <select 
                  value={challengeForm.betExp}
                  onChange={(e) => setChallengeForm({ ...challengeForm, betExp: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                >
                  <option value={200}>200 EXP (Giao lưu cà phê)</option>
                  <option value={500}>500 EXP (Thử thách chiến binh)</option>
                  <option value={1000}>1,000 EXP (Đại chiến Top Gun)</option>
                  <option value={2000}>2,000 EXP (All-in danh dự)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lời Nhắn Thách Đấu</label>
                <textarea 
                  rows={2}
                  value={challengeForm.note}
                  onChange={(e) => setChallengeForm({ ...challengeForm, note: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowChallengeModal(false)}>
                  Hủy Bỏ
                </Button>
                <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  <Swords className="h-3.5 w-3.5 mr-1" /> Phát Lệnh Thách Đấu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XÁC NHẬN ĐỔI QUÀ THƯỞNG */}
      {showRewardStoreModal && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-base">Xác Nhận Đổi Thưởng</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowRewardStoreModal(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100">
                <img src={selectedReward.image} alt={selectedReward.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedReward.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{selectedReward.description}</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 flex justify-between items-center">
                <span>Chi phí quy đổi:</span>
                <strong className="text-sm font-black text-amber-600">{selectedReward.costExp.toLocaleString()} EXP</strong>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Số dư EXP sau khi đổi:</span>
                <strong className="text-slate-800 dark:text-slate-200">{(currentUserExp - selectedReward.costExp).toLocaleString()} EXP</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRewardStoreModal(false)}>
                  Hủy Bỏ
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleConfirmRedeem}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Xác Nhận Đổi Quà
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: XEM HỒ SƠ CHIẾN TÍCH CÁ NHÂN */}
      {selectedAgentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-amber-400">
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">{selectedAgentForDetail.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-base">{selectedAgentForDetail.name}</h3>
                  <p className="text-xs text-slate-400">{selectedAgentForDetail.team} • Hạng #{selectedAgentForDetail.rank}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAgentForDetail(null)} className="h-7 w-7 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                <div>
                  <span className="text-muted-foreground block">Doanh Số Cọc:</span>
                  <strong className="text-sm font-black text-amber-600">{selectedAgentForDetail.revenueDisplay}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Hợp Đồng Cọc:</span>
                  <strong className="text-sm">{selectedAgentForDetail.dealsCount} giao dịch</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Điểm EXP Tích Lũy:</span>
                  <strong className="text-sm font-mono text-indigo-600">{selectedAgentForDetail.exp.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Chuỗi Streak:</span>
                  <strong className="text-sm text-rose-600">{selectedAgentForDetail.streakWeeks} tuần liên tiếp 🔥</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Danh Hiệu Danh Dự</span>
                <Badge className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1">
                  {selectedAgentForDetail.title}
                </Badge>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chiến Công Nổi Bật Gần Nhất</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-slate-700 dark:text-slate-300 leading-relaxed">
                  Vừa chốt cọc thành công căn Biệt thự song lập Đảo Phượng Hoàng Aqua City trị giá 14.5 Tỷ đồng cho khách hàng VIP Diamond. Tỷ lệ chốt deal đạt 31.2% trên tổng số lead được phân bổ.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button 
                  onClick={() => {
                    setKudosTarget(selectedAgentForDetail)
                    setSelectedAgentForDetail(null)
                    setShowKudosModal(true)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Gửi Lời Chúc Mừng 👏
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: GỬI LỜI CHÚC MỪNG & KUDOS */}
      {showKudosModal && kudosTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                <h3 className="font-black text-base">Gửi Lời Chúc Mừng & Tặng EXP</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowKudosModal(false)} className="h-7 w-7 text-slate-950 hover:bg-black/10">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSendKudosSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-amber-100 text-amber-800 font-bold">{kudosTarget.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">Người nhận vinh danh:</div>
                  <strong className="text-sm text-slate-800 dark:text-slate-200">{kudosTarget.name}</strong>
                  <div className="text-[10px] text-muted-foreground">{kudosTarget.team}</div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lời Chúc Chiến Binh</label>
                <textarea 
                  rows={3}
                  value={kudosMessage}
                  onChange={(e) => setKudosMessage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                <span>Quà tặng đính kèm:</span>
                <span>+100 EXP Tình Thân Đồng Đội</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowKudosModal(false)}>
                  Hủy Bỏ
                </Button>
                <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
                  <Send className="h-3.5 w-3.5 mr-1" /> Gửi Vinh Danh
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CHI TIẾT SĂN BOSS DOANH SỐ TOÀN SÀN */}
      {showBossRaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                <h3 className="font-black text-base">Thể Lệ Chiến Dịch Săn Boss Doanh Số</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowBossRaidModal(false)} className="h-7 w-7 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex justify-between font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  <span>Mục Tiêu Boss:</span>
                  <span className="text-rose-600 font-black">10 Căn Aqua City Trong Tuần</span>
                </div>
                <Progress value={70} className="h-2.5 bg-slate-200 dark:bg-slate-800" />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Đã đạt: 7 Căn</span>
                  <span>Còn thiếu: 3 Căn</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Cơ Cấu Giải Thưởng Rương Boss:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li><strong>Quỹ thưởng 50.000.000 VNĐ</strong> tiền mặt bổ sung vào quỹ liên hoan teambuilding toàn sàn.</li>
                  <li>Tặng <strong>+10,000 EXP</strong> cho mỗi chuyên viên đóng góp ít nhất 1 deal cọc trong tuần.</li>
                  <li>Vinh danh Top 1 đóng góp lên bảng điện tử sảnh chính Novaland Gallery suốt tuần kế tiếp.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button 
                  onClick={() => {
                    setShowBossRaidModal(false)
                    triggerToast('Đã ghi nhận đăng ký tham gia săn Boss Aqua City tuần này!')
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Tham Gia Săn Boss Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
