import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ChevronRight, Calendar, DollarSign, Users, Target, Activity } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: project, error: pError } = await supabase
    .from('projects')
    .select('*, customers(name)')
    .eq('id', params.id)
    .single()

  if (pError || !project) {
    notFound()
  }

  const { data: milestones } = await supabase.from('milestones').select('*').eq('project_id', project.id).order('due_date')
  const { data: tasks } = await supabase.from('tasks').select('*, resources(name)').eq('project_id', project.id).order('start_date')
  const { data: timesheets } = await supabase.from('timesheets').select('*, tasks(name)').eq('project_id', project.id)

  // Calcs
  const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = milestones?.length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  
  // Calculate spent budget
  let totalHours = 0;
  timesheets?.forEach(t => totalHours += Number(t.hours));
  // A real app would multiply hours by resource rate. Assuming $100/hr avg for simplicity if no rate joined.
  const estimatedSpent = totalHours * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
        <Link href="/projects" className="hover:underline">Projects</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{project.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            {project.name}
            <Badge variant="outline">{project.status}</Badge>
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            {project.description}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4"/> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{formatDate(project.start_date)} - {formatDate(project.end_date)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4"/> Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{formatCurrency(estimatedSpent)} / {formatCurrency(project.budget || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4"/> Milestone Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{progressPercent}% ({completedMilestones}/{totalMilestones})</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4"/> Team
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="font-semibold truncate">PM: {project.project_manager || "Unassigned"}</div>
             <div className="text-sm text-muted-foreground truncate">DM: {project.delivery_manager || "Unassigned"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tasks List</CardTitle>
            <CardDescription>All tasks required for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell><Badge variant="outline">{task.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(task.start_date)} - {formatDate(task.end_date)}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{task.resources?.name || <span className="text-muted-foreground italic text-xs">Unassigned</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Key delivery dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 border-l-2 border-muted pl-4 ml-2">
              {milestones?.map(m => (
                <div key={m.id} className="relative">
                  <span className={`absolute -left-[1.37rem] w-3 h-3 rounded-full ${m.status === 'completed' ? 'bg-primary' : 'bg-muted border border-foreground/30'}`}></span>
                  <h4 className="font-semibold text-sm">{m.name}</h4>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                  <div className="text-xs font-medium mt-1 text-primary/80">{formatDate(m.due_date)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
