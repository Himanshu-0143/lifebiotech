export interface Medicine {
  id: string;
  name: string;
  description: string;
  form: MedicineForm;
  price: number;
  manufacturer: string;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  composition?: string;
}

export type MedicineForm = 
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Gel';

export interface MedicineDetails {
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  dosage: string;
  storage: string;
}

