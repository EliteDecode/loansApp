// Cloudinary upload helper
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const { onProgress, folder = "loan-app" } = options;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    formData.append("api_key", CLOUDINARY_API_KEY);

    if (folder) {
      formData.append("folder", folder);
    }

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    // Handle successful upload
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            public_id: response.public_id,
            secure_url: response.secure_url,
            original_filename: response.original_filename,
            format: response.format,
            bytes: response.bytes,
          });
        } catch (error) {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    // Handle upload errors
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    // Handle upload timeout
    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timed out"));
    });

    // Set timeout to 5 minutes
    xhr.timeout = 5 * 60 * 1000;

    // Start the upload
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`
    );
    xhr.send(formData);
  });
};

// Helper to upload multiple files with progress tracking
export const uploadMultipleFiles = async (
  files: File[],
  options: UploadOptions = {}
): Promise<{ results: UploadResult[]; errors: Error[] }> => {
  const results: UploadResult[] = [];
  const errors: Error[] = [];

  for (const file of files) {
    try {
      const result = await uploadToCloudinary(file, options);
      results.push(result);
    } catch (error) {
      errors.push(error as Error);
    }
  }

  return { results, errors };
};
