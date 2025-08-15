'use client'
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Permission } from '../../../utils/api';

interface Subitem {
  [key: string]: boolean;
}

interface Item {
  expanded: boolean;
  enabled: boolean;
  subitems?: Subitem;
}

interface Section {
  expanded: boolean;
  enabled: boolean;
  items: {
    [key: string]: Item;
  };
}

interface Permissions {
  [key: string]: Section;
}

interface UserPermissionsProps {
  onBack: () => void;
  onCreateUser?: (permissions: Permission[]) => Promise<void>;
  isLoading?: boolean;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ onBack, onCreateUser, isLoading }) => {
    const [permissions, setPermissions] = useState<Permissions>({
      'Section 1 : Home': {
        expanded: true,
        enabled: true,
        items: {
          'List Of Products': {
            expanded: true,
            enabled: true,
            subitems: {
              'Company Inventory': true,
              'Supplier Inventory': true,
              'View Supplier Details': false,
              'View Cost': false,
              'Total Sales': false,
              'Total Orders': false,
              'Products Sold': false,
              'Top Buyers': false,
              'Top Selling Products': false,
              'Monthly Sales Graph': false
            }
          }
        }
      }
    });
  
    const tabs = ['Home', 'Analytics', 'Inventory', 'Approvals', 'Purchase Order', 'Sales'];
    const [activeTab, setActiveTab] = useState('Home');
  
    const toggleSection = (sectionName: string) => {
      setPermissions(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          expanded: !prev[sectionName].expanded
        }
      }));
    };
  
    const toggleSectionEnabled = (sectionName: string) => {
      setPermissions(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          enabled: !prev[sectionName].enabled
        }
      }));
    };
  
    const toggleItem = (sectionName: string, itemName: string) => {
      setPermissions(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          items: {
            ...prev[sectionName].items,
            [itemName]: {
              ...prev[sectionName].items[itemName],
              expanded: !prev[sectionName].items[itemName].expanded
            }
          }
        }
      }));
    };
  
    const toggleItemEnabled = (sectionName: string, itemName: string) => {
      setPermissions(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          items: {
            ...prev[sectionName].items,
            [itemName]: {
              ...prev[sectionName].items[itemName],
              enabled: !prev[sectionName].items[itemName].enabled
            }
          }
        }
      }));
    };
  
    const toggleSubitem = (sectionName: string, itemName: string, subitemName: string) => {
      setPermissions(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          items: {
            ...prev[sectionName].items,
            [itemName]: {
              ...prev[sectionName].items[itemName],
              subitems: {
                ...prev[sectionName].items[itemName].subitems,
                [subitemName]: !prev[sectionName].items[itemName].subitems![subitemName]
              }
            }
          }
        }
      }));
    };

    const convertPermissionsToAPIFormat = (): Permission[] => {
      const apiPermissions: Permission[] = [];
      
      // Convert the permissions structure to API format
      Object.entries(permissions).forEach(([sectionName, section]) => {
        if (section.enabled) {
          Object.entries(section.items).forEach(([itemName, item]) => {
            if (item.enabled) {
              const actions: string[] = [];
              
              // Add basic actions based on item type
              if (itemName.toLowerCase().includes('view') || itemName.toLowerCase().includes('list')) {
                actions.push('VIEW');
              }
              if (itemName.toLowerCase().includes('create') || itemName.toLowerCase().includes('add')) {
                actions.push('CREATE');
              }
              if (itemName.toLowerCase().includes('edit') || itemName.toLowerCase().includes('update')) {
                actions.push('EDIT');
              }
              if (itemName.toLowerCase().includes('delete') || itemName.toLowerCase().includes('remove')) {
                actions.push('DELETE');
              }
              
              // If no specific actions found, default to VIEW
              if (actions.length === 0) {
                actions.push('VIEW');
              }
              
              // Map section names to API resources
              let resource = 'DASHBOARD';
              if (sectionName.toLowerCase().includes('inventory')) {
                resource = 'INVENTORY';
              } else if (sectionName.toLowerCase().includes('analytics')) {
                resource = 'ANALYTICS';
              } else if (sectionName.toLowerCase().includes('approvals')) {
                resource = 'APPROVALS';
              } else if (sectionName.toLowerCase().includes('purchase order')) {
                resource = 'PURCHASE_ORDER';
              } else if (sectionName.toLowerCase().includes('sales')) {
                resource = 'SALES';
              }
              
              apiPermissions.push({
                resource,
                actions
              });
            }
          });
        }
      });
      
      return apiPermissions;
    };

    const handleCreateUser = async () => {
      if (onCreateUser) {
        const apiPermissions = convertPermissionsToAPIFormat();
        await onCreateUser(apiPermissions);
      }
    };
  
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">User Access and Permissions</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isLoading}
          >
            Back to Users
          </button>
        </div>
  
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border ${
                activeTab === tab
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
  
        <div className="space-y-4">
          {Object.entries(permissions).map(([sectionName, section]) => (
            <div key={sectionName} className="border border-gray-200 rounded-lg">
              <div className="flex items-center p-4 bg-gray-50">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={() => toggleSectionEnabled(sectionName)}
                  className="w-5 h-5 text-teal-600 rounded mr-3"
                />
                <span className="font-medium flex-1">{sectionName}</span>
                <button onClick={() => toggleSection(sectionName)}>
                  {section.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
  
              {section.expanded && (
                <div className="p-4 pt-0">
                  {Object.entries(section.items).map(([itemName, item]) => (
                    <div key={itemName} className="ml-8">
                      <div className="flex items-center py-2">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={() => toggleItemEnabled(sectionName, itemName)}
                          className="w-5 h-5 text-teal-600 rounded mr-3"
                        />
                        <span className="font-medium flex-1">{itemName}</span>
                        <button onClick={() => toggleItem(sectionName, itemName)}>
                          {item.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
  
                      {item.expanded && item.subitems && (
                        <div className="ml-8 space-y-2">
                          {Object.entries(item.subitems).map(([subitemName, enabled]) => (
                            <div key={subitemName} className="flex items-center py-1">
                              <input
                                type="checkbox"
                                checked={enabled}
                                onChange={() => toggleSubitem(sectionName, itemName, subitemName)}
                                className="w-4 h-4 text-teal-600 rounded mr-3"
                              />
                              <span className="text-sm text-gray-600">{subitemName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {onCreateUser && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCreateUser}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        )}
      </div>
    );
  };

export default UserPermissions;