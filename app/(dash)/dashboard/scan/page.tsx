"use client";

import { useState } from "react";
import { Upload, FileText, User, GraduationCap, Image as ImageIcon, ScanEye } from "lucide-react";

type CVResult = {
  name: string;
  education: string;
  photoUrl?: string;
};

export default function ScanCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<CVResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setResult(null);

    // 🔌 TODO: ganti ke API backend kamu
    // const formData = new FormData();
    // formData.append("cv", file);
    // const res = await fetch("/api/scan-cv", { method: "POST", body: formData });
    // const data = await res.json();

    // Dummy result
    await new Promise((r) => setTimeout(r, 1500));
    setResult({
      name: "Budi Santoso",
      education: "Bachelor of Computer Science - ITS",
      photoUrl: "/dummy-avatar.png",
    });

    setScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Scan CV</h1>

      {/* Upload area */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Upload size={20} /> Upload CV (PDF / Image)
        </h2>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFile}
          className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#0097b2] file:px-4 file:py-2 file:text-white hover:file:bg-[#007b8a]"
        />
        {file && (
          <div className="mt-3 flex items-center gap-4">
            <FileText className="text-gray-500" />
            <span className="text-sm text-gray-800">{file.name}</span>
          </div>
        )}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-lg border"
            />
          </div>
        )}
      </section>

      {/* Action */}
      <section className="bg-white rounded-xl shadow p-6">
        <button
          disabled={!file || scanning}
          onClick={handleScan}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0097b2] text-white hover:bg-[#007b8a] transition disabled:opacity-60"
        >
          <ScanEye size={18} />
          {scanning ? "Scanning…" : "Scan CV"}
        </button>
      </section>

      {/* Results */}
      {result && (
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Hasil Ekstraksi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <User className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="font-medium">{result.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Level Edukasi</p>
                <p className="font-medium">{result.education}</p>
              </div>
            </div>
            {result.photoUrl && (
              <div className="flex items-center gap-3">
                <ImageIcon className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Foto Kandidat</p>
                  <img
                    src={result.photoUrl}
                    alt="foto"
                    className="mt-1 h-24 w-24 object-cover rounded-lg border"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
