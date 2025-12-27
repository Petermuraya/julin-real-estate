"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt?: string;
}

export default function PropertyCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images || !images.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full h-64 md:h-96">
      <Image
        src={images[current]}
        alt={alt || `Property image ${current + 1}`}
        className="rounded shadow"
        fill
        style={{ objectFit: "cover" }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded z-10"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded z-10"
          >
            ›
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
