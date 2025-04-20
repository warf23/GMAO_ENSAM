
import { useState, useEffect } from 'react';
import { Box, Package, Plus, Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SparePartsFormDialog } from '@/components/spare-parts/SparePartsFormDialog';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { toast } from "sonner";
import type { SparePart } from '@/types/sparePart';
import { getSparePartsFromStorage, deleteSparePart, initializeDataIfNeeded } from '@/utils/dataUtils';

const SparePartsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [filteredParts, setFilteredParts] = useState<SparePart[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Initialize data if needed
    initializeDataIfNeeded();
    
    // Load spare parts
    const loadSpareParts = () => {
      const parts = getSparePartsFromStorage();
      setSpareParts(parts);
      setFilteredParts(parts);
    };
    
    loadSpareParts();
    
    // Set up refresh interval
    const interval = setInterval(loadSpareParts, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = spareParts.filter(part => 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParts(filtered);
  }, [searchTerm, spareParts]);

  const handleAddPart = (newPart: Omit<SparePart, 'id'>) => {
    const id = `PDR${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const part = { ...newPart, id };
    
    const updatedParts = [...spareParts, part];
    setSpareParts(updatedParts);
    
    // Save to localStorage
    localStorage.setItem('spareParts', JSON.stringify(updatedParts));
    
    toast.success("Pièce détachée ajoutée avec succès");
  };

  const confirmDelete = (id: string) => {
    setPartToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (partToDelete) {
      deleteSparePart(partToDelete);
      
      // Update local state
      const updatedParts = spareParts.filter(part => part.id !== partToDelete);
      setSpareParts(updatedParts);
      setFilteredParts(updatedParts.filter(part => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Gestion des pièces détachées</h1>
        <SparePartsFormDialog onSave={handleAddPart} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Rechercher une pièce par nom, référence ou catégorie..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredParts.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Aucune pièce détachée trouvée</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm ? "Essayez avec d'autres termes de recherche" : "Commencez par ajouter une pièce"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Désignation</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.reference}</TableCell>
                  <TableCell>
                    {part.name}
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{part.description}</p>
                  </TableCell>
                  <TableCell>{part.category}</TableCell>
                  <TableCell>{part.supplier}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={part.currentStock <= part.minimumStock ? "destructive" : "outline"}>
                      {part.currentStock} / {part.minimumStock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{part.unitPrice.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => confirmDelete(part.id)}
                    >
                      <Trash size={16} className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer cette pièce"
        description="Êtes-vous sûr de vouloir supprimer cette pièce détachée ? Cette action est irréversible."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SparePartsPage;
