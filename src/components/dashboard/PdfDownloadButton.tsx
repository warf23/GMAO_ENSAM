import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

type PdfDownloadButtonProps = {
  stats: {
    activeInterventions: number;
    preventiveInterventions: number;
    correctiveInterventions: number;
    plannedInterventions: number;
    equipmentInBreakdown: number;
    totalEquipment: number;
    lowStockParts: number;
  };
  metrics: {
    trs?: number;
    mtbf?: number;
    mttr?: number;
  };
  period: 'today' | 'week' | 'month';
};

export const PdfDownloadButton = ({ stats, metrics, period }: PdfDownloadButtonProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      toast({
        title: "Préparation du rapport PDF...",
        description: "Veuillez patienter pendant la génération du document",
      });

      // Create PDF document
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title and date
      const currentDate = format(new Date(), "dd/MM/yyyy");
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Rapport du tableau de bord de maintenance", pageWidth / 2, 15, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date du rapport: ${currentDate}`, pageWidth - 20, 10, { align: "right" });
      
      // Add period information
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      let periodText = "Aujourd'hui";
      if (period === "week") periodText = "Cette semaine";
      if (period === "month") periodText = "Ce mois";
      pdf.text(`Période: ${periodText}`, pageWidth / 2, 23, { align: "center" });
      
      // Add statistics section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Statistiques des interventions", 15, 35);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Interventions en cours: ${stats.activeInterventions}`, 20, 42);
      pdf.text(`- Préventives: ${stats.preventiveInterventions}`, 25, 48);
      pdf.text(`- Correctives: ${stats.correctiveInterventions}`, 25, 54);
      pdf.text(`Interventions planifiées: ${stats.plannedInterventions}`, 20, 60);
      pdf.text(`Équipements en panne: ${stats.equipmentInBreakdown} sur ${stats.totalEquipment}`, 20, 66);
      pdf.text(`Pièces en stock critique: ${stats.lowStockParts}`, 20, 72);

      // Add performance metrics section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Indicateurs de performance", 15, 85);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`TRS (Taux de rendement synthétique): ${metrics.trs ? metrics.trs.toFixed(1) : "N/A"}%`, 20, 92);
      pdf.text(`MTBF (Temps moyen entre pannes): ${metrics.mtbf ? metrics.mtbf.toFixed(1) : "N/A"} heures`, 20, 98);
      pdf.text(`MTTR (Temps moyen de réparation): ${metrics.mttr ? metrics.mttr.toFixed(1) : "N/A"} heures`, 20, 104);

      // Capture charts from the dashboard
      let currentY = 115;
      
      try {
        // Capture Pareto chart
        const paretoChart = document.querySelector('[data-chart="pareto"]');
        if (paretoChart) {
          const paretoCanvas = await html2canvas(paretoChart as HTMLElement);
          const paretoImgData = paretoCanvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Analyse Pareto des causes de pannes", 15, currentY);
          
          const imgWidth = 180;
          const imgHeight = (paretoCanvas.height * imgWidth) / paretoCanvas.width;
          pdf.addImage(paretoImgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
          
          currentY += imgHeight + 15;
        }
        
        // Capture Performance Metrics visual chart
        const perfMetricsChart = document.querySelector('[data-chart="performance"]');
        if (perfMetricsChart) {
          // Check if we need a new page
          if (currentY > 200) {
            pdf.addPage();
            currentY = 15;
          }
          
          const metricsCanvas = await html2canvas(perfMetricsChart as HTMLElement);
          const metricsImgData = metricsCanvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Visualisation des indicateurs de performance", 15, currentY);
          
          const imgWidth = 180;
          const imgHeight = (metricsCanvas.height * imgWidth) / metricsCanvas.width;
          pdf.addImage(metricsImgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
          
          currentY += imgHeight + 15;
        }
        
        // Add calendar and interventions on a new page
        pdf.addPage();
        currentY = 15;
        
        // Capture Calendar
        const calendarChart = document.querySelector('[data-chart="calendar"]');
        if (calendarChart) {
          const calendarCanvas = await html2canvas(calendarChart as HTMLElement);
          const calendarImgData = calendarCanvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Calendrier de maintenance", 15, currentY);
          
          const imgWidth = 180;
          const imgHeight = (calendarCanvas.height * imgWidth) / calendarCanvas.width;
          pdf.addImage(calendarImgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
          
          currentY += imgHeight + 15;
        }
        
        // Capture Recent Interventions
        const interventionsElement = document.querySelector('[data-chart="recent-interventions"]');
        if (interventionsElement) {
          // Check if we need a new page
          if (currentY > 200) {
            pdf.addPage();
            currentY = 15;
          }
          
          const interventionsCanvas = await html2canvas(interventionsElement as HTMLElement);
          const interventionsImgData = interventionsCanvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Interventions récentes", 15, currentY);
          
          const imgWidth = 180;
          const imgHeight = Math.min(120, (interventionsCanvas.height * imgWidth) / interventionsCanvas.width);
          pdf.addImage(interventionsImgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
        }
      } catch (error) {
        console.error("Error capturing charts:", error);
      }

      // Save the PDF
      pdf.save(`Rapport_Maintenance_${format(new Date(), "yyyyMMdd")}.pdf`);

      toast({
        title: "Rapport PDF généré avec succès",
        description: "Le téléchargement du fichier devrait commencer automatiquement",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
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
      className="gap-2 print:hidden"
    >
      <Download size={16} />
      Télécharger PDF
    </Button>
  );
};
