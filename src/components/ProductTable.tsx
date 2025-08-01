import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  itemDetails: string;
  eanCode: string;
  itemCode: string;
  brand: string;
  sex: string;
  totalStock: number;
  totalValue: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier?: string;
  materialCenter?: string;
  imageUrl?: string;
  // Added stock info details
  costPrice?: number;
  freight?: number;
  duty?: number;
  landed?: number;
  minimumPrice?: number;
  meanCP?: number;
  currency?: string;
  pricing?: {
    priceA: number;
    priceB: number;
    priceC: number;
    priceD: number;
  };
}

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const router = useRouter();

  const handleViewProduct = (productId: string) => {
    router.push(`/inventory/company/product/${productId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              EAN Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Stock
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {/* Show these columns if available */}
            {products[0]?.supplier && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
            )}
            {products[0]?.materialCenter && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material Center
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr 
              key={product.id} 
              className="hover:bg-gray-50"
            >
              <td 
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                <div className="flex items-center">
                  {product.imageUrl ? (
                    <img className="h-10 w-10 rounded-full object-cover mr-3" src={product.imageUrl} alt={product.itemDetails} />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                      IMG
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900">
                    {product.itemDetails}
                  </div>
                </div>
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {product.eanCode}
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {product.itemCode}
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {product.brand} ({product.sex})
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {product.totalStock.toLocaleString()}
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                ${product.costPrice?.toLocaleString() || '0'}
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                ${product.totalValue.toLocaleString()}
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                  ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 
                    product.availability === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {product.availability}
                </span>
              </td>
              {/* Show these columns if available */}
              {products[0]?.supplier && (
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.supplier}
                </td>
              )}
              {products[0]?.materialCenter && (
                <td 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.materialCenter}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => handleViewProduct(product.id)}
                    aria-label="View product details"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit product"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;