// pages/index.tsx
import React from 'react';
import Layout from './layout';
import Card from './Card';
import { FileText, Users, ToggleLeft, Warehouse } from 'lucide-react';

const Page: React.FC = () => {
  return (
    <Layout title="Settings">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        title="Personal Info"
        description="Provide personal details"
        icon={<FileText className="w-8 h-8" />}
        href="./settings/personalinfo"
      />
      <Card
        title="Supplier and Customer"
        description="Manage your supplier and customer"
        icon={<Users className="w-8 h-8" />}
        href="settings/supplier-customer"
      />
      <Card
        title="User Management"
        description="Set users access to the screens"
        icon={<ToggleLeft className="w-8 h-8" />}
        href="/settings/user-management"
      />
      <Card
        title="Warehouse Management"
        description="Manage your Warehouse locations"
        icon={<Warehouse className="w-8 h-8" />}
        href="/settings/warehouse"
      />
    </div>
  </Layout>
  );
};

export default Page;