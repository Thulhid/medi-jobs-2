"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/ui/components/form";
import Image from "next/image";
import { RequiredIndicator } from "@/modules/shared/components/required-indicator";

interface Props {
  fieldName: string;
  fieldLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  required: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  existingValue?: string;
}

export const SecureLogobox = ({
  fieldName,
  fieldLabel,
  control,
  required,
  setValue,
  existingValue,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(existingValue || null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingValue) {
      setPreview(existingValue);
    }
  }, [existingValue]);

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      setError(null);
      console.log("Starting upload for file:", file.name, "Type:", file.type);

      // Step 1: Get presigned URL from our API
      const response = await fetch("/api/upload/s3-presigned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder: "hospitals", // Organize uploads by type
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to get upload URL: ${response.status}`);
      }

      const { presignedUrl, fileUrl } = await response.json();
      console.log("Got presigned URL, uploading to S3...");

      // Step 2: Upload file directly to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        console.error("S3 Upload Error:", uploadResponse.status, uploadResponse.statusText);
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status}`);
      }

      console.log("Upload successful! File URL:", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      // Provide more helpful error messages
      if (errorMessage.includes("Failed to get upload URL")) {
        setError("S3 configuration error. Please check your AWS credentials.");
      } else if (
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("fetch")
      ) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else if (errorMessage.includes("400")) {
        setError(
          "Invalid file. Please ensure your image is properly formatted.",
        );
      } else if (errorMessage.includes("403")) {
        setError("Permission denied. Please check your AWS S3 permissions.");
      } else {
        setError(`Upload failed: ${errorMessage}`);
      }
      return null;
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploading(true);
      setError(null);

      const fileUrl = await uploadToS3(file);
      setUploading(false);

      if (fileUrl) {
        setValue(fieldName, fileUrl);
        setPreview(fileUrl);
      } else {
        // Revert preview if upload failed
        setPreview(existingValue || null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  return (
    <div className="flex gap-4 items-center">
      <FormField
        control={control}
        name={fieldName}
        render={() => (
          <FormItem>
            <FormLabel className="capitalize gap-1 flex text-[#003049] text-sm">
              {fieldLabel}
              {required && <RequiredIndicator />}
            </FormLabel>
            <FormControl>
              <div
                {...getRootProps({
                  className: `relative border-2 border-dashed rounded-sm text-xs overflow-hidden flex items-center justify-center bg-white cursor-pointer transition-colors
                                        ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
                                        ${preview ? "p-1 h-24" : "h-24"}
                                        ${uploading ? "pointer-events-none" : ""}`,
                })}
              >
                <input {...getInputProps()} className="w-full h-auto" />

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-semibold text-blue-600">
                        Uploading...
                      </p>
                    </div>
                  </div>
                )}

                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-sm"
                    width={1920}
                    height={1080}
                    onError={(e) => {
                      console.error("Image load error:", e);
                      setError("Failed to load image. Please try uploading again.");
                      setPreview(null);
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully:", preview);
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500 p-2">
                    {isDragActive ? (
                      <p>Drop the image here...</p>
                    ) : (
                      <p>
                        Drag &apos;n&apos; drop an image here, or click to
                        select one
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormControl>

            {error && <div className="text-red-600 text-xs mt-1">{error}</div>}

            <FormMessage />
          </FormItem>
        )}
      />
      {existingValue && (
        <p className="text-xs text-gray-500 w-44">
          Please drag and drop image or click on the image to update the current
          image.
        </p>
      )}
    </div>
  );
};
