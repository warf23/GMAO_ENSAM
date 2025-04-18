
import { useParams } from 'react-router-dom';
import { EquipmentDetail } from '@/components/equipment/EquipmentDetail';

const EquipmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Équipement non trouvé</div>;
  }
  
  return <EquipmentDetail id={id} />;
};

export default EquipmentDetailPage;
