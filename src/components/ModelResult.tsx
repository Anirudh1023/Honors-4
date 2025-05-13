
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse, InputType } from '@/types';

interface ModelResultProps {
  result: ApiResponse | null;
  outputType: InputType;
  isLoading: boolean;
}

const ModelResult: React.FC<ModelResultProps> = ({ result, outputType, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-6 w-full border-2 shadow-md">
        <CardHeader>
          <CardTitle>Processing...</CardTitle>
          <CardDescription>Your request is being processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-lab-blue border-b-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  if (!result.success) {
    return (
      <Card className="mt-6 w-full border-2 border-red-200 shadow-md">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription className="text-red-500">
            Failed to get results from the model
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-red-500">{result.error || "Unknown error occurred"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 w-full border-2 border-green-200 shadow-md animate-fade-in">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-green-600">Result</CardTitle>
        <CardDescription className="text-green-700">
          Successfully processed {outputType} output
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {outputType === 'text' && result.data?.text ? (
          <div className="p-4 bg-white border rounded-md">
            <p className="whitespace-pre-wrap font-mono text-sm">{result.data.text}</p>
          </div>
        ) : outputType === 'audio' && result.data?.audioUrl ? (
          <div className="p-4 bg-white border rounded-md">
            <audio controls src={result.data.audioUrl} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              Audio output generated successfully
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No {outputType} data received from the model</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelResult;
