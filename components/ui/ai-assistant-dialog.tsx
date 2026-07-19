"use client"

import * as React from "react"
import { Sparkles, Send, Mail, MessageCircle, FileText, PhoneCall } from "lucide-react"
import { useCompletion } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AIAssistantDialog() {
  const [action, setAction] = React.useState("email")
  const [context, setContext] = React.useState("")
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/generate',
  })

  const handleGenerate = () => {
    if (!context) return
    complete(`Action: ${action}\nContext: ${context}`)
  }

  return (
    <Dialog>
      {/* @ts-ignore */}
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 rounded-full shadow-lg gap-2 text-base px-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
          <Sparkles className="h-5 w-5" /> Trợ lý AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" /> 
            Trợ lý AI - CRM 360°
          </DialogTitle>
          <DialogDescription>
            Tự động sinh nội dung chăm sóc khách hàng dựa trên dữ liệu CRM.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Hành động</label>
            <Select value={action} onValueChange={(val) => setAction(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500"/> Soạn Email gửi bảng giá</div>
                </SelectItem>
                <SelectItem value="zalo">
                  <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-blue-400"/> Soạn tin Zalo hỏi thăm</div>
                </SelectItem>
                <SelectItem value="proposal">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-orange-500"/> Sinh Proposal đầu tư</div>
                </SelectItem>
                <SelectItem value="summary">
                  <div className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-green-500"/> Tóm tắt cuộc gọi/Meeting</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ngữ cảnh bổ sung</label>
            <Textarea 
              placeholder="Ví dụ: Khách quan tâm căn biệt thự song lập Aqua City, hướng Đông Nam..." 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading || !context} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? "Đang xử lý bằng AI..." : "Tạo Nội Dung"}
            <Send className="h-4 w-4 ml-2" />
          </Button>

          {completion && (
            <div className="mt-4 p-4 rounded-md bg-muted/50 border border-muted text-sm whitespace-pre-wrap max-h-[250px] overflow-y-auto">
              {completion}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
