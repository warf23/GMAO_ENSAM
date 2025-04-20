
import { useState } from 'react';
import { Package, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SparePartsFormDialog } from '@/components/spare-parts/SparePartsFormDialog';
import { toast } from 'sonner';

// Mock data for spare parts
const mockSpareParts = [
  {
    id: "sp1",
    reference: "BP-001",
    name: "Roulement à billes",
    description: "Roulement à billes SKF série 6200",
    supplier: "SKF",
    currentStock: 5,
    minimumStock: 10,
    unitPrice: 45.99,
    location: "Magasin A-12",
    category: "Roulements",
    lastRestockDate: "2024-03-15",
  },
  {
    id: "sp2",
    reference: "JT-002",
    name: "Joint torique",
    description: "Joint torique en caoutchouc nitrile",
    supplier: "Parker",
    currentStock: 2,
    minimumStock: 20,
    unitPrice: 2.50,
    location: "Magasin B-03",
    category: "Joints",
    lastRestockDate: "2024-03-10",
  },
  // Add more mock data as needed
];

const SparePartsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [spareParts, setSpareParts] = useState(mockSpareParts);

  const handleStockUpdate = (partId: string, quantity: number) => {
    setSpareParts(currentParts => 
      currentParts.map(part => 
        part.id === partId 
          ? { ...part, currentStock: part.currentStock + quantity }
          : part
      )
    );
    toast.success("Stock mis à jour avec succès");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pièces détachées</h1>
          <p className="text-muted-foreground">
            Gérez votre inventaire de pièces détachées
          </p>
        </div>
        <SparePartsFormDialog 
          onSave={(newPart) => {
            setSpareParts([...spareParts, { ...newPart, id: `sp${spareParts.length + 1}` }]);
            toast.success("Pièce ajoutée avec succès");
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une pièce..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des références</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spareParts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spareParts.reduce((acc, part) => acc + (part.currentStock * part.unitPrice), 0).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Désignation</TableHead>
                <TableHead>Stock actuel</TableHead>
                <TableHead>Stock minimum</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spareParts
                .filter(part => 
                  part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  part.reference.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.reference}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-sm text-muted-foreground">{part.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {part.currentStock}
                        {part.currentStock <= part.minimumStock && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Stock bas
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{part.minimumStock}</TableCell>
                    <TableCell>{part.location}</TableCell>
                    <TableCell>
                      {part.unitPrice.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockUpdate(part.id, 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockUpdate(part.id, -1)}
                          disabled={part.currentStock <= 0}
                        >
                          -
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SparePartsPage;
