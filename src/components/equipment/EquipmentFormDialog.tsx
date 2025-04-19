
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type Equipment = {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'standby';
  type: string;
  serialNumber: string;
  criticalityLevel: 'low' | 'medium' | 'high';
};

export const EquipmentFormDialog = ({ equipment }: { equipment?: Equipment }) => {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(equipment ? "Équipement modifié" : "Équipement créé", {
      description: "Cette fonctionnalité sera bientôt disponible."
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {equipment ? (
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel équipement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {equipment ? "Modifier l'équipement" : "Nouvel équipement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'équipement</Label>
              <Input
                id="name"
                defaultValue={equipment?.name}
                placeholder="Ex: Pompe centrifuge P-101"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                defaultValue={equipment?.type}
                placeholder="Ex: Pompe"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                defaultValue={equipment?.location}
                placeholder="Ex: Unité A / Zone 1"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serialNumber">Numéro de série</Label>
              <Input
                id="serialNumber"
                defaultValue={equipment?.serialNumber}
                placeholder="Ex: SN-XXXX-2024"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">État</Label>
              <Select defaultValue={equipment?.status || "operational"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un état" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="breakdown">En panne</SelectItem>
                  <SelectItem value="standby">En veille</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="criticalityLevel">Niveau de criticité</Label>
              <Select defaultValue={equipment?.criticalityLevel || "low"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {equipment ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
