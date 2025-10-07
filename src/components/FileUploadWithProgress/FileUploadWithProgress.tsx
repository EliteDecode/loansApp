import { useState, useRef } from "react";
import { uploadToCloudinary, type UploadProgress } from "@/lib/cloudinary";

interface FileUploadWithProgressProps {
  onFileUploaded: (url: string) => void;
  onUploadError: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label: string;
  className?: string;
  value?: string; // Add value prop to make it controlled
  folder?: string; // Add folder prop to customize upload folder
}

export default function FileUploadWithProgress({
  onFileUploaded,
  onUploadError,
  accept = "image/*,application/pdf",
  maxSizeMB = 5,
  label,
  className = "",
  value = "",
  folder = "loan-app",
}: FileUploadWithProgressProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the value prop if provided, otherwise use local state
  const uploadedFile = value || null;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onUploadError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(",").map((type) => type.trim());
    const isValidType = allowedTypes.some((type) => {
      if (type.includes("/*")) {
        return file.type.startsWith(type.split("/")[0] + "/");
      }
      return file.type === type;
    });

    if (!isValidType) {
      onUploadError("Invalid file type. Please select a valid file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, {
        onProgress: (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        },
        folder: folder,
      });

      onFileUploaded(result.secure_url);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isUploading
            ? "border-primary bg-primary/5"
            : uploadedFile
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-2">
            <div className="w-8 h-8 mx-auto text-green-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-700">
              File uploaded successfully!
            </p>
            <p className="text-xs text-gray-500">
              Click to upload a different file
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-8 h-8 mx-auto text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept.includes("image") && accept.includes("pdf")
                  ? "Images or PDF files"
                  : accept.includes("image")
                  ? "Image files"
                  : "PDF files"}{" "}
                (max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
