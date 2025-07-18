import React from "react";

export default function PreviewModal({ file, onClose }) {
  if (!file || !file.url) return null;

  const fileType = file.url.split(".").pop().toLowerCase();

  const renderPreview = () => {
    if (fileType === "pdf") {
      return (
        <iframe
          src={file.url}
          title="PDF Preview"
          className="w-full h-[500px] border"
        />
      );
    }

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return (
        <img
          src={file.url}
          alt={file.title}
          className="w-full max-h-[500px] object-contain border"
        />
      );
    }

    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileType)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
          title="Document Preview"
          className="w-full h-[500px] border"
        />
      );
    }

    return <p className="text-sm text-gray-600">Preview not available for this file type.</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-[#0b0b5c] mb-4">Preview: {file.title}</h3>
        {renderPreview()}
      </div>
    </div>
  );
}
