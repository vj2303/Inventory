import { TabState } from '../types';

interface TabNavigationProps {
  activeTab: TabState;
  setActiveTab: (tab: TabState) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab('initiated')}
        className={`py-2 px-4 ${
          activeTab === 'initiated'
            ? 'border-b-2 border-teal-500 font-medium text-teal-600'
            : 'text-gray-500'
        }`}
      >
        Initiated
      </button>
      <button
        onClick={() => setActiveTab('completed')}
        className={`py-2 px-4 ${
          activeTab === 'completed'
            ? 'border-b-2 border-teal-500 font-medium text-teal-600'
            : 'text-gray-500'
        }`}
      >
        Completed
      </button>
    </div>
  );
}