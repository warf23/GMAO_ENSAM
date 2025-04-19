
import { useState, useEffect } from 'react';
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

export const EquipmentFormDialog = ({ equipment, onEquipmentAdded }: { 
  equipment?: Equipment; 
  onEquipmentAdded?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Equipment>({
    id: equipment?.id || crypto.randomUUID(),
    name: equipment?.name || '',
    location: equipment?.location || '',
    status: equipment?.status || 'operational',
    type: equipment?.type || '',
    serialNumber: equipment?.serialNumber || '',
    criticalityLevel: equipment?.criticalityLevel || 'low',
  });

  const handleChange = (field: keyof Equipment, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing equipment from localStorage
    const existingEquipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    
    let updatedEquipment;
    if (equipment) {
      // Update existing equipment
      updatedEquipment = existingEquipment.map((eq: Equipment) => 
        eq.id === equipment.id ? formData : eq
      );
      toast.success("Équipement modifié");
    } else {
      // Add new equipment
      updatedEquipment = [...existingEquipment, formData];
      toast.success("Équipement créé");
    }
    
    // Save to localStorage
    localStorage.setItem('equipment', JSON.stringify(updatedEquipment));
    
    // Call the callback to refresh the list instead of reloading the page
    if (onEquipmentAdded) {
      onEquipmentAdded();
    }
    
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
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Pompe centrifuge P-101"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                placeholder="Ex: Pompe"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Unité A / Zone 1"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serialNumber">Numéro de série</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                placeholder="Ex: SN-XXXX-2024"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">État</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleChange('status', value as Equipment['status'])}
              >
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
              <Select 
                value={formData.criticalityLevel}
                onValueChange={(value) => handleChange('criticalityLevel', value as Equipment['criticalityLevel'])}
              >
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
