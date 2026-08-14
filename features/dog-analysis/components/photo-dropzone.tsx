import { Check, ImagePlus, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, KeyboardEvent, useRef, useState } from "react";
import { IMAGE_ACCEPT_ATTRIBUTE } from "../constants";
import { UploadedImage } from "./uploaded-image";

type PhotoDropzoneProps = { previewUrl: string; onSelect: (file?: File) => void; onRemove: () => void };

export function PhotoDropzone({ previewUrl, onSelect, onRemove }: PhotoDropzoneProps) {
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
      {previewUrl ? (
        <div className="preview-wrap">
          <UploadedImage src={previewUrl} alt="Selected dog preview" />
          <button className="remove-photo" onClick={(event) => { event.stopPropagation(); onRemove(); }} aria-label="Remove photo"><X size={17} /></button>
          <div className="preview-caption"><Check size={15} /> Looking good!</div>
        </div>
      ) : (
        <div className="drop-content">
          <div className="upload-icon"><UploadCloud size={30} /></div>
          <h3>Drop your best dog photo here</h3><p>or click to browse your files</p>
          <button className="choose-button" type="button"><ImagePlus size={17} /> Choose a photo</button>
        </div>
      )}
    </div>
  );
}
