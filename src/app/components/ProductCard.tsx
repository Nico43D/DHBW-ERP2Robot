import React, { useState } from 'react';
import { Link } from 'react-router';
import { Product, FALLBACK_IMAGE } from '../services/api';
import { Button } from './Button';
import { QuantityStepper } from './QuantityStepper';
import { Card } from './Card';
import { useCart } from '../contexts/CartContext';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Prüfe ob Produkt auf Lager (wenn stock definiert ist)
  const isInStock = product.stock === undefined || product.stock > 0;

  const handleAddToCart = () => {
    if (!isInStock) return;

    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>
        {/* Lagerbestand-Badge */}
        {product.stock !== undefined && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <Package className="h-3 w-3" />
            {product.stock > 0 ? `${product.stock} auf Lager` : 'Nicht verfügbar'}
          </div>
        )}
      </Link>
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg text-gray-900 hover:text-[#EB1A2B] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="text-2xl font-bold text-[#EB1A2B]">
          €{product.price.toFixed(2)}
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
          />
          <Button
            onClick={handleAddToCart}
            className="flex-1"
            disabled={!isInStock}
          >
            {isInStock ? 'In den Warenkorb' : 'Nicht verfügbar'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
