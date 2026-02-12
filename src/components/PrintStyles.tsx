import { useEffect } from 'react';

export const PrintStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .invoice-container {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: none !important;
        }
        
        .print\\:hidden {
          display: none !important;
        }
        
        .print\\:border-none {
          border: none !important;
        }
        
        /* Thermal printer specific styles */
        @page {
          size: 80mm auto;
          margin: 5mm;
        }
        
        /* For A4 printers, use standard page */
        @page :first {
          size: A4;
          margin: 15mm;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 4px 6px;
          font-size: 11px;
        }
        
        th {
          background-color: #f5f5f5 !important;
          font-weight: bold;
        }
        
        input, textarea {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
          font-family: inherit !important;
          font-size: inherit !important;
          color: inherit !important;
          outline: none !important;
          box-shadow: none !important;
          resize: none !important;
        }
        
        .text-invoice-header {
          color: #2563eb !important;
        }
        
        .text-invoice-text {
          color: #1f2937 !important;
        }
        
        .text-invoice-muted {
          color: #6b7280 !important;
        }
        
        .bg-invoice-section {
          background-color: #f8fafc !important;
        }
        
        .border-invoice-border {
          border-color: #e2e8f0 !important;
        }
      }
      
      /* Thermal printer specific optimizations */
      @media print and (max-width: 80mm) {
        body {
          font-size: 10px;
        }
        
        .invoice-container {
          padding: 2mm !important;
        }
        
        h1, h2, h3 {
          font-size: 14px;
          margin: 2mm 0;
        }
        
        table th, table td {
          padding: 1mm 2mm;
          font-size: 9px;
        }
        
        .totals-section {
          margin-top: 3mm;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};