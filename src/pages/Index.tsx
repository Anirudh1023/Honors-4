
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { ModelConfig as ModelConfigType, InputField, ApiResponse } from '@/types';
import { v4 as uuidv4 } from '@/utils/uuid';
import ModelConfig from '@/components/ModelConfig';
import ModelResult from '@/components/ModelResult';
import { callModelEndpoint } from '@/utils/apiUtils';
import { toast } from 'sonner';

const Index = () => {
  const [models, setModels] = useState<ModelConfigType[]>(() => {
    const initialModel: ModelConfigType = {
      id: uuidv4(),
      name: "Speech Model",
      endpoint: "http://localhost:8000/api/process",
      inputs: [
        {
          id: uuidv4(),
          name: "Input Text",
          type: "text",
          value: "",
          required: true
        }
      ],
      outputType: "text"
    };
    return [initialModel];
  });

  const [activeModelId, setActiveModelId] = useState<string | null>(models[0]?.id || null);
  const [results, setResults] = useState<Record<string, ApiResponse | null>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const addNewModel = () => {
    const newId = uuidv4();
    const newModel: ModelConfigType = {
      id: newId,
      name: `Model ${models.length + 1}`,
      endpoint: "",
      inputs: [
        {
          id: uuidv4(),
          name: "Input 1",
          type: "text",
          value: "",
          required: true
        }
      ],
      outputType: "text"
    };
    setModels([...models, newModel]);
    setActiveModelId(newId);
  };

  const updateModel = (modelId: string, updatedModel: ModelConfigType) => {
    setModels(
      models.map(model => 
        model.id === modelId ? { ...updatedModel } : model
      )
    );
  };

  const runModel = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    
    if (!model) {
      toast.error("Model configuration not found");
      return;
    }

    if (!model.endpoint) {
      toast.error("API endpoint URL is required");
      return;
    }

    setProcessing(prev => ({ ...prev, [modelId]: true }));
    
    try {
      const response = await callModelEndpoint(model);
      setResults(prev => ({ ...prev, [modelId]: response }));
      
      if (response.success) {
        toast.success("Model executed successfully");
      } else {
        toast.error(response.error || "Failed to execute model");
      }
    } catch (error) {
      console.error("Error running model:", error);
      setResults(prev => ({ 
        ...prev, 
        [modelId]: {
          success: false,
          error: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      }));
      toast.error("An error occurred while running the model");
    } finally {
      setProcessing(prev => ({ ...prev, [modelId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-lab-darkGray mb-2">Speech Lab Research Platform</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure and test your speech processing models through easy-to-use interfaces
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {models.map((model) => (
            <div key={model.id} className="space-y-6">
              <ModelConfig
                config={model}
                updateConfig={(updatedModel) => updateModel(model.id, updatedModel)}
                onRunModel={() => runModel(model.id)}
                isProcessing={!!processing[model.id]}
              />
              
              <ModelResult
                result={results[model.id] || null}
                outputType={model.outputType}
                isLoading={!!processing[model.id]}
              />
            </div>
          ))}

          <Button
            onClick={addNewModel}
            variant="outline"
            className="mt-8 border-dashed border-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Model Configuration
          </Button>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Speech Lab Research Platform &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
