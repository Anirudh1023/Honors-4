
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { InputField } from '@/types';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';

interface DynamicInputFieldProps {
  input: InputField;
  updateInput: (id: string, value: string | File | null) => void;
  removeInput: (id: string) => void;
  canRemove: boolean;
}

const DynamicInputField: React.FC<DynamicInputFieldProps> = ({
  input,
  updateInput,
  removeInput,
  canRemove
}) => {
  // Function to handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInput(input.id, e.target.value);
  };

  // Function to handle audio recording/uploading
  const handleAudioInput = (file: File) => {
    updateInput(input.id, file);
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-white shadow-sm animate-fade-in">
      <div className="flex justify-between items-center">
        <Label htmlFor={input.id} className="text-sm font-medium">
          {input.name} {input.required && <span className="text-red-500">*</span>}
        </Label>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeInput(input.id)}
            className="h-8 w-8 text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <div className="mt-1">
        {input.type === 'text' ? (
          <Input
            id={input.id}
            value={input.value as string || ''}
            onChange={handleTextChange}
            placeholder={`Enter ${input.name}`}
            className="w-full"
          />
        ) : (
          <div className="space-y-2">
            <AudioRecorder onAudioRecorded={handleAudioInput} />
            <div className="text-sm text-center text-gray-500">or</div>
            <AudioUploader onFileSelected={handleAudioInput} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicInputField;
