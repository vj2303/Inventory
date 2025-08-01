export type TabState = 'initiated' | 'completed';

export type SortField = 'date' | 'status';
export type SortOrder = 'oldest' | 'newest';

export interface StatusFilter {
  [key: string]: boolean;
}

export interface TransferRecord {
  id: string;
  createdOn: string;
  createdBy: string;
  source: string;
  destination: string;
  numberOfItems: number;
  status: string;
}

type Product = {
  _id: string;
  supplier: string;
  materialCenter: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  itemDetails: {
    name: string;
    eanCode: string;
    brand: string;
    sex: string;
    itemCode: string;
    ml: string | number;
    type: string;
    subtype: string;
  };
  stockInfo: {
    pricing: {
      priceA: number;
      priceB: number;
      priceC: number;
      priceD: number;
    };
    quantity: number;
    cost: number;
    freight: number;
    duty: number;
    landed: number;
    minimumPrice: number;
    meanCP: number;
    totalValue: number;
    currency: string;
  };
};

type SupplierProduct = {
  _id: string;
  itemDetails: {
    name: string;
    eanCode: string;
    brand: string;
    sex: string;
    itemCode: string;
    ml: string | number;
    type: string;
    subtype: string;
  };
  supplierName: string;
  supplierId: string;
  quantityAvailable: number;
  cost: number;
};


