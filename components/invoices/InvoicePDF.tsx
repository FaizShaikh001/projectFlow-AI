import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '@/lib/utils';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  companyInfo: {
    fontSize: 10,
    color: '#666666',
    marginTop: 8,
  },
  billTo: {
    marginBottom: 40,
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  clientDetails: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  detailCol: {
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: 10,
    color: '#666666',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  table: {
    width: 'auto',
    marginBottom: 40,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 8,
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  colTextHeader: { fontSize: 10, fontWeight: 'bold' },
  colText: { fontSize: 10 },
  totals: {
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  totalLabel: { fontSize: 10, color: '#666666' },
  totalValue: { fontSize: 10 },
  finalTotalValue: { fontSize: 14, fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999999',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  }
});

interface InvoicePDFProps {
  invoice: any;
  items: any[];
}

export const InvoicePDF = ({ invoice, items }: InvoicePDFProps) => {
  const taxAmount = (invoice.amount * (invoice.tax_rate || 0)) / 100;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.companyInfo}>ProjectFlow AI Inc.</Text>
            <Text style={styles.companyInfo}>123 Tech Lane, San Francisco, CA</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>#{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Bill To & Details */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.billTo}>
            <Text style={styles.billToTitle}>BILL TO</Text>
            <Text style={styles.clientName}>{invoice.customers?.name}</Text>
            {invoice.customers?.address && <Text style={styles.clientDetails}>{invoice.customers.address}</Text>}
            {invoice.customers?.email && <Text style={styles.clientDetails}>{invoice.customers.email}</Text>}
            {invoice.projects?.name && <Text style={[styles.clientDetails, { marginTop: 12 }]}>Project: {invoice.projects.name}</Text>}
          </View>

          <View style={styles.invoiceDetails}>
            <View style={styles.detailCol}>
               <Text style={styles.detailLabel}>Invoice Date</Text>
               <Text style={styles.detailValue}>{formatDate(invoice.created_at)}</Text>
               <View style={{ height: 16 }} />
               <Text style={styles.detailLabel}>Due Date</Text>
               <Text style={styles.detailValue}>{formatDate(invoice.due_date)}</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <View style={styles.colDesc}><Text style={styles.colTextHeader}>Description</Text></View>
            <View style={styles.colQty}><Text style={styles.colTextHeader}>Qty / Hrs</Text></View>
            <View style={styles.colPrice}><Text style={styles.colTextHeader}>Rate</Text></View>
            <View style={styles.colTotal}><Text style={styles.colTextHeader}>Amount</Text></View>
          </View>
          
          {items?.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.colDesc}><Text style={styles.colText}>{item.description}</Text></View>
              <View style={styles.colQty}><Text style={styles.colText}>{item.quantity}</Text></View>
              <View style={styles.colPrice}><Text style={styles.colText}>{formatCurrency(item.unit_price)}</Text></View>
              <View style={styles.colTotal}><Text style={styles.colText}>{formatCurrency(item.total)}</Text></View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.amount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({invoice.tax_rate || 0}%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(taxAmount)}</Text>
          </View>
          <View style={styles.totalRowFinal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>{formatCurrency(invoice.total_amount)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business. Please remit payment by {formatDate(invoice.due_date)}.</Text>
          {invoice.notes && <Text style={{ marginTop: 8 }}>Notes: {invoice.notes}</Text>}
        </View>
      </Page>
    </Document>
  );
};
