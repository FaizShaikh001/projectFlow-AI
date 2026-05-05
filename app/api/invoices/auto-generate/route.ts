import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Note: in a real app, you might want to use a service role key for cron/auto tasks
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    // 1. Fetch all active projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, customer_id, budget')
      .in('status', ['active']);

    if (projectsError) throw projectsError;

    if (!projects || projects.length === 0) {
      return NextResponse.json({ message: 'No active projects found to invoice.' });
    }

    let createdCount = 0;

    // 2. Determine which projects need an invoice (simplified logic)
    for (const project of projects) {
      // In a real scenario, you'd check the billing period dates.
      // Here, we'll check if any invoice exists for this project this month.
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const { data: existingInvoices } = await supabase
        .from('invoices')
        .select('id')
        .eq('project_id', project.id)
        .gte('created_at', startOfMonth.toISOString());

      if (!existingInvoices || existingInvoices.length === 0) {
        // Create a new invoice
        const invoiceAmount = (project.budget || 1000) * 0.1; // Example: bill 10% of budget

        // Make due date 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            project_id: project.id,
            customer_id: project.customer_id,
            invoice_number: `INV-${Date.now().toString().slice(-6)}`,
            amount: invoiceAmount,
            tax_rate: 10, // 10% tax
            total_amount: invoiceAmount * 1.1,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'draft',
            notes: 'Auto-generated monthly invoice'
          })
          .select()
          .single();

        if (invoiceError) {
          console.error("Failed to create invoice:", invoiceError);
          continue;
        }

        // Add a generic line item
        await supabase
          .from('invoice_items')
          .insert({
            invoice_id: invoice.id,
            description: `Auto-generated billing for ${project.name}`,
            quantity: 1,
            unit_price: invoiceAmount,
            total: invoiceAmount
          });

        createdCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully auto-generated ${createdCount} invoices.` 
    });

  } catch (error: any) {
    console.error('Auto-generate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
