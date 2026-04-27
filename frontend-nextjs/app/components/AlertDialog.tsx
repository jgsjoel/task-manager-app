'use client';

import { useState, useEffect } from 'react';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export const AlertDialog = ({
  isOpen,
  title,
  message,
  buttonText = 'OK',
  onClose,
}: AlertDialogProps) => {
  const [rendered, setRendered] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Elevated panel */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 p-6 max-w-sm w-full mx-4 transition-all duration-200 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'
        }`}
      >
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
