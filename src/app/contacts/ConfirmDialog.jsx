"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] flex flex-col items-center">
        <div className="font-bold text-lg mb-2">{title}</div>
        <div className="text-gray-700 mb-4 text-center">{message}</div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
          >
            No!
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Sure!
          </button>
        </div>
      </div>
    </div>
  );
}
