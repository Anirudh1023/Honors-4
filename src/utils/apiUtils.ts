
import { ModelConfig, ApiResponse, InputField } from "@/types";
import { toast } from "sonner";

export const callModelEndpoint = async (
  config: ModelConfig
): Promise<ApiResponse> => {
  try {
    // Create FormData for mixed content (text and files)
    const formData = new FormData();
    
    // Check if we have all required inputs
    const missingRequiredInput = config.inputs.some(
      (input) => input.required && !input.value
    );
    
    if (missingRequiredInput) {
      return {
        success: false,
        error: "Please fill in all required inputs",
      };
    }

    // Add each input to the form data
    config.inputs.forEach((input) => {
      if (input.type === "text" && typeof input.value === "string") {
        formData.append(input.name, input.value);
      } else if (input.type === "audio" && input.value instanceof File) {
        formData.append(input.name, input.value);
      }
    });

    // Add the output type preference
    formData.append("output_type", config.outputType);

    console.log("Calling API endpoint:", config.endpoint);
    
    const response = await fetch(config.endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type");
    
    // Handle JSON response (typically for text output)
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      return {
        success: true,
        data: {
          text: jsonData.text || jsonData.result || JSON.stringify(jsonData),
        },
      };
    } 
    // Handle audio response
    else if (contentType && contentType.includes("audio/")) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      return {
        success: true,
        data: {
          audioUrl,
        },
      };
    } 
    // Fallback for other response types
    else {
      const text = await response.text();
      return {
        success: true,
        data: {
          text,
        },
      };
    }
  } catch (error) {
    console.error("Error calling model endpoint:", error);
    toast.error("Failed to call API endpoint");
    return {
      success: false,
      error: `Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};
