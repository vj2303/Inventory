import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };
  
  const handleFileChange = (file: File) => {
    if (file) {
      onImageUpload(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBrowseClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center h-40 cursor-pointer"
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Product preview" 
            className="h-full w-full object-contain"
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center">Drag image here</p>
            <p className="text-sm text-gray-500 text-center">or</p>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-500 text-sm mt-1"
            >
              Browse image
            </button>
          </>
        )}
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;