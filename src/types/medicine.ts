export interface Medicine {
  id: string;
  name: string;
  description: string;
  form: MedicineForm;
  price: number;
  manufacturer: string;
  stockQuantity?: number;  // Local data
  stock?: number;         // Supabase data
  category: string;
  imageUrl?: string;      // Local data
  image_url?: string;     // Supabase data
  composition?: string;
  created_at?: string;    // Supabase data
  updated_at?: string;    // Supabase data
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

