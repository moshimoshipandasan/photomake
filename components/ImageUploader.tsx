
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full md:w-1/2 h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-sky-500 bg-sky-900/30' : 'border-slate-600 hover:border-sky-600 hover:bg-slate-700/50'}`}
      >
        <div className="text-center">
          <UploadIcon className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-sky-400' : 'text-slate-500'}`} />
          <p className="font-semibold text-slate-300">Drag & Drop or <span className="text-sky-400">Browse</span></p>
          <p className="text-xs text-slate-500 mt-1">Supports: JPG, PNG, WEBP</p>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </div>
      </label>
      <div className="w-full md:w-1/2 h-64 bg-slate-900/50 rounded-xl flex items-center justify-center border border-slate-700 overflow-hidden">
        {preview ? (
          <img src={preview} alt="Image preview" className="h-full w-full object-contain" />
        ) : (
          <p className="text-slate-500">Image Preview</p>
        )}
      </div>
    </div>
  );
};
