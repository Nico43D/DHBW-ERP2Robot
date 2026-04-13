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
    <Card className={`overflow-hidden transition-shadow ${isInStock ? 'hover:shadow-md' : 'opacity-50'}`}>
      {isInStock ? (
        <Link to={`/products/${product.id}`} className="block relative group">
          <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-6 relative">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
            {product.description && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm line-clamp-3">{product.description}</p>
              </div>
            )}
          </div>
          {product.stock !== undefined && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-green-100 text-green-800">
              <Package className="h-3 w-3" />
              {product.stock} auf Lager
            </div>
          )}
        </Link>
      ) : (
        <div className="block relative cursor-not-allowed">
          <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain grayscale"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-red-100 text-red-800">
            <Package className="h-3 w-3" />
            Nicht verfügbar
          </div>
        </div>
      )}
      <div className="p-4 space-y-3">
        <div>
          {isInStock ? (
            <Link to={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-[#EB1A2B] transition-colors">
                {product.name}
              </h3>
            </Link>
          ) : (
            <h3 className="font-semibold text-lg text-gray-400">
              {product.name}
            </h3>
          )}
        </div>
        <div className={`text-2xl font-bold ${isInStock ? 'text-[#EB1A2B]' : 'text-gray-400'}`}>
          €{product.price.toFixed(2)}
        </div>
        {isInStock && (
          <div className="flex items-center justify-between gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
            />
            <Button
              onClick={handleAddToCart}
              className="flex-1"
            >
              In den Warenkorb
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
