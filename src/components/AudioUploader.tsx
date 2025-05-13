
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileAudio } from "lucide-react";

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  className?: string;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelected, className }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl);
      onFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
        data-testid="audio-file-input"
      />
      
      <Button 
        onClick={handleButtonClick}
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <FileAudio size={18} />
        Upload Audio File
      </Button>
      
      {fileName && (
        <div className="text-sm text-gray-500 mt-1">
          Selected: {fileName}
        </div>
      )}
      
      {audioUrl && (
        <div className="mt-2">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
