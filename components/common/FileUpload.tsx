import React from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
}

const FileUpload = ({ onFileSelect, accept }: FileUploadProps) => {
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    if (file && file.type.startsWith(accept.replace('/*', ''))) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <label
        className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <span className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="font-medium text-gray-600">
            {fileName || <>Kéo thả file vào đây, hoặc <span className="text-emerald-600 underline">bấm để chọn</span></>}
          </span>
        </span>
        <input type="file" name="file_upload" className="hidden" accept={accept} onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default FileUpload;
