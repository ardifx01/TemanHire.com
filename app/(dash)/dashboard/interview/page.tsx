"use client";

import { useMemo, useState } from "react";
import { Upload, Database, Phone, Send, CheckCircle2, Loader2, Info } from "lucide-react";

type PendingCandidate = {
  id: number;
  name: string;
  whatsapp: string; // +62…/08…
  position: string;
  source?: string;
};

// Dummy kandidat pending (nanti ganti fetch dari /api/dashboard/pending)
const dummyPending: PendingCandidate[] = [
  { id: 1, name: "Budi Santoso", whatsapp: "+6281234567890", position: "Frontend Developer", source: "Referral" },
  { id: 2, name: "Siti Aminah", whatsapp: "+6282233344455", position: "Data Scientist", source: "Online Test" },
  { id: 3, name: "Agus Wijaya", whatsapp: "+6281389988776", position: "Backend Developer", source: "Job Fair" },
];

export default function InterviewPage() {
  // ===== STATE: Sumber kandidat
  const [candidates] = useState<PendingCandidate[]>(dummyPending);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [manualWhatsApp, setManualWhatsApp] = useState<string>("");

  // ===== STATE: Strategi interview
  const [position, setPosition] = useState<string>("");
  const [channel, setChannel] = useState<"WhatsApp" | "Phone Call" | "Email">("WhatsApp");
  const [format, setFormat] = useState<"Async Q&A" | "Live Chat" | "Voice Call" | "Video Call">("Async Q&A");
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);
  const [template, setTemplate] = useState<"Default" | "Technical" | "HR">("Default");
  const [autoSave, setAutoSave] = useState<boolean>(true);

  // ===== STATE: UI submit
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Kandidat terpilih & field final
  const picked = useMemo(
    () => (selectedId !== "" ? candidates.find((c) => c.id === Number(selectedId)) ?? null : null),
    [selectedId, candidates]
  );
  const finalName = picked?.name ?? "Kandidat";
  const finalWhatsApp = (picked?.whatsapp ?? manualWhatsApp).trim();
  const finalPosition = position || picked?.position || "";

  // Validasi WA sederhana
  const isValidWhatsApp = useMemo(() => {
    if (!finalWhatsApp) return false;
    const wa = finalWhatsApp.replace(/\s|-/g, "");
    // +62xxxxxxxx atau 08xxxxxxxx
    return /^\+?62\d{8,15}$/.test(wa) || /^08\d{8,15}$/.test(wa);
  }, [finalWhatsApp]);

  // Preview pesan
  const messagePreview = useMemo(() => {
    const greet = language === "ID" ? `Halo ${finalName},` : `Hello ${finalName},`;
    const lead =
      language === "ID"
        ? `Anda diundang untuk interview posisi ${finalPosition || "(posisi)"} melalui ${channel}.`
        : `You are invited to an interview for ${finalPosition || "(position)"} via ${channel}.`;

    const style =
      template === "Technical"
        ? language === "ID"
          ? "Fokus pada pengalaman teknis, studi kasus, dan problem solving."
          : "We will focus on technical background, case study, and problem solving."
        : template === "HR"
        ? language === "ID"
          ? "Kami akan mengeksplorasi motivasi, budaya kerja, dan komunikasi."
          : "We will explore motivation, culture fit, and communication."
        : language === "ID"
        ? "Interview umum untuk memahami profil dan kecocokan Anda."
        : "General interview to understand your profile and fit.";

    const time = language === "ID" ? `Perkiraan durasi ${duration} menit.` : `Estimated duration ${duration} minutes.`;
    const closing =
      language === "ID" ? "Balas pesan ini untuk konfirmasi. Terima kasih!" : "Please reply to confirm. Thank you!";

    return `${greet}\n\n${lead}\n${style}\n${time}\n\n${closing}`;
  }, [finalName, finalPosition, channel, template, language, duration]);

  const handlePickFromDashboard = () => {
    setNotice({ type: "info", message: "Pilih kandidat pending di dropdown bawah (sementara tanpa modal)." });
  };

  const handleSubmit = async () => {
    setNotice(null);

    if (!isValidWhatsApp) {
      setNotice({ type: "error", message: "Nomor WhatsApp tidak valid. Gunakan format +62… atau 08…." });
      return;
    }
    if (!finalPosition) {
      setNotice({ type: "error", message: "Posisi yang dilamar wajib diisi." });
      return;
    }

    try {
      setSubmitting(true);

      // 🔌 TODO: ganti ke API backend kamu (Railway/FastAPI/Express)
      // Contoh payload:
      // const payload = {
      //   to: finalWhatsApp,
      //   name: picked?.name ?? null,
      //   position: finalPosition,
      //   channel, format, language, duration, template,
      //   message: messagePreview,
      //   autoSave,
      //   sourceId: picked?.id ?? null,
      // };
      // await fetch("/api/interview/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // Dummy delay
      await new Promise((r) => setTimeout(r, 1000));

      setNotice({
        type: "success",
        message: "Undangan interview WhatsApp terkirim ✅ Menunggu respons & skor dari AI interviewer.",
      });
    } catch (e) {
      setNotice({ type: "error", message: "Gagal mengirim undangan interview. Coba lagi sebentar." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Interview Orchestrator</h1>

      {/* Notice */}
      {notice && (
        <div
          className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-green-300 bg-green-50 text-green-800"
              : notice.type === "error"
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-blue-300 bg-blue-50 text-blue-800"
          }`}
        >
          <Info className="mt-0.5" size={16} />
          <span>{notice.message}</span>
        </div>
      )}

      {/* 1) Sumber Kandidat */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Sumber Kandidat</h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePickFromDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0097b2] text-white hover:bg-[#007b8a] transition"
          >
            <Database size={18} /> Ambil dari Dashboard (Pending)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition">
            <Upload size={18} /> Upload CSV/Excel
            <input type="file" accept=".csv,.xlsx" hidden />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {/* Dropdown kandidat pending */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih kandidat pending</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value="">— Tidak memilih —</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} • {c.position} • {c.whatsapp}
                </option>
              ))}
            </select>
          </div>

          {/* Input manual nomor WA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (manual)</label>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <input
                type="tel"
                placeholder="Contoh: +62812xxxx / 08xxxx"
                value={manualWhatsApp}
                onChange={(e) => setManualWhatsApp(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Jika memilih kandidat dari dashboard, field ini diabaikan.
            </p>
          </div>
        </div>
      </section>

      {/* 2) Strategi Interview */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Strategi Interview</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi yang dilamar</label>
            <input
              type="text"
              placeholder="Contoh: Data Scientist"
              value={finalPosition}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kanal</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value="Async Q&A">Async Q&amp;A (text)</option>
              <option value="Live Chat">Live Chat</option>
              <option value="Voice Call">Voice Call</option>
              <option value="Video Call">Video Call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value="ID">Bahasa Indonesia</option>
              <option value="EN">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value={15}>15 menit</option>
              <option value={30}>30 menit</option>
              <option value={45}>45 menit</option>
              <option value={60}>60 menit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2] outline-none"
            >
              <option value="Default">Default</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        {/* Preview pesan */}
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview Pesan</label>
          <textarea
            readOnly
            value={messagePreview}
            className="w-full min-h-[140px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <div className="mt-3 flex items-center gap-2">
            <input id="autosave" type="checkbox" checked={autoSave} onChange={() => setAutoSave((s) => !s)} />
            <label htmlFor="autosave" className="text-sm text-gray-700">
              Simpan status ke Dashboard (Interview Sent)
            </label>
          </div>
        </div>
      </section>

      {/* 3) Submit */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0097b2] text-white hover:bg-[#007b8a] transition disabled:opacity-60"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? "Mengirim…" : "Kirim Undangan Interview"}
          </button>

          {notice?.type === "success" && (
            <span className="inline-flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 size={18} /> Menunggu hasil skor dari AI interviewer…
            </span>
          )}
        </div>

        {/* Ringkasan tujuan pengiriman */}
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <div><span className="font-medium">Kirim ke:</span> {finalWhatsApp || "—"}</div>
          <div><span className="font-medium">Nama:</span> {picked?.name ?? "—"}</div>
          <div><span className="font-medium">Posisi:</span> {finalPosition || "—"}</div>
          <div><span className="font-medium">Kanal:</span> {channel} • <span className="font-medium">Format:</span> {format}</div>
        </div>
      </section>
    </div>
  );
}
