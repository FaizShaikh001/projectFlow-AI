import { Database } from "./database.types"

export type Customer = Database['public']['Tables']['customers']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Timesheet = Database['public']['Tables']['timesheets']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row']
export type ChatHistory = Database['public']['Tables']['chat_history']['Row']

export type ProjectWithDetails = Project & {
  customer?: Customer
  manager?: Resource
  delivery_manager_resource?: Resource
}

export type TaskWithDetails = Task & {
  resource?: Resource | null
  milestone?: Milestone | null
}
