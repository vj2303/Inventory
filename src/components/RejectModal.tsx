import React, { useState } from 'react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Add Reason</h2>
        
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm mb-2">Add Note for Rejection</label>
          <textarea
            id="reason"
            className="w-full border rounded-md p-2 h-24"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-teal-700 text-white py-2 px-6 rounded-md hover:bg-teal-800"
          >
            Send Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;