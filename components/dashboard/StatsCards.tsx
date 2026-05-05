import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { FolderKanban, DollarSign, Activity, Users, ListTodo, FileText } from "lucide-react"

interface StatsCardsProps {
  totalProjects: number
  activeProjects: number
  totalRevenue: number
  pendingRevenue: number
  pendingTasks: number
  totalResources: number
}

export default function StatsCards({
  totalProjects,
  activeProjects,
  totalRevenue,
  pendingRevenue,
  pendingTasks,
  totalResources
}: StatsCardsProps) {
  const cards = [
    {
      title: "Active Projects",
      value: activeProjects,
      description: `Out of ${totalProjects} total`,
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Lifetime earnings",
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Invoices",
      value: formatCurrency(pendingRevenue),
      description: "Awaiting payment",
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      description: "To-Do or In Progress",
      icon: ListTodo,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Total Resources",
      value: totalResources,
      description: "Active team members",
      icon: Users,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-secondary/30 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-1.5 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mt-2">
              <div className="text-2xl font-bold">{card.value}</div>
              <span className={`text-xs flex items-center ${card.color}`}>
                {card.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
