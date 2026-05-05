import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function TimesheetsPage() {
  // Normally we'd filter by logged in user, but no auth means we show all (or could filter mock logic).
  const { data: timesheets } = await supabase
    .from('timesheets')
    .select('*, resources(name), tasks(name, projects(name))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground">Log your hours and track team activity.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-lg p-6 bg-card">
           <h3 className="text-lg font-semibold mb-4">Submit Hours</h3>
           <p className="text-sm text-muted-foreground mb-4">
             Normally this would contain a form to select a task assigned to you and log hours.
             Due to "No Auth" specs, this is simulated or can be accessed via detailed modal.
           </p>
           {/* Form implementation is complex in server component, in a real app we'd use a client component form here */}
           <div className="p-4 bg-muted text-center rounded-md border border-dashed text-sm">
             [Timesheet Form Client Component Goes Here]
           </div>
        </div>

        <div className="md:col-span-2">
           <Card>
             <CardHeader>
               <CardTitle>Recent Entries</CardTitle>
               <CardDescription>All logged hours across the organization</CardDescription>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Resource</TableHead>
                     <TableHead>Project / Task</TableHead>
                     <TableHead>Date</TableHead>
                     <TableHead>Hours</TableHead>
                     <TableHead>Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {timesheets?.map(ts => (
                     <TableRow key={ts.id}>
                       {/* @ts-ignore */}
                       <TableCell className="font-medium">{ts.resources?.name}</TableCell>
                       <TableCell>
                         <div className="text-xs text-muted-foreground">{/* @ts-ignore */}{ts.tasks?.projects?.name}</div>
                         {/* @ts-ignore */}
                         <div>{ts.tasks?.name}</div>
                       </TableCell>
                       <TableCell>{formatDate(ts.date)}</TableCell>
                       <TableCell className="font-semibold">{ts.hours}h</TableCell>
                       <TableCell>
                         <Badge variant={ts.status === 'approved' ? 'default' : 'secondary'}>{ts.status}</Badge>
                       </TableCell>
                     </TableRow>
                   ))}
                   {(!timesheets || timesheets.length === 0) && (
                     <TableRow>
                       <TableCell colSpan={5} className="text-center py-4">No timesheets submitted yet.</TableCell>
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
