import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const { data: resources } = await supabase.from('resources').select('*').order('name')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Resources</h2>
          <p className="text-muted-foreground">Manage employees and their organizational metadata.</p>
        </div>
        <Button>Add Resource</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Rate/hr</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources?.map(resource => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">
                  <div>{resource.name}</div>
                  <div className="text-xs text-muted-foreground">{resource.email}</div>
                </TableCell>
                <TableCell>{resource.role}</TableCell>
                <TableCell>{resource.department}</TableCell>
                <TableCell>${resource.hourly_rate?.toFixed(2)}</TableCell>
                <TableCell>
                  {resource.is_active ? <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
