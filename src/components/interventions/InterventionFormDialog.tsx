
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type Intervention = {
  id: string;
  title: string;
  description: string;
  equipmentId: string;
  type: 'corrective' | 'preventive';
  status: 'completed' | 'in-progress' | 'scheduled' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string | null;
  technicians: string[];
};

export const InterventionFormDialog = ({ intervention }: { intervention?: Intervention }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Intervention>({
    id: intervention?.id || crypto.randomUUID(),
    title: intervention?.title || '',
    description: intervention?.description || '',
    equipmentId: intervention?.equipmentId || '',
    type: intervention?.type || 'preventive',
    status: intervention?.status || 'scheduled',
    priority: intervention?.priority || 'medium',
    startDate: intervention?.startDate || '',
    endDate: intervention?.endDate || null,
    technicians: intervention?.technicians || [],
  });

  const handleChange = (field: keyof Intervention, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing interventions from localStorage
    const existingInterventions = JSON.parse(localStorage.getItem('interventions') || '[]');
    
    let updatedInterventions;
    if (intervention) {
      // Update existing intervention
      updatedInterventions = existingInterventions.map((int: Intervention) => 
        int.id === intervention.id ? formData : int
      );
      toast.success("Intervention modifiée");
    } else {
      // Add new intervention
      updatedInterventions = [...existingInterventions, formData];
      toast.success("Intervention créée");
    }
    
    // Save to localStorage
    localStorage.setItem('interventions', JSON.stringify(updatedInterventions));
    
    // Refresh the page to show updated data
    window.location.reload();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {intervention ? (
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle intervention
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {intervention ? "Modifier l'intervention" : "Nouvelle intervention"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Maintenance préventive trimestrielle"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description détaillée de l'intervention..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Préventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            
            {intervention?.status === 'completed' && (
              <div className="grid gap-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="technicians">Techniciens</Label>
              <Input
                id="technicians"
                value={formData.technicians.join(', ')}
                onChange={(e) => handleChange('technicians', e.target.value.split(',').map(t => t.trim()))}
                placeholder="Noms des techniciens (séparés par des virgules)"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {intervention ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
