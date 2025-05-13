
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputField, ModelConfig as ModelConfigType } from '@/types';
import InputsManager from './InputsManager';

interface ModelConfigProps {
  config: ModelConfigType;
  updateConfig: (updatedConfig: ModelConfigType) => void;
  onRunModel: () => void;
  isProcessing: boolean;
}

const ModelConfig: React.FC<ModelConfigProps> = ({
  config, 
  updateConfig, 
  onRunModel,
  isProcessing
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleModelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      ...config,
      name: e.target.value
    });
  };

  const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      ...config,
      endpoint: e.target.value
    });
  };

  const handleOutputTypeChange = (value: "text" | "audio") => {
    updateConfig({
      ...config,
      outputType: value
    });
  };

  const handleInputsChange = (newInputs: InputField[]) => {
    updateConfig({
      ...config,
      inputs: newInputs
    });
  };

  return (
    <Card className="w-full border-2 shadow-md">
      <CardHeader className="pb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-lab-blue">{config.name || "New Model"}</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600 truncate">
              {config.endpoint || "No endpoint configured"}
            </CardDescription>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <>
          <CardContent className="pt-0">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="modelName">Model Name</Label>
                    <Input
                      id="modelName"
                      placeholder="Enter model name"
                      value={config.name}
                      onChange={handleModelNameChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endpoint">API Endpoint URL</Label>
                    <Input
                      id="endpoint"
                      placeholder="http://localhost:8000/api/model"
                      value={config.endpoint}
                      onChange={handleEndpointChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="outputType">Output Type</Label>
                    <Select
                      value={config.outputType}
                      onValueChange={handleOutputTypeChange}
                    >
                      <SelectTrigger id="outputType" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-lg font-medium">Input Fields</Label>
                  <div className="mt-2">
                    <InputsManager
                      inputs={config.inputs}
                      setInputs={handleInputsChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button onClick={onRunModel} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Run Model"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ModelConfig;
