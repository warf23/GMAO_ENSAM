
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const PdfDownloadButton = () => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const element = document.getElementById('dashboard-content');
      if (!element) {
        throw new Error('Dashboard content not found');
      }

      toast({
        title: "Génération du PDF en cours...",
        description: "Veuillez patienter un instant",
      });

      const canvas = await html2canvas(element);
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('tableau-de-bord.pdf');

      toast({
        title: "PDF généré avec succès",
        description: "Le téléchargement devrait commencer automatiquement",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la génération du PDF",
        description: "Veuillez réessayer ultérieurement",
      });
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download size={16} />
      Télécharger en PDF
    </Button>
  );
};
