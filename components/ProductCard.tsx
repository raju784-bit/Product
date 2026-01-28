import React from 'react';
import { Link } from 'react-router-dom';
import { Product, StoreSettings } from '../types';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, settings }) => {
  const thumbnail = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://via.placeholder.com/400';
  
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  
  // Calculate discount percentage
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100) 
    : 0;

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi, I want to order this product:\n\n*Name:* ${product.name}\n*Price:* ${settings.currencySymbol}${currentPrice}\n*Link:* ${window.location.origin}/#/product/${product.id}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group relative">
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          {discountPercentage}% OFF
        </div>
      )}
      
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-200">
          <img 
            src={thumbnail} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      </Link>
      
      <div className="p-3 md:p-4">
        <p className="text-[10px] md:text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-0.5 md:mb-1 truncate">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-900 font-bold text-sm md:text-lg mb-1 truncate hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="hidden md:block text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-bold text-base md:text-lg leading-tight">
                {settings.currencySymbol}{currentPrice}
              </span>
              {hasDiscount && (
                <span className="text-gray-400 text-xs md:text-sm line-through">
                  {settings.currencySymbol}{product.price}
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleOrder}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm w-full sm:w-auto"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span className="font-semibold text-[10px] md:text-sm">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;