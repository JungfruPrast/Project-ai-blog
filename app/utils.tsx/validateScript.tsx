'use client'
import { useEffect } from 'react';
import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';

const applyCSPHeaders = async () => {
  // Create a new Request object with an empty URL
  const request = new NextRequest(''); 
  const response = middleware(request); // Apply middleware
  // Check if response is a NextResponse
  if (response instanceof NextResponse) {
    // Retrieve headers from the response and set them to the document
    const headers = response.headers;
    headers.forEach((value, name) => {
      const meta = document.createElement('meta');
      meta.setAttribute(name, value);
      document.head?.appendChild(meta);
    });
  }
};

const useNonceValidatedScript = (nonce: string, jsonData: any) => {
  useEffect(() => {
    if (nonce) {
      applyCSPHeaders(); // Apply CSP headers

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.nonce = nonce;
      script.textContent = JSON.stringify(jsonData);

      document.head?.appendChild(script);

      return () => {
        document.head?.removeChild(script);
      };
    }
  }, [nonce, jsonData]);
};

export default useNonceValidatedScript;
