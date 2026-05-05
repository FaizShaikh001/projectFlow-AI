import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import DownloadPDFBtn from "@/components/invoices/DownloadPDFBtn"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*), projects(*)')
    .eq('id', params.id)
    .single()

  if (!invoice) notFound()

  const { data: items } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoice.id)

  const taxAmount = (invoice.amount * (invoice.tax_rate || 0)) / 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       <div className="flex justify-between items-end mb-8">
         <div>
            <div className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
              <Link href="/invoices" className="hover:underline">Invoices</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Inv #{invoice.invoice_number}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoice_number}</h2>
         </div>
         <div className="flex gap-3">
            <DownloadPDFBtn invoice={invoice} items={items || []} />
         </div>
       </div>

       <Card>
         <CardContent className="p-8 space-y-8">
           {/* Header Info */}
           <div className="flex justify-between border-b pb-8">
             <div>
               <h3 className="text-xl font-bold text-muted-foreground mb-4">BILL TO</h3>
               {/* @ts-ignore */}
               <div className="font-semibold text-lg">{invoice.customers?.name}</div>
               {/* @ts-ignore */}
               <div className="text-muted-foreground">{invoice.customers?.address}</div>
               {/* @ts-ignore */}
               <div className="text-muted-foreground">{invoice.customers?.email}</div>
             </div>
             <div className="text-right">
               <div className="mb-4">
                 <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'} className="text-sm px-3 py-1">
                   {invoice.status?.toUpperCase()}
                 </Badge>
               </div>
               <div className="text-sm text-muted-foreground">Invoice Date</div>
               <div className="font-medium mb-2">{formatDate(invoice.created_at)}</div>
               <div className="text-sm text-muted-foreground">Due Date</div>
               <div className="font-medium">{formatDate(invoice.due_date)}</div>
             </div>
           </div>

           {/* Items Table */}
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Description</TableHead>
                 <TableHead className="text-right">Qty / Hrs</TableHead>
                 <TableHead className="text-right">Rate</TableHead>
                 <TableHead className="text-right">Amount</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {items?.map(item => (
                 <TableRow key={item.id}>
                   <TableCell className="font-medium">{item.description}</TableCell>
                   <TableCell className="text-right">{item.quantity}</TableCell>
                   <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                   <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>

           {/* Totals */}
           <div className="flex justify-end pt-4">
             <div className="w-64 space-y-3">
               <div className="flex justify-between text-muted-foreground">
                 <span>Subtotal</span>
                 <span>{formatCurrency(invoice.amount)}</span>
               </div>
               <div className="flex justify-between text-muted-foreground">
                 <span>Tax ({invoice.tax_rate || 0}%)</span>
                 <span>{formatCurrency(taxAmount)}</span>
               </div>
               <div className="flex justify-between text-xl font-bold border-t pt-3">
                 <span>Total</span>
                 <span>{formatCurrency(invoice.total_amount)}</span>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
  )
}
