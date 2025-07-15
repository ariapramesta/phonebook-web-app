"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditAvatarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactId = searchParams.get("id");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !contactId) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("id", contactId);
    const res = await fetch("/api/contacts/avatar", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to upload avatar");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Edit Avatar</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <div className="w-32 h-32 relative mb-2">
          <Image
            src={preview || "/avatar.png"}
            alt="Avatar Preview"
            fill
            className="rounded-full object-cover border"
            style={{ objectFit: "cover" }}
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg mt-2 disabled:opacity-60"
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Save Avatar"}
        </button>
      </form>
    </div>
  );
}
