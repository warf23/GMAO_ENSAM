
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SparePart } from '@/types/sparePart';

type SparePartsFormDialogProps = {
  onSave: (sparePart: Omit<SparePart, 'id'>) => void;
  existingPart?: SparePart;
};

export const SparePartsFormDialog = ({ onSave, existingPart }: SparePartsFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    reference: existingPart?.reference || '',
    name: existingPart?.name || '',
    description: existingPart?.description || '',
    supplier: existingPart?.supplier || '',
    currentStock: existingPart?.currentStock || 0,
    minimumStock: existingPart?.minimumStock || 0,
    unitPrice: existingPart?.unitPrice || 0,
    location: existingPart?.location || '',
    category: existingPart?.category || '',
    lastRestockDate: existingPart?.lastRestockDate || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une pièce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingPart ? "Modifier la pièce" : "Ajouter une nouvelle pièce"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Désignation</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={e => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Stock actuel</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={e => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Stock minimum</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                value={formData.minimumStock}
                onChange={e => setFormData(prev => ({ ...prev, minimumStock: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Prix unitaire (€)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={e => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Emplacement</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {existingPart ? "Mettre à jour" : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
