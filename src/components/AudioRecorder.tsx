
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, FileAudio } from "lucide-react";

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => void;
  className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Convert Blob to File
        const now = new Date();
        const filename = `recording_${now.toISOString().replace(/[:.]/g, '-')}.wav`;
        const file = new File([audioBlob], filename, { type: 'audio/wav' });
        onAudioRecorded(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button 
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"} 
          size="sm"
          className="flex items-center gap-1"
        >
          {isRecording ? (
            <>
              <MicOff size={18} /> Stop Recording
            </>
          ) : (
            <>
              <Mic size={18} /> Record Audio
            </>
          )}
        </Button>
      </div>
      
      {audioUrl && (
        <div className="mt-2">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
