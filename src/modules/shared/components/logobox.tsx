import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { S3 } from "aws-sdk";
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

export const Logobox = ({
  fieldName,
  fieldLabel,
  control,
  required,
  setValue,
  existingValue,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(existingValue || null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (existingValue) {
      setPreview(existingValue);
    }
  }, [existingValue]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploading(true);

      const s3 = new S3({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
        Key: `uploads/${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      try {
        const data = await s3.upload(params).promise();
        setUploading(false);

        if (data.Location) {
          setValue(fieldName, data.Location);
        } else {
          console.error("Error uploading file: ", data);
        }
      } catch (error) {
        setUploading(false);
        console.error("Error uploading file: ", error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
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
                  className: `relative border-2 border-dashed border-gray-300 cursor-pointer h-24 rounded-sm text-xs overflow-hidden flex items-center justify-center bg-white ${
                    preview ? "p-1" : ""
                  }`,
                })}
              >
                <input {...getInputProps()} className={"w-full h-auto"} />
                {uploading && preview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white  bg-opacity-50 ">
                    <p className={"font-semibold"}>Uploading...</p>
                  </div>
                )}
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1080}
                  />
                ) : (
                  <p className="text-center text-gray-500 p-2">
                    Drag &apos;n&apos; drop an image here, or click to select
                    one
                  </p>
                )}
              </div>
            </FormControl>
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
