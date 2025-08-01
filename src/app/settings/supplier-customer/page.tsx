// pages/settings/supplier-customer/index.tsx
import React from 'react';
import Layout from '../layout';
import Card from '../Card';
import { Truck, Users } from 'lucide-react';

const SupplierCustomerPage: React.FC = () => {
  return (
    <Layout title="Supplier and Customer">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Supplier"
          description="Manage your suppliers"
          icon={<Truck className="w-8 h-8" />}
          href="./supplier-customer/supplier"
        />
        <Card
          title="Customer"
          description="Manage your customers"
          icon={<Users className="w-8 h-8" />}
          href="./supplier-customer/customer"
        />
      </div>
    </Layout>
  );
};

export default SupplierCustomerPage;