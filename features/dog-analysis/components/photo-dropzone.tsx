import Image from "next/image";
import { FolderOpen, Trash2 } from "lucide-react";
import { ChangeEvent, DragEvent, KeyboardEvent, useRef, useState } from "react";
import { IMAGE_ACCEPT_ATTRIBUTE } from "../constants";
import { UploadedImage } from "./uploaded-image";

type PhotoDropzoneProps = { fileName?: string; previewUrl: string; onSelect: (file?: File) => void; onRemove: () => void };

export function PhotoDropzone({ fileName, previewUrl, onSelect, onRemove }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const openPicker = () => inputRef.current?.click();

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    onSelect(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    onSelect(event.dataTransfer.files?.[0]);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") openPicker();
  }

  return (
    <div
      className={`dropzone ${isDragging ? "is-dragging" : ""} ${previewUrl ? "has-preview" : ""}`}
      onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={openPicker}
      role="button" tabIndex={0} onKeyDown={handleKeyboard}
    >
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT_ATTRIBUTE} onChange={handleInput} hidden />
      <div className="dropzone-main">
        <div className="drop-content">
          <div className="upload-icon"><Image src="/upload-cloud.png" alt="" width={140} height={140} /></div>
          <h3>Drop your dog’s photo here</h3><p>or <strong>click to browse</strong></p>
          <small>JPG, PNG, WEBP up to 5MB</small>
          <button className="choose-button" type="button"><FolderOpen size={17} /> Choose File</button>
        </div>
      </div>
      {previewUrl && <div className="preview-wrap" onClick={(event) => event.stopPropagation()}>
        <div className="preview-image"><UploadedImage src={previewUrl} alt="Selected dog preview" /><span>✓</span></div>
        <strong>{fileName || "Ready to analyze"}</strong>
        <small>Photo selected</small>
        <button className="remove-photo" onClick={onRemove} aria-label="Remove photo"><Trash2 size={14} /> Remove</button>
      </div>}
    </div>
  );
}
