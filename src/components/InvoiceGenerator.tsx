import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Plus, Printer, Trash2, Upload } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CompanyInfo {
  logo?: string;
  name: string;
  address: string;
  contact: string;
  gst: string;
}

interface CustomerInfo {
  name: string;
  address: string;
  contact: string;
  gst?: string;
}

export const InvoiceGenerator = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [signature, setSignature] = useState<string | null>(null);
const [seal, setSeal] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyInfo>({
    name: "Your Company Name",
    address: "123 Business Street\nCity, State 12345",
    contact: "Phone: +1 234 567 8900\nEmail: info@company.com",
    gst: "GST123456789"
  });
console.log(seal,'seal');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "Customer Name",
    address: "Customer Address\nCity, State 12345",
    contact: "Phone: +1 234 567 8900",
    gst: "GST987654321"
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "Product/Service Description", quantity: 1, rate: 100, amount: 100 }
  ]);

  const [taxRate, setTaxRate] = useState(18);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompany(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
 


  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id)) + 1;
    setLineItems([...lineItems, {
      id: newId,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
    // toast({
    //   title: "Print initiated",
    //   description: "Invoice has been sent to printer",
    // });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-invoice-text">Invoice Generator</h1>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Container */}
      <Card className="invoice-container">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-start gap-4">
              {company.logo ? (
                <img src={company.logo} alt="Company Logo" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-invoice-section border-2 border-dashed border-invoice-border flex items-center justify-center print:hidden">
                  <Upload className="h-6 w-6 text-invoice-muted" />
                </div>
              )}
              <div className="space-y-2">
                <Input
                  value={company.name}
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold border-none p-0 h-auto text-invoice-text print:border-none"
                />
                <Textarea
                  value={company.address}
                  onChange={(e) => setCompany(prev => ({ ...prev, address: e.target.value }))}
                  className="text-sm border-none p-0 resize-none text-invoice-muted print:border-none"
                  rows={2}
                />
                <Textarea
                  value={company.contact}
                  onChange={(e) => setCompany(prev => ({ ...prev, contact: e.target.value }))}
                  className="text-sm border-none p-0 resize-none text-invoice-muted print:border-none"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <h2 className="text-3xl font-bold text-invoice-header">INVOICE</h2>
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Invoice #:</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-24 h-6 text-sm border-none p-0"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">Date:</Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-32 h-6 text-sm border-none p-0"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Label className="text-sm font-medium">GST:</Label>
                  <Input
                    value={company.gst}
                    onChange={(e) => setCompany(prev => ({ ...prev, gst: e.target.value }))}
                    className="w-32 h-6 text-sm border-none p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload - Hidden in Print */}
          <div className="mb-6 print:hidden">
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-invoice-muted hover:text-invoice-text">
                <Upload className="h-4 w-4" />
                Upload Company Logo
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </Label>
          </div>

          <Separator className="mb-8" />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-invoice-text mb-3">Bill To:</h3>
              <div className="space-y-2">
                <Input
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="font-medium border-none p-0 h-auto text-invoice-text"
                  placeholder="Customer Name"
                />
                <Textarea
                  value={customer.address}
                  onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="text-sm border-none p-0 resize-none text-invoice-muted"
                  rows={2}
                  placeholder="Customer Address"
                />
                <Textarea
                  value={customer.contact}
                  onChange={(e) => setCustomer(prev => ({ ...prev, contact: e.target.value }))}
                  className="text-sm border-none p-0 resize-none text-invoice-muted"
                  rows={2}
                  placeholder="Customer Contact"
                />
                <Input
                  value={customer.gst || ""}
                  onChange={(e) => setCustomer(prev => ({ ...prev, gst: e.target.value }))}
                  className="text-sm border-none p-0 h-auto text-invoice-muted"
                  placeholder="Customer GST (Optional)"
                />
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-invoice-text">Items</h3>
              <Button onClick={addLineItem} variant="outline" size="sm" className="gap-2 print:hidden">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="border border-invoice-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-invoice-section">
                  <tr>
                    <th className="text-left p-3 font-medium text-invoice-text">Description</th>
                    <th className="text-center p-3 font-medium text-invoice-text w-20">Qty</th>
                    <th className="text-right p-3 font-medium text-invoice-text w-24">Rate</th>
                    <th className="text-right p-3 font-medium text-invoice-text w-24">Amount</th>
                    <th className="w-10 print:hidden"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-t border-invoice-border">
                      <td className="p-3">
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="border-none p-0 h-auto text-invoice-text"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="border-none p-0 h-auto text-center w-full"
                          min="1"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="border-none p-0 h-auto text-right w-full"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-3 text-right font-medium text-invoice-text">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="p-3 print:hidden">
                        {lineItems.length > 1 && (
                          <Button
                            onClick={() => removeLineItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-invoice-text">Subtotal:</span>
                <span className="font-medium text-invoice-text">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-invoice-text">Tax</span>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 h-6 text-xs border-none p-0 text-center print:border-none"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="text-invoice-text">%:</span>
                </div>
                <span className="font-medium text-invoice-text">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-invoice-text">Total:</span>
                <span className="text-invoice-header">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-invoice-border">
            <p className="text-sm text-invoice-muted text-center">
              Thank you for your business!
            </p>
          </div>
        </CardContent>
        {/* Signature and Seal Upload - Hidden in Print */}
    

<div className="mt-6 flex justify-between items-end">
  <div>
    <Label htmlFor="signature-upload" className="cursor-pointer text-sm text-invoice-muted hover:text-invoice-text print:hidden">
      Upload Signature
    </Label>
    <input
      id="signature-upload"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSignature(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }}
      className="hidden"
    />
    {signature && (
      <img src={signature} alt="Signature" className="mt-2 w-32" />
    )}
  </div>

  <div>
    <Label htmlFor="seal-upload" className="cursor-pointer text-sm text-invoice-muted hover:text-invoice-text print:hidden">
      Upload Seal
    </Label>
    <input
      id="seal-upload"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSeal(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }}
      className="hidden"
    />
    {seal && (
      <img src={seal} alt="Company Seal" className="mt-2 w-16 h-16 object-contain" />
    )}
  </div>
</div>


      </Card>
    </div>
  );
};