import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Medicine, medicineDetails } from '@/types/medicine';
import { useCart } from '@/contexts/CartContext';

interface MedicineCardProps {
  medicine: Medicine;
  showActions?: boolean;
}

export function MedicineCard({ medicine, showActions = true }: MedicineCardProps) {
  const { addToCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const details = medicineDetails[medicine.name];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="aspect-square w-full relative mb-4">
          {medicine.imageUrl ? (
            <img
              src={medicine.imageUrl}
              alt={medicine.name}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{medicine.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {medicine.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Composition: </span>
            {medicine.composition}
          </div>
          <div>
            <span className="font-semibold">Form: </span>
            <Badge variant="secondary">{medicine.form}</Badge>
          </div>
          <div>
            <span className="font-semibold">Price: </span>
            ₹{medicine.price.toFixed(2)}
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{medicine.name}</DialogTitle>
                <DialogDescription>
                  {medicine.description}
                </DialogDescription>
              </DialogHeader>
              {details && (
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="font-semibold mb-2">Composition</h4>
                    <p>{medicine.composition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Indications</h4>
                    <ul className="list-disc pl-5">
                      {details.indications.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contraindications</h4>
                    <ul className="list-disc pl-5">
                      {details.contraindications.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Side Effects</h4>
                    <ul className="list-disc pl-5">
                      {details.sideEffects.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Dosage</h4>
                    <p>{details.dosage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Storage</h4>
                    <p>{details.storage}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button 
            className="flex-1" 
            onClick={() => addToCart(medicine)}
            disabled={medicine.stock <= 0}
          >
            {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}