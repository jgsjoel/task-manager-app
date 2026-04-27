interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export const AlertDialog= ({
  isOpen,
  title,
  message,
  buttonText = 'OK',
  onClose,
}: AlertDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

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
