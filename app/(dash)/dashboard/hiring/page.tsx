"use client";

import { useState } from "react";
import { Upload, Database, Play, Save } from "lucide-react";

export default function HiringPredictorPage() {
  const [manualInput, setManualInput] = useState({
    name: "",
    position: "",
    interviewScore: "",
    personalityScore: "",
    skillScore: "",
    educationLevel: "",
    recruitmentStrategy: "",
  });

  const [prediction, setPrediction] = useState<string | null>(null);

  // Dummy: jalankan prediksi manual
  const handlePredict = () => {
    // logika dummy → misalnya ambil rata-rata skor
    const avg =
      (Number(manualInput.interviewScore) +
        Number(manualInput.personalityScore) +
        Number(manualInput.skillScore)) /
      3;

    if (avg >= 80) setPrediction("Highly Recommended ✅");
    else if (avg >= 65) setPrediction("Recommended 👍");
    else setPrediction("Not Recommended ❌");
  };

  const handleSave = () => {
    alert("Hasil prediksi disimpan ke dashboard (dummy).");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Hiring Predictor
      </h1>

      {/* ===== 1. Import Data ===== */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Import Data
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0097b2] text-white hover:bg-[#007b8a] transition">
            <Database size={18} /> Import from dashboard
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition">
            <Upload size={18} /> Upload CSV/Excel
            <input type="file" accept=".csv,.xlsx" hidden />
          </label>
        </div>
      </section>

      {/* ===== 2. Input Manual ===== */}
      <section className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Input Manual untuk Prediksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Kandidat"
            value={manualInput.name}
            onChange={(e) =>
              setManualInput({ ...manualInput, name: e.target.value })
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Posisi"
            value={manualInput.position}
            onChange={(e) =>
              setManualInput({ ...manualInput, position: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Interview Score"
            value={manualInput.interviewScore}
            onChange={(e) =>
              setManualInput({ ...manualInput, interviewScore: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Personality Score"
            value={manualInput.personalityScore}
            onChange={(e) =>
              setManualInput({
                ...manualInput,
                personalityScore: e.target.value,
              })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Skill Score"
            value={manualInput.skillScore}
            onChange={(e) =>
              setManualInput({ ...manualInput, skillScore: e.target.value })
            }
            className="input-field"
          />
          <select
            value={manualInput.educationLevel}
            onChange={(e) =>
              setManualInput({ ...manualInput, educationLevel: e.target.value })
            }
            className="input-field"
          >
            <option value="">Pilih Level Edukasi</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="Doctoral">Doctoral</option>
          </select>
          <select
            value={manualInput.recruitmentStrategy}
            onChange={(e) =>
              setManualInput({
                ...manualInput,
                recruitmentStrategy: e.target.value,
              })
            }
            className="input-field"
          >
            <option value="">Pilih Strategi Rekrutmen</option>
            <option value="Job Fair">Job Fair</option>
            <option value="Referral">Referral</option>
            <option value="Online Test">Online Test</option>
            <option value="Walk-in">Walk-in</option>
          </select>
        </div>
        <button
          onClick={handlePredict}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0097b2] text-white hover:bg-[#007b8a] transition"
        >
          <Play size={18} /> Jalankan Prediksi
        </button>
      </section>

      {/* ===== 3. Output Prediksi ===== */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Hasil Prediksi
        </h2>
        {prediction ? (
          <div className="p-4 rounded-lg border bg-gray-50 text-gray-800 font-medium">
            {prediction}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Belum ada prediksi.</p>
        )}
        {prediction && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            <Save size={18} /> Simpan ke Dashboard
          </button>
        )}
      </section>
    </div>
  );
}

/* Tambahkan ini di globals.css atau tailwind layer component
.input-field {
  @apply w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none;
}
*/
