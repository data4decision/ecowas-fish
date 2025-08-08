import React from "react";

export default function RejectModal({ file, onClose, onConfirm }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <h3 className="text-lg font-bold text-[#0b0b5c] mb-4">Confirm Rejection</h3>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to reject the file <strong>{file.title}</strong> from <strong>{file.country}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => onConfirm(file)}
          >
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  );
}
