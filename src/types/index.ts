
export type InputType = "text" | "audio";

export interface InputField {
  id: string;
  name: string;
  type: InputType;
  value: string | File | null;
  required?: boolean;
}

export interface ModelConfig {
  id: string;
  name: string;
  endpoint: string;
  inputs: InputField[];
  outputType: InputType;
}

export interface ApiResponse {
  success: boolean;
  data?: {
    text?: string;
    audioUrl?: string;
  };
  error?: string;
}
