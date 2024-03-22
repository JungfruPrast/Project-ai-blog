'use client'
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageEnlargeOverlayProps {
  src: string;
  alt?: string; // alt is optional, could be undefined
  width: number;
  height: number;
}

const ImageEnlargeOverlay: React.FC<ImageEnlargeOverlayProps> = ({ src, alt = '', width, height }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const toggleOverlay = () => setIsOverlayVisible(!isOverlayVisible);

  return (
    <div>
      {/* Thumbnail Image */}
      <div onClick={toggleOverlay} className="cursor-zoom-in">
        <Image src={src} alt={alt} width={width} height={height} layout="responsive" />
      </div>

      {/* Overlay */}
      {isOverlayVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={toggleOverlay}
        >
          <div className="bg-white p-5 max-w-3xl max-h-full overflow-auto">
            {/* Larger Image */}
            <Image src={src} alt={alt} width={1400} height={1400} layout="responsive" className="cursor-zoom-out" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEnlargeOverlay;
