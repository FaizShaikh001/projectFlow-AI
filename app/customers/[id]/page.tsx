import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function CustomerPortalPage({ params }: { params: { id: string } }) {
  const { data: customer, error } = await supabase.from('customers').select('*').eq('id', params.id).single()
  
  if (!customer || error) notFound()

  const { data: projects } = await supabase.from('projects').select('*, milestones(id, status)').eq('customer_id', customer.id).order('created_at', { ascending: false })
  const { data: invoices } = await supabase.from('invoices').select('*').eq('customer_id', customer.id).order('due_date', { ascending: false })

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 lg:p-8">
       {/* Portal Header */}
       <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <h1 className="text-4xl font-bold mb-2">Customer Portal</h1>
         <p className="text-primary-foreground/80 text-lg">Welcome back, {customer.name}</p>
       </div>

       <div className="space-y-6">
         <h3 className="text-2xl font-semibold">Your Active Projects</h3>
         {projects?.map(project => {
            const milestones = project.milestones || [];
            const completed = milestones.filter((m:any) => m.status === 'completed').length;
            const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;

            return (
              <Card key={project.id} className="overflow-hidden">
                 <CardHeader className="bg-muted/30 border-b">
                   <div className="flex justify-between items-center">
                     <div>
                       <CardTitle>{project.name}</CardTitle>
                       <CardDescription>{project.description}</CardDescription>
                     </div>
                     <Badge>{project.status?.toUpperCase().replace('_', ' ')}</Badge>
                   </div>
                 </CardHeader>
                 <CardContent className="p-6">
                    <div className="mb-4">
                       <div className="flex justify-between text-sm mb-2">
                         <span className="font-semibold">Project Progress</span>
                         <span>{progress}%</span>
                       </div>
                       <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                         <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`}}></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                       <div>
                         <span className="text-muted-foreground block">Start Date</span>
                         <span className="font-medium">{formatDate(project.start_date)}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block">Target End</span>
                         <span className="font-medium">{formatDate(project.end_date)}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block">Project Manager</span>
                         <span className="font-medium">{project.project_manager || "TBD"}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block">Delivery Manager</span>
                         <span className="font-medium">{project.delivery_manager || "TBD"}</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            )
         })}
         {(!projects || projects.length === 0) && (
           <p className="text-muted-foreground italic">No active projects found.</p>
         )}
       </div>

       <div className="space-y-6 pt-6">
         <h3 className="text-2xl font-semibold">Billing History</h3>
         <Card>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Invoice #</TableHead>
                 <TableHead>Date</TableHead>
                 <TableHead>Amount</TableHead>
                 <TableHead>Status</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {invoices?.map(inv => (
                 <TableRow key={inv.id}>
                   <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                   <TableCell>{formatDate(inv.created_at)}</TableCell>
                   <TableCell>{formatCurrency(inv.total_amount)}</TableCell>
                   <TableCell>
                     <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'outline'}>
                       {inv.status}
                     </Badge>
                   </TableCell>
                 </TableRow>
               ))}
               {(!invoices || invoices.length === 0) && (
                 <TableRow>
                   <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No invoices found.</TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </Card>
       </div>
    </div>
  )
}
