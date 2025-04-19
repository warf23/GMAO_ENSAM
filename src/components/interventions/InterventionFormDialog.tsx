
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(intervention ? "Intervention modifiée" : "Intervention créée", {
      description: "Cette fonctionnalité sera bientôt disponible."
    });
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
                defaultValue={intervention?.title}
                placeholder="Ex: Maintenance préventive trimestrielle"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={intervention?.description}
                placeholder="Description détaillée de l'intervention..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue={intervention?.type || "preventive"}>
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
              <Select defaultValue={intervention?.priority || "medium"}>
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
                defaultValue={intervention?.startDate}
                required
              />
            </div>
            
            {intervention?.status === 'completed' && (
              <div className="grid gap-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  defaultValue={intervention?.endDate || undefined}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="technicians">Techniciens</Label>
              <Input
                id="technicians"
                defaultValue={intervention?.technicians.join(', ')}
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
