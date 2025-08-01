"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
  ChevronDown,
  ChevronRight,
  Box,
  Truck,
  Tag,
  BarChart3,
  FileText,
  ArrowLeftRight,
  ShoppingCart,
  FileOutput,
  ShoppingBag,
  Receipt,
  LineChart,
  BarChart2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  toggleSubmenu?: () => void;
}

interface SubmenuLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  hasSubmenu = false,
  isSubmenuOpen = false,
  toggleSubmenu
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || 
                  (pathname === "/" && href === "/dashboard") ||
                  (hasSubmenu && pathname.startsWith(href));

  if (hasSubmenu && toggleSubmenu) {
    return (
      <div>
        <div
          className={`cursor-pointer flex items-center justify-between ${
            isCollapsed ? "justify-center py-4" : "px-8 py-4"
          } hover:text-blue-500 hover:bg-[#B2D9D8] transition-colors ${
            isActive ? "bg-[#B2D9D8] text-blue-700" : ""
          }`}
          onClick={toggleSubmenu}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 !text-gray-700" />
            <span
              className={`${
                isCollapsed ? "hidden" : "block"
              } font-medium text-gray-700`}
            >
              {label}
            </span>
          </div>
          {!isCollapsed && (
            isSubmenuOpen ? 
            <ChevronDown className="w-4 h-4 text-gray-700" /> :
            <ChevronRight className="w-4 h-4 text-gray-700" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-[#B2D9D8] gap-3 transition-colors ${
          isActive ? "bg-[#B2D9D8] text-blue-700" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const SubmenuLink = ({ href, label, icon: Icon, isCollapsed }: SubmenuLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-3" : "pl-16 pr-8 py-3"
        } hover:text-blue-500 hover:bg-[#B2D9D8] gap-3 transition-colors ${
          isActive ? "bg-[#B2D9D8] text-blue-600" : ""
        }`}
      >
        <Icon className="w-5 h-5 !text-gray-600" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-600 text-sm`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const [isInventorySubmenuOpen, setIsInventorySubmenuOpen] = useState(
    pathname.startsWith("/inventory")
  );
  const [isApprovalSubmenuOpen, setIsApprovalSubmenuOpen] = useState(
    pathname.startsWith("/approval")
  );
  const [isOrdersSubmenuOpen, setIsOrdersSubmenuOpen] = useState(
    pathname.startsWith("/orders")
  );
  const [isAnalyticsSubmenuOpen, setIsAnalyticsSubmenuOpen] = useState(
    pathname.startsWith("/analytics")
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleInventorySubmenu = () => {
    setIsInventorySubmenuOpen(!isInventorySubmenuOpen);
  };

  const toggleApprovalSubmenu = () => {
    setIsApprovalSubmenuOpen(!isApprovalSubmenuOpen);
  };

  const toggleOrdersSubmenu = () => {
    setIsOrdersSubmenuOpen(!isOrdersSubmenuOpen);
  };

  const toggleAnalyticsSubmenu = () => {
    setIsAnalyticsSubmenuOpen(!isAnalyticsSubmenuOpen);
  };

  const excludedRoutes = ["/register", "/verify"];

  const shouldHideSidebar = excludedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (shouldHideSidebar) {
    dispatch(setIsSidebarCollapsed(true));
    return null;
  }

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  if (excludedRoutes.includes(pathname)) {
    dispatch(setIsSidebarCollapsed(true));
    return null;
  }

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
     
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          Company
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-[#B2D9D8] rounded-full hover:bg-[#000]"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8 flex flex-col">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Home"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/analytics"
          icon={Archive}
          label="Analytics"
          isCollapsed={isSidebarCollapsed}
          hasSubmenu={true}
          isSubmenuOpen={isAnalyticsSubmenuOpen}
          toggleSubmenu={toggleAnalyticsSubmenu}
        />
        
        {/* Analytics Submenu */}
        {isAnalyticsSubmenuOpen && (
          <div className={`bg-gray-50 ${isSidebarCollapsed ? "" : "border-l-4 border-[#B2D9D8] ml-8"}`}>
            <SubmenuLink
              href="/analytics/dashboard"
              label="Dashboard"
              icon={LineChart}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/analytics/comparison"
              label="Comparison"
              icon={BarChart2}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        )}
        
        <SidebarLink
          href="/inventory"
          icon={Clipboard}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
          hasSubmenu={true}
          isSubmenuOpen={isInventorySubmenuOpen}
          toggleSubmenu={toggleInventorySubmenu}
        />
        
        {/* Inventory Submenu */}
        {isInventorySubmenuOpen && (
          <div className={`bg-gray-50 ${isSidebarCollapsed ? "" : "border-l-4 border-[#B2D9D8] ml-8"}`}>
            <SubmenuLink
              href="/inventory/company"
              label="Company Inventory"
              icon={Box}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/inventory/supplier"
              label="Supplier Inventory"
              icon={Truck}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/inventory/offer-list"
              label="Offer List"
              icon={Tag}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/inventory/stock"
              label="Stock Exchange"
              icon={BarChart3}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        )}
        
        <SidebarLink
          href="/approval"
          icon={User}
          label="Approval"
          isCollapsed={isSidebarCollapsed}
          hasSubmenu={true}
          isSubmenuOpen={isApprovalSubmenuOpen}
          toggleSubmenu={toggleApprovalSubmenu}
        />
        
        {/* Approval Submenu */}
        {isApprovalSubmenuOpen && (
          <div className={`bg-gray-50 ${isSidebarCollapsed ? "" : "border-l-4 border-[#B2D9D8] ml-8"}`}>
            <SubmenuLink
              href="/approval/offer-list"
              label="Offer List"
              icon={FileText}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/approval/stock-transfer"
              label="Stock Transfer"
              icon={ArrowLeftRight}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/approval/purchase-orders"
              label="Purchase Orders"
              icon={ShoppingCart}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/approval/proforma-invoice"
              label="Proforma Invoice"
              icon={FileOutput}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        )}
        
        <SidebarLink
          href="/orders"
          icon={CircleDollarSign}
          label="Orders"
          isCollapsed={isSidebarCollapsed}
          hasSubmenu={true}
          isSubmenuOpen={isOrdersSubmenuOpen}
          toggleSubmenu={toggleOrdersSubmenu}
        />

        {/* Orders Submenu */}
        {isOrdersSubmenuOpen && (
          <div className={`bg-gray-50 ${isSidebarCollapsed ? "" : "border-l-4 border-[#B2D9D8] ml-8"}`}>
            <SubmenuLink
              href="/orders/purchase-orders"
              label="Purchase Orders"
              icon={ShoppingBag}
              isCollapsed={isSidebarCollapsed}
            />
            <SubmenuLink
              href="/orders/sales"
              label="Sales"
              icon={Receipt}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        )}
        
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">Log out</p>
      </div>
    </div>
  );
};

export default Sidebar;










