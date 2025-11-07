import { Medicine } from '@/types/medicine';
import { MedicineCard } from './MedicineCard';

interface MedicineGridProps {
  medicines: Medicine[];
  showActions?: boolean;
}

export function MedicineGrid({ medicines, showActions }: MedicineGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          showActions={showActions}
        />
      ))}
    </div>
  );
}