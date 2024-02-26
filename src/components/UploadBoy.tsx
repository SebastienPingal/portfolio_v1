'use client'

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import Image from 'next/image';

export default function UploadBoy() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const upload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(
      `/api/image/upload?filename=${file.name}`,
      {
        method: 'POST',
        body: file,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;

    setBlob(newBlob);
  }


  return (
    <div className="flex flex-col gap-2 bg-secondary/50 p-2 rounded shadow">
      <div className='flex gap-2'>
        <Input name="file" ref={inputFileRef} type="file" required />
        <Button type="button" onClick={(e) => { upload(e) }}>Upload</Button>
      </div>

      {blob && (
        <div className='flex flex-col gap-2'>
          Blob url:
          <div className='flex gap-2'>
            <Input className='w-full' value={blob.url} readOnly onFocus={(e) => e.target.select()} />
            <Button onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(blob.url) }}><Copy /></Button>
          </div>
          <Image src={blob.url} alt="Uploaded image" width={200} height={200}  className='object-contain'/>
        </div>
      )}
    </div>
  );
}