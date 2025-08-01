"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal";

export default function PurchaseOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { name: "Approved", href: "/orders/sales/approved" },
    { name: "Sent To Customer", href: "/orders/sales/sent-to-customer" },
    { name: "Ordered", href: "/orders/sales/ordered" },
    { name: "Delivered", href: "/orders/sales/delivered" },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button
          onClick={openModal}
          className="bg-teal-800 hover:bg-teal-900 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Sales</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-lg
                  ${
                    isActive
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {children}
      </div>

      {/* Initial Purchase Order Modal */}
      {isModalOpen && (
        <PurchaseOrderModal onClose={closeModal} />
      )}
    </div>
  );
}