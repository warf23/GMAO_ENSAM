import { equipmentData } from '@/data/equipmentData';
import { EquipmentDetail } from '@/components/equipment/EquipmentDetail';

const EquipmentFichesPage = () => {
  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold mb-8">Fiches techniques des équipements</h1>
      {equipmentData.map((equipment) => (
        <div key={equipment.id} className="border rounded-lg p-6 bg-white shadow-sm">
          <EquipmentDetail id={equipment.id} />
        </div>
      ))}
    </div>
  );
};

export default EquipmentFichesPage; 