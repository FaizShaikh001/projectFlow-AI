"use client"

import { useChat } from 'ai/react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area" // We will use a native div for scroll to avoid complex radix deps setup for now
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User, Loader2, Sparkles, CheckCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Hello! I\'m your AI Project Manager. Would you like to create a new project plan?' }
    ]
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Watch for the magic keyword
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && lastMessage.content.includes("GENERATING_PLAN_NOW")) {
      generateProjectPlan()
    }
  }, [messages])

  async function generateProjectPlan() {
    setIsGeneratingPlan(true)
    try {
      const summary = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        body: JSON.stringify({ context: summary }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!res.ok) throw new Error("Failed to generate")
      const planData = await res.json()
      setGeneratedPlan(planData)
      toast.success("Project plan generated successfully!")
    } catch (e) {
      toast.error("Failed to generate plan.")
      console.error(e)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  async function handleSavePlan() {
    setIsSaving(true)
    try {
      if (!generatedPlan) return

      // 1. Create Customer (mock or check if exists, we'll just create a new one for simplicity)
      const { data: customer, error: cErr } = await supabase
        .from('customers')
        .insert({ name: generatedPlan.project.name + " Client" })
        .select()
        .single()
      if (cErr) throw cErr

      // 2. Create Project
      const { data: project, error: pErr } = await supabase
        .from('projects')
        .insert({
          customer_id: customer.id,
          name: generatedPlan.project.name,
          description: generatedPlan.project.description,
          budget: generatedPlan.project.budget,
          start_date: generatedPlan.project.start_date,
          end_date: generatedPlan.project.end_date,
          status: 'planning'
        })
        .select()
        .single()
      if (pErr) throw pErr

      // 3. Create Milestones
      const milestonesWithIds = await Promise.all(
        generatedPlan.milestones.map(async (m: any) => {
          const { data: ms } = await supabase
            .from('milestones')
            .insert({ project_id: project.id, name: m.name, description: m.description, due_date: m.due_date })
            .select().single()
          return ms
        })
      )

      // 4. Create Tasks
      for (const t of generatedPlan.tasks) {
        // Find matching milestone if possible
        const ms = milestonesWithIds.find(m => m?.name === t.milestone_name) // might be null
        await supabase.from('tasks').insert({
          project_id: project.id,
          milestone_id: ms?.id || null,
          name: t.name,
          description: t.description,
          start_date: t.start_date,
          end_date: t.end_date,
          estimated_hours: t.estimated_hours,
          priority: t.priority || 'medium',
          status: 'todo'
        })
      }

      toast.success("Project saved to system!")
      setGeneratedPlan(null) // clear to reset

    } catch (err) {
      toast.error("Error saving project to database.")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.filter(m => !m.content.includes("GENERATING_PLAN_NOW")).map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border text-foreground'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`rounded-lg p-3 ${
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border text-foreground'
              }`}>
                <p className="text-sm lg:text-base whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-muted border text-foreground flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-muted border rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        {isGeneratingPlan && (
           <div className="flex justify-center p-4">
             <div className="bg-primary/10 text-primary px-4 py-2 border border-primary/20 rounded-full flex items-center gap-2 shadow-sm">
               <Sparkles className="w-4 h-4 animate-pulse" />
               <span className="text-sm font-medium">Synthesizing Project Plan parameters via NIM...</span>
             </div>
           </div>
        )}
        {generatedPlan && (
          <div className="mx-8 my-4 border rounded-xl overflow-hidden bg-card shadow-lg p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold">{generatedPlan.project.name}</h3>
                <p className="text-muted-foreground text-sm">{generatedPlan.project.description}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg text-emerald-600">${generatedPlan.project.budget}</div>
                <div className="text-xs text-muted-foreground">{generatedPlan.project.start_date} to {generatedPlan.project.end_date}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><LocationIcon /> Milestones ({generatedPlan.milestones.length})</h4>
              <div className="grid grid-cols-2 gap-2">
                {generatedPlan.milestones.map((m: any, i: number) => (
                  <div key={i} className="text-sm border p-2 rounded bg-muted/50">
                    <span className="font-medium block">{m.name}</span>
                    <span className="text-xs text-muted-foreground">Due: {m.due_date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><TaskIcon /> Generated Tasks ({generatedPlan.tasks.length})</h4>
              <div className="space-y-2">
                {generatedPlan.tasks.slice(0, 3).map((t: any, i: number) => (
                  <div key={i} className="text-sm border p-2 rounded flex justify-between items-center bg-background">
                    <span>{t.name}</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">{t.estimated_hours}h</span>
                  </div>
                ))}
                {generatedPlan.tasks.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground p-2 border border-dashed rounded bg-muted/20">
                    + {generatedPlan.tasks.length - 3} more tasks
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-sm text-primary/80 italic font-medium">
              {generatedPlan.timeline_summary}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setGeneratedPlan(null)}>Discard</Button>
              <Button onClick={handleSavePlan} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <CheckCircle className="w-4 h-4 mr-2"/>}
                Confirm & Create Project
              </Button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Input 
            value={input} 
            onChange={handleInputChange} 
            placeholder="Type your response or project details..." 
            disabled={isLoading || isGeneratingPlan || isSaving}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || isGeneratingPlan || isSaving || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

function LocationIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> }
function TaskIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> }
