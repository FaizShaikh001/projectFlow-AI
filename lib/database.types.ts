export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          customer_id: string | null
          delivery_manager: string | null
          description: string | null
          end_date: string
          id: string
          name: string
          project_manager: string | null
          purpose: string | null
          start_date: string
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          vendor: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          delivery_manager?: string | null
          description?: string | null
          end_date: string
          id?: string
          name: string
          project_manager?: string | null
          purpose?: string | null
          start_date: string
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          vendor?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          delivery_manager?: string | null
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          project_manager?: string | null
          purpose?: string | null
          start_date?: string
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          vendor?: string | null
        }
      }
      resources: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          role: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
        }
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          project_id: string | null
          status: 'pending' | 'in_progress' | 'completed' | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          project_id?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          project_id?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | null
        }
      }
      tasks: {
        Row: {
          actual_hours: number | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          milestone_id: string | null
          name: string
          priority: 'low' | 'medium' | 'high' | 'critical' | null
          project_id: string | null
          resource_id: string | null
          start_date: string | null
          status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | null
        }
        Insert: {
          actual_hours?: number | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone_id?: string | null
          name: string
          priority?: 'low' | 'medium' | 'high' | 'critical' | null
          project_id?: string | null
          resource_id?: string | null
          start_date?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | null
        }
        Update: {
          actual_hours?: number | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          milestone_id?: string | null
          name?: string
          priority?: 'low' | 'medium' | 'high' | 'critical' | null
          project_id?: string | null
          resource_id?: string | null
          start_date?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | null
        }
      }
      timesheets: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          hours: number
          id: string
          project_id: string | null
          resource_id: string | null
          status: 'draft' | 'submitted' | 'approved' | 'rejected' | null
          task_id: string | null
          week_start: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          hours: number
          id?: string
          project_id?: string | null
          resource_id?: string | null
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | null
          task_id?: string | null
          week_start?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          hours?: number
          id?: string
          project_id?: string | null
          resource_id?: string | null
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | null
          task_id?: string | null
          week_start?: string | null
        }
      }
      invoices: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          customer_id: string | null
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          project_id: string | null
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          tax_rate: number | null
          total_amount: number
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          project_id?: string | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          tax_rate?: number | null
          total_amount: number
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          project_id?: string | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          tax_rate?: number | null
          total_amount?: number
        }
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string | null
          quantity: number | null
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          total: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          total?: number
          unit_price?: number
        }
      }
      chat_history: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: 'user' | 'assistant' | 'system'
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: 'user' | 'assistant' | 'system'
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: 'user' | 'assistant' | 'system'
          session_id?: string
        }
      }
    }
  }
}
