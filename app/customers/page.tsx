import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const { data: customers } = await supabase
    .from('customers')
    .select('*, projects(count)')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your client organizations.</p>
        </div>
        <Button>Add Customer</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers?.map(customer => (
          <Card key={customer.id}>
            <CardHeader className="pb-3">
               <CardTitle className="flex justify-between">
                 <span>{customer.name}</span>
               </CardTitle>
               <CardDescription>
                 {/* @ts-ignore */}
                 {customer.projects[0].count} Active Projects
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
               <div className="flex items-center gap-2">
                 <Mail className="w-4 h-4"/> {customer.email || "No email"}
               </div>
               <div className="flex items-center gap-2">
                 <Phone className="w-4 h-4"/> {customer.phone || "No phone"}
               </div>
               <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 truncate"/> <span className="truncate">{customer.address || "No address"}</span>
               </div>
               <div className="pt-4 flex justify-end">
                 <Link href={`/customers/${customer.id}`}>
                   <Button variant="ghost" size="sm" className="w-full">
                     View Portal <ExternalLink className="w-3 h-3 ml-2" />
                   </Button>
                 </Link>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
