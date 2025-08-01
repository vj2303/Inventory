// src/components/AddProductModal/AddProductModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import InputField from '@/components/UI/InputField';
import RadioButton from '@/components/UI/RadioButton';
import ImageUploader from '@/components/UI/ImageUploader';
import Button from '@/components/UI/Button';
import ProductStockInfo from './ProductStockInfo';
import { useGlobal } from '@/context/GlobalContext';
import { useAuth } from '@/context/AuthContext';
import Select from '@/components/UI/Select';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: CompleteProductData) => void;
}

export interface ProductFormData {
  itemDetails: string;
  eanCode: string;
  itemCode: string;
  brand: string;
  sex: string;
  ml: string;
  type1: string;
  type2: string;
  unit: string;
  packageType: 'EPD' | 'EDT' | '';
  image?: File | null;
  supplier: string;
  materialCenter: string;
}

export interface ProductStockData {
  costCurrency: string;
  cost: string;
  quantity: string;
  freight: string;
  duty: string;
  landed: string;
  minimumPrice: string;
  thresholdValue: string;
  locationA: string;
  locationB: string;
  locationC: string;
  locationD: string;
}

export interface CompleteProductData {
  productInfo: ProductFormData;
  stockInfo: ProductStockData;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const initialFormData: ProductFormData = {
    itemDetails: '',
    eanCode: '',
    itemCode: '',
    brand: '',
    sex: '',
    ml: '',
    type1: '',
    type2: '',
    unit: '',
    packageType: '',
    image: null,
    supplier: '',
    materialCenter: ''
  };

  // Get suppliers and material centers from GlobalProvider
  const { suppliers, materialCenters, getSupplierById, getMaterialCenterAddress } = useGlobal();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<'productDetails' | 'stockInfo'>('productDetails');
  const [stockData, setStockData] = useState<ProductStockData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRadioChange = (value: 'EPD' | 'EDT') => {
    setFormData(prevData => ({
      ...prevData,
      packageType: value
    }));
  };

  const handleImageUpload = (file: File | null) => {
    setFormData(prevData => ({
      ...prevData,
      image: file
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('stockInfo');
  };

  const handlePreviousStep = () => {
    setCurrentStep('productDetails');
  };

  const handleStockInfoSubmit = async (stockInfo: ProductStockData) => {
    setIsSubmitting(true);
    setError(null);

    try {
     
      const formDataForApi = new FormData();
      
      formDataForApi.append('itemName', formData.itemDetails);
      formDataForApi.append('eanCode', formData.eanCode);
      formDataForApi.append('brand', formData.brand);
      formDataForApi.append('sex', formData.sex);
      formDataForApi.append('itemCode', formData.itemCode);
      formDataForApi.append('ml', formData.ml);
      formDataForApi.append('type', formData.type1);
      formDataForApi.append('subtype', formData.type2);
      formDataForApi.append('unit', formData.unit);
      
      // Append stock info
      formDataForApi.append('quantity', stockInfo.quantity);
      formDataForApi.append('cost', stockInfo.cost);
      formDataForApi.append('freight', stockInfo.freight);
      formDataForApi.append('duty', stockInfo.duty);
      formDataForApi.append('landed', stockInfo.landed);
      formDataForApi.append('minimumPrice', stockInfo.minimumPrice);
      formDataForApi.append('priceA', stockInfo.locationA);
      formDataForApi.append('priceB', stockInfo.locationB);
      formDataForApi.append('priceC', stockInfo.locationC);
      formDataForApi.append('priceD', stockInfo.locationD);
      formDataForApi.append('currency', stockInfo.costCurrency);
      
      // Append supplier and material center
      formDataForApi.append('supplier', formData.supplier);
      formDataForApi.append('materialCenter', formData.materialCenter);
      
      // Append image if exists
      if (formData.image) {
        formDataForApi.append('image', formData.image);
      }
      
      // Call API
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/products',
        headers: { 
          'Authorization': `Bearer ${user?.token}`,
        },
        data: formDataForApi
      });
      
      // Call the onSubmit prop to update parent component
      const completeData: CompleteProductData = {
        productInfo: formData,
        stockInfo: stockInfo
      };
      onSubmit(completeData);
      
      // Close modal
      onClose();
      
    } catch (err: any) {
      console.error('Error submitting product:', err);
      setError(err?.response?.data?.message || 'Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex overflow-y-hidden items-center justify-center z-50">
      <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {currentStep === 'productDetails' ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleNextStep}>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="space-y-4">
                      <InputField
                        label="Item Details"
                        name="itemDetails"
                        value={formData.itemDetails}
                        onChange={handleInputChange}
                        placeholder="A&F AUTHENTIC NIGHT M TESTER 100ML"
                      />

                      <InputField
                        label="EAN Code"
                        name="eanCode"
                        value={formData.eanCode}
                        onChange={handleInputChange}
                        placeholder="2113896907"
                      />

                      <InputField
                        label="Item Code"
                        name="itemCode"
                        value={formData.itemCode}
                        onChange={handleInputChange}
                        placeholder="#648994"
                      />

                      <InputField
                        label="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Perry Ellis"
                      />

                      <InputField
                        label="SEX"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        placeholder="M"
                      />

                      <InputField
                        label="ml"
                        name="ml"
                        value={formData.ml}
                        onChange={handleInputChange}
                        placeholder="100"
                      />

                      <InputField
                        label="Type"
                        name="type1"
                        value={formData.type1}
                        onChange={handleInputChange}
                        placeholder="100"
                      />

                      <InputField
                        label="Type"
                        name="type2"
                        value={formData.type2}
                        onChange={handleInputChange}
                        placeholder="100"
                      />

                      <InputField
                        label="Unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        placeholder="PCS"
                      />

                      {/* Updated Supplier dropdown with supplier name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier
                        </label>
                        <Select
                              name="supplier"
                              value={formData.supplier}
                              onChange={(value) => handleSelectChange('supplier', value)}
                              placeholder="Select supplier"
                              options={suppliers.map(supplier => ({
                                value: supplier._id || supplier.id,
                                label: supplier.name
                              }))}
                            />
                      </div>

                      {/* Updated Material Center dropdown with address */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Material Center
                        </label>
                        <Select
                                      name="materialCenter"
                                      value={formData.materialCenter}
                                      onChange={(value) => handleSelectChange('materialCenter', value)}
                                      placeholder="Select material center"
                                      options={materialCenters.map(center => ({
                                        value: center._id || center.id,
                                        label: `${center.city} - ${center.address}, ${center.country}`
                                      }))}
                                    />
                      </div>

                      <div className="flex items-center space-x-8 mt-4">
                        <RadioButton
                          id="epd"
                          name="packageType"
                          value="EPD"
                          checked={formData.packageType === 'EPD'}
                          onChange={() => handleRadioChange('EPD')}
                          label="EPD"
                        />
                        <RadioButton
                          id="edt"
                          name="packageType"
                          value="EDT"
                          checked={formData.packageType === 'EDT'}
                          onChange={() => handleRadioChange('EDT')}
                          label="EDT"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <ImageUploader onImageUpload={handleImageUpload} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Next
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <ProductStockInfo
            onPrevious={handlePreviousStep}
            onSubmit={handleStockInfoSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 border-t border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;