import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicineDetailView } from '@/components/MedicineDetailView';
import { medicines } from '@/data/medicines';
import { medicineDetails } from '@/data/medicineDetails';
import { slugify } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Function to normalize strings for comparison
  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

  // Function to generate all possible variants of a string for matching
  const getVariants = (s: string) => {
    const normalized = normalize(s);
    const slugified = slugify(s);
    return [
      s,                                              // Original
      normalized,                                     // Normalized
      slugified,                                      // Slugified
      normalized.replace(/[-_\.]/g, ' '),            // Spaces for separators
      normalized.replace(/[-_\.\s]/g, ''),           // No separators
      normalized.replace(/\s+/g, '-'),               // Dashes for spaces
      normalized.replace(/[-_\.]/g, '-'),            // All separators as dashes
    ];
  };

  const decodedId = id ? decodeURIComponent(id) : '';

  // Debug logging
  console.log('ProductDetail debug info:', {
    routeParam: id,
    decodedId,
    paramVariants: getVariants(decodedId),
    availableMedicineIds: medicines.map(m => m.id)
  });

  // Find medicine by trying all variants
  let medicine = medicines.find((m) => {
    const searchTermVariants = getVariants(decodedId);
    const medicineIdVariants = getVariants(m.id);
    const medicineNameVariants = getVariants(m.name);
    
    return searchTermVariants.some(searchVariant => 
      medicineIdVariants.includes(searchVariant) || 
      medicineNameVariants.includes(searchVariant)
    );
  });

  // If we found a medicine but URL doesn't match the canonical slug, redirect
  useEffect(() => {
    if (medicine && decodedId && slugify(medicine.id) !== slugify(decodedId)) {
      // replace so back button doesn't create a loop
      navigate(`/products/${slugify(medicine.id)}`, { replace: true });
    }
  }, [medicine, decodedId, navigate]);

  // Determine details using the medicine id (preferred), then name, then slug fallbacks
  let details = null as any;
  if (medicine) {
    details = medicineDetails[medicine.id] ?? medicineDetails[medicine.name] ?? medicineDetails[decodedId] ?? medicineDetails[Object.keys(medicineDetails).find(k => slugify(k) === slugify(medicine.id))];
  }

  const handleAddToCart = () => {
    if (medicine) {
      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        form: medicine.form,
      });
      toast({
        title: 'Added to cart',
        description: `${medicine.name} has been added to your cart.`,
      });
    }
  };

  if (!medicine || !details) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <MedicineDetailView 
        medicine={medicine}
        details={details}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
