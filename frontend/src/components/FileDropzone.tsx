import { useRef, useState } from 'react';
import type { DragEvent, KeyboardEvent } from 'react';
import { FileText, Upload, X } from 'lucide-react';

interface FileDropzoneProps {
  accept: string;
  label: string;
  hint: string;
  selectedName?: string;
  onSelect: (file: File) => void;
  onClear: () => void;
}

export function FileDropzone({ accept, label, hint, selectedName, onSelect, onClear }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectFile = (file?: File) => {
    if (file) onSelect(file);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  if (selectedName) {
    return (
      <div className="file-pill">
        <FileText size={17} />
        <span>{selectedName}</span>
        <button type="button" aria-label={`Quitar ${selectedName}`} onClick={clearFile}><X size={15} /></button>
      </div>
    );
  }

  return (
    <div
      className={`drop-zone ${isDragging ? 'is-dragging' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={(event) => selectFile(event.target.files?.[0])} hidden />
      <Upload size={26} />
      <strong>{label}</strong>
      <span>{hint}</span>
    </div>
  );
}
