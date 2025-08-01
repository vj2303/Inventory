'use client'
import { useState } from 'react';
import { Cloud, X } from 'lucide-react';

export default function FileUploadComponent() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="p-4">
      {/* <h1 className="text-3xl font-bold mb-8">Comparison</h1> */}
      
      <div className="mb-4">
        <p className="text-xl mb-2">Upload files</p>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Cloud className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg mb-2">Choose a file or drag & drop it here</p>
            <p className="text-gray-500 text-sm mb-6">xls formats, up to 50MB</p>
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-center">
                Browse File
              </div>
              <input 
                id="file-upload" 
                type="file" 
                accept=".xls,.xlsx,.csv" 
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </label>
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 mb-4">
          <h2 className="text-lg font-medium mb-2">Uploaded Files:</h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <span className="truncate">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {files.length === 0 && (
        <p className="text-right text-gray-500 mt-2">
          Upload Need list to view comparison of Vendors.
        </p>
      )}
    </div>
  );
}