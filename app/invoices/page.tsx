import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Eye } from "lucide-react"
import AutoGenerateInvoicesButton from "@/components/invoices/AutoGenerateInvoicesButton"

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, customers(name), projects(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Manage billing and export PDFs.</p>
        </div>
        <div className="flex gap-2">
          <AutoGenerateInvoicesButton />
          <Button>Create Invoice</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium text-primary">{inv.invoice_number}</TableCell>
                {/* @ts-ignore */}
                <TableCell>{inv.customers?.name}</TableCell>
                {/* @ts-ignore */}
                <TableCell className="text-muted-foreground text-sm">{inv.projects?.name}</TableCell>
                <TableCell>{formatDate(inv.due_date)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(inv.total_amount)}</TableCell>
                <TableCell>
                  <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'outline'}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/invoices/${inv.id}`}>
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4"/></Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Download className="w-4 h-4"/></Button>
                </TableCell>
              </TableRow>
            ))}
            {(!invoices || invoices.length === 0) && (
              <TableRow>
                 <TableCell colSpan={7} className="text-center py-6">No invoices created.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
