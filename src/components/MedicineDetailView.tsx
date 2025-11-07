import React from 'react';
import { Medicine, MedicineDetails } from '@/types/medicine';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

interface MedicineDetailViewProps {
  medicine: Medicine;
  details: MedicineDetails;
  onAddToCart: () => void;
}

export function MedicineDetailView({ medicine, details, onAddToCart }: MedicineDetailViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image */}
        <div className="lg:w-1/2">
          <Card className="p-6 h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500">
            <div className="w-64 h-64">
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="w-full h-full object-contain"
              />
            </div>
          </Card>
        </div>

        {/* Right side - Details */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{medicine.name}</h1>
            <p className="text-lg text-gray-600">{medicine.form}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-3xl font-bold">₹{medicine.price.toFixed(2)}</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                In Stock ({medicine.stockQuantity} units)
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-700">{medicine.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Composition</h2>
              <p className="text-gray-700">{medicine.composition}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Storage</h2>
              <p className="text-gray-700">{details.storage}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Dosage</h2>
              <p className="text-gray-700">{details.dosage}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Indications</h2>
              <ul className="list-disc list-inside text-gray-700">
                {details.indications.map((indication, index) => (
                  <li key={index}>{indication}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Contraindications</h2>
              <ul className="list-disc list-inside text-gray-700">
                {details.contraindications.map((contraindication, index) => (
                  <li key={index}>{contraindication}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Side Effects</h2>
              <ul className="list-disc list-inside text-gray-700">
                {details.sideEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </section>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={onAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}