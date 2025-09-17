'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/components/form';
import { RequiredIndicator } from '@/modules/shared/components/required-indicator';
import { Label } from '@/modules/ui/components/label';
import { Switch } from '@/modules/ui/components/switch';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorFieldProps {
  fieldName: string;
  fieldLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  required?: boolean;
  showPreviewToggle?: boolean;
}

export const MarkdownEditorField = ({
  fieldName,
  fieldLabel,
  control,
  required = false,
  showPreviewToggle = true,
}: MarkdownEditorFieldProps) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-1 text-sm text-[#003049]">
            {fieldLabel}
            {required && <RequiredIndicator />}
          </FormLabel>
          <FormControl>
            <div className="rounded-md border bg-white p-2" data-color-mode="light">
              <MDEditor 
                value={field.value} 
                onChange={field.onChange} 
                height={300} 
              />
            </div>
          </FormControl>
          {showPreviewToggle && (
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                checked={showPreview} 
                onCheckedChange={setShowPreview} 
              />
              <Label className="text-sm">Show Preview</Label>
            </div>
          )}
          {showPreview && (
            <div className="prose prose-neutral max-w-none border-t pt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {field.value}
              </ReactMarkdown>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};