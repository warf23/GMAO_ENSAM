
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

type PdfDownloadButtonProps = {
  reportRef: React.RefObject<HTMLDivElement>;
};

export function PdfDownloadButton({ reportRef }: PdfDownloadButtonProps) {
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const doc = new jsPDF("p", "mm", "a4");
    // html2canvas scale prop is correct, but TS types are outdated, so override:
    const canvas = await html2canvas(reportRef.current as HTMLElement, { scale: 2, backgroundColor: "#fff" } as any);
    // getImageProperties isn't typed in older types, so we check and fallback
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210, pdfHeight = 297;
    let imgProps: { width: number, height: number; };
    if ("getImageProperties" in doc) {
      imgProps = (doc as any).getImageProperties(imgData);
    } else {
      // fallback
      imgProps = { width: canvas.width, height: canvas.height };
    }
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pdfHeight - 10));
    doc.save("rapport-tableau-de-bord.pdf");
  };
  return (
    <Button onClick={handleDownloadPDF} variant="outline">
      <Download className="mr-2" />
      Télécharger le rapport PDF
    </Button>
  );
}
