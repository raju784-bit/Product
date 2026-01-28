import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, StoreSettings } from './types'; // Local import

interface ProductDetailsProps {
  products: Product[];
  settings: StoreSettings;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ products, settings }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product && product.imageUrls && product.imageUrls.length > 0) {
      setActiveImage(product.imageUrls[0]);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleOrder = () => {
    const message = encodeURIComponent(
      `Hi, I want to order this product:\n\n*Name:* ${product.name}\n*Price:* ${settings.currencySymbol}${currentPrice}\n*Link:* ${window.location.href}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Results
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden relative">
            {hasDiscount && (
              <div className="absolute top-6 left-6 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                SAVE {Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}%
              </div>
            )}
            <img 
              src={activeImage || 'https://via.placeholder.com/600x400'} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.imageUrls.map((url, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${activeImage === url ? 'border-indigo-600' : 'border-transparent opacity-60'}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-indigo-600">{settings.currencySymbol}{currentPrice}</span>
            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through">
                {settings.currencySymbol}{product.price}
              </span>
            )}
          </div>

          <div className="prose prose-indigo max-w-none mb-8 text-gray-600 leading-relaxed">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-8">
            <h4 className="font-bold text-green-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Ready to Order?
            </h4>
            <p className="text-green-700 text-sm mb-4">Click below to message us on WhatsApp with the product details. We'll confirm your order instantly.</p>
            <button 
              onClick={handleOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>Order Now via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;