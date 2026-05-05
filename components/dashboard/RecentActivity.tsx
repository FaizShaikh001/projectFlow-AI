import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { CheckCircle2, CircleDashed, FileText } from "lucide-react"

export default async function RecentActivity({ className }: { className?: string }) {
  // Fetch a mix of recent activities (simplified by just taking recent tasks for now)
  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('id, name, status, created_at, projects(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <Card className={`bg-secondary/30 border-border ${className}`}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest tasks and updates across projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentTasks?.map((task) => (
            <div key={task.id} className="flex items-center">
              <span className="relative flex h-2 w-2 mr-4">
                 {task.status === 'done' ? (
                   <CheckCircle2 className="text-green-500 h-4 w-4 absolute -top-1 -left-1" />
                 ) : (
                   <CircleDashed className="text-blue-500 h-4 w-4 absolute -top-1 -left-1" />
                 )}
              </span>
              <div className="ml-2 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {task.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* @ts-ignore */}
                  Project: {task.projects?.name}
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">
                {formatDate(task.created_at)}
              </div>
            </div>
          ))}

          {(!recentTasks || recentTasks.length === 0) && (
             <div className="text-center text-sm text-muted-foreground py-10">
               No recent activity found.
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
