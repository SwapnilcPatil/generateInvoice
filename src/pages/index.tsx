import { InvoiceGenerator } from "../components/InvoiceGenerator";
import { PrintStyles } from "../components/PrintStyles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PrintStyles />
      <InvoiceGenerator />
    </div>
  );
};

export default Index;