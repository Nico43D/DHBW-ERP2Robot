import React, { useState } from 'react';
import { Link } from 'react-router';
import { Product } from '../data/products';
import { Button } from './Button';
import { QuantityStepper } from './QuantityStepper';
import { Card } from './Card';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
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
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg text-gray-900 hover:text-[#EB1A2B] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        </div>
        <div className="text-2xl font-bold text-[#EB1A2B]">
          €{product.price.toFixed(2)}
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <Button onClick={handleAddToCart} className="flex-1">
            In den Warenkorb
          </Button>
        </div>
      </div>
    </Card>
  );
}
