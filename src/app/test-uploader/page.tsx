"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function TestUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleFiles = (files: FileList) => {
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  return (
    <div className="p-10">
      <div
        className="w-full h-48 border-2 border-dashed border-black flex items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        Drop or Click
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      <div className="flex gap-4 mt-4">
        {images.map((img, i) => {
          const url = URL.createObjectURL(img);
          return (
            <Image
              key={i}
              src={url}
              width={80}
              height={80}
              alt="preview"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          );
        })}
      </div>
    </div>
  );
}
