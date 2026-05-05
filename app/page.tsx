import { supabase } from "@/lib/supabase"
import StatsCards from "@/components/dashboard/StatsCards"
import ProjectsChart from "@/components/dashboard/ProjectsChart"
import RecentActivity from "@/components/dashboard/RecentActivity"

export const dynamic = 'force-dynamic'; // Disable static rendering since we fetch live DB data

export default async function DashboardPage() {
  // Fetch overview stats
  const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true })
  const { count: activeProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['planning', 'active'])
  const { data: invoices } = await supabase.from('invoices').select('amount, status')
  const { count: pendingTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).in('status', ['todo', 'in_progress'])
  const { count: totalResources } = await supabase.from('resources').select('*', { count: 'exact', head: true })
  
  const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  const pendingRevenue = invoices?.filter(i => i.status === 'draft' || i.status === 'sent').reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back. Here is the overview of your operations.
        </p>
      </div>

      <StatsCards 
        totalProjects={totalProjects || 0}
        activeProjects={activeProjects || 0}
        totalRevenue={totalRevenue}
        pendingRevenue={pendingRevenue}
        pendingTasks={pendingTasks || 0}
        totalResources={totalResources || 0}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ProjectsChart className="col-span-4" />
        <RecentActivity className="col-span-3" />
      </div>
    </div>
  )
}
