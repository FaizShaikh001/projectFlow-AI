import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Bot, CalendarIcon, DollarSign } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your project portfolio and check statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/ai-assistant">
            <Button variant="outline" className="bg-primary/5 border-primary/20 hover:bg-primary/10">
              <Bot className="w-4 h-4 mr-2 text-primary" />
              Generate with AI
            </Button>
          </Link>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'} className="mb-2">
                    {project.status?.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 h-10">
                  {project.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 border-t flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5"/> End Date</span>
                  <span className="font-medium">{formatDate(project.end_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-3.5 h-3.5"/> Budget</span>
                  <span className="font-medium">{formatCurrency(project.budget || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client</span>
                  {/* @ts-ignore */}
                  <span className="font-medium">{project.customers?.name || "None"}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!projects || projects.length === 0) && !error && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">You haven't created any projects yet.</p>
            <Link href="/ai-assistant">
              <Button><Bot className="w-4 h-4 mr-2" /> Use AI to create one</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
