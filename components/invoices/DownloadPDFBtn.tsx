"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import dynamic from "next/dynamic"

// dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled><Download className="w-4 h-4 mr-2"/> Preparing PDF...</Button> }
)

import { InvoicePDF } from "./InvoicePDF"

export default function DownloadPDFBtn({ invoice, items }: { invoice: any, items: any[] }) {
  return (
    <PDFDownloadLink document={<InvoicePDF invoice={invoice} items={items} />} fileName={`Invoice-${invoice.invoice_number}.pdf`}>
      {/* @ts-ignore */}
      {({ blob, url, loading, error }) => (
        <Button disabled={loading}>
          <Download className="w-4 h-4 mr-2"/>
          {loading ? 'Preparing document...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
