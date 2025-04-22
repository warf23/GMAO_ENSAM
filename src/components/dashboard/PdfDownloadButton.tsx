
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PdfDownloadButton = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const element = document.getElementById('dashboard-content');
      if (!element) {
        throw new Error('Dashboard content not found');
      }

      toast({
        title: "Préparation de l'impression...",
        description: "La page d'impression va s'ouvrir",
      });

      // Use browser's print functionality
      window.print();

      toast({
        title: "Page d'impression ouverte",
        description: "Vous pouvez maintenant enregistrer en PDF",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la préparation de l'impression",
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
      Imprimer / PDF
    </Button>
  );
};
