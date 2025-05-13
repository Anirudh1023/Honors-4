
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InputField } from '@/types';
import DynamicInputField from './DynamicInputField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from '@/utils/uuid';

interface InputsManagerProps {
  inputs: InputField[];
  setInputs: React.Dispatch<React.SetStateAction<InputField[]>>;
}

const InputsManager: React.FC<InputsManagerProps> = ({ inputs, setInputs }) => {
  // Add a new input field
  const addInputField = () => {
    const newId = uuidv4();
    const newInput: InputField = {
      id: newId,
      name: `Input ${inputs.length + 1}`,
      type: 'text',
      value: '',
      required: true
    };
    
    setInputs([...inputs, newInput]);
  };

  // Update an existing input field
  const updateInput = (id: string, value: string | File | null) => {
    setInputs(
      inputs.map(input => 
        input.id === id ? { ...input, value } : input
      )
    );
  };

  // Update input name
  const updateInputName = (id: string, name: string) => {
    setInputs(
      inputs.map(input => 
        input.id === id ? { ...input, name } : input
      )
    );
  };

  // Update input type
  const updateInputType = (id: string, type: "text" | "audio") => {
    setInputs(
      inputs.map(input => 
        input.id === id ? { ...input, type, value: type === 'text' ? '' : null } : input
      )
    );
  };

  // Toggle required status
  const toggleInputRequired = (id: string) => {
    setInputs(
      inputs.map(input => 
        input.id === id ? { ...input, required: !input.required } : input
      )
    );
  };

  // Remove an input field
  const removeInput = (id: string) => {
    setInputs(inputs.filter(input => input.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {inputs.map((input) => (
          <div key={input.id} className="bg-gray-50 p-4 rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`name-${input.id}`}>Input Name</Label>
                <Input 
                  id={`name-${input.id}`}
                  value={input.name}
                  onChange={(e) => updateInputName(input.id, e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`type-${input.id}`}>Input Type</Label>
                <Select 
                  value={input.type} 
                  onValueChange={(value: "text" | "audio") => updateInputType(input.id, value)}
                >
                  <SelectTrigger id={`type-${input.id}`} className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id={`required-${input.id}`}
                checked={input.required}
                onChange={() => toggleInputRequired(input.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor={`required-${input.id}`} className="text-sm">Required</Label>
            </div>
            
            <DynamicInputField
              input={input}
              updateInput={updateInput}
              removeInput={removeInput}
              canRemove={inputs.length > 1}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={addInputField}
        variant="outline"
        className="w-full border-dashed border-2"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Input Field
      </Button>
    </div>
  );
};

export default InputsManager;
