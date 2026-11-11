'use client';

import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { getProductPhotoUrl } from '@/app/utils/get-product-photo-url';

interface ProductPhotoProps {
  photo?: string | null;
  code: string;
  className: string;
  iconSize?: number;
}

export function ProductPhoto({ photo, code, className, iconSize = 20 }: ProductPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const photoUrl = getProductPhotoUrl(photo);

  if (!photoUrl || hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center overflow-hidden bg-muted text-muted-foreground`}
        title={hasError ? 'Não foi possível carregar a imagem' : 'Produto sem foto'}
      >
        <ImageIcon size={iconSize} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photoUrl}
        alt={`Foto do produto ${code}`}
        fill
        sizes="(max-width: 1279px) 56px, 48px"
        className="object-cover"
        onError={() => {
          console.error('Erro ao carregar imagem do produto:', {
            code,
            photo,
            photoUrl,
          });

          setHasError(true);
        }}
      />
    </div>
  );
}
