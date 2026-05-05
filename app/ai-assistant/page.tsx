import ChatInterface from "@/components/chat/ChatInterface"

export default function AIAssistantPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">
          Chat with the AI manager to automatically scope and orchestrate your projects.
        </p>
      </div>
      
      <div className="flex-1 min-h-0 bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <ChatInterface />
      </div>
    </div>
  )
}
