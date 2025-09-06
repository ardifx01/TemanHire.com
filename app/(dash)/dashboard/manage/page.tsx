"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Candidate = {
  id: number;
  name: string;
  position: string;
  interviewScore?: number;
  personalityScore?: number;
  skillScore?: number;
  educationLevel?: string;
  recruitmentStrategy: string;
  status: "Complete" | "Withdrawn" | "Pending" | "Missing Score" | "Missing Document";
};

export default function ManageCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Budi Doremi",
      position: "Sosial Media Specialist",
      interviewScore: 85,
      personalityScore: 78,
      skillScore: 92,
      educationLevel: "Bachelor",
      recruitmentStrategy: "Online Test",
      status: "Complete",
    },
    {
      id: 2,
      name: "Ipin Sugiarto",
      position: "Senior Social Media Specialist",
      interviewScore: 75,
      personalityScore: 88,
      educationLevel: "Master",
      recruitmentStrategy: "Referral",
      status: "Missing Score",
    },
    {
      id: 3,
      name: "Ahmad Sahroni",
      position: "Junior Developer",
      interviewScore: 60,
      personalityScore: 65,
      skillScore: 70,
      educationLevel: "Bachelor",
      recruitmentStrategy: "Job Fair",
      status: "Pending",
    },
  ]);

  // Delete kandidat
  const handleDelete = (id: number) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  // Update kandidat (dummy → nanti bisa buka modal form)
  const handleUpdate = (id: number) => {
    alert(`Update kandidat dengan ID: ${id} (belum ada form 😅)`);
  };

  // Add kandidat (dummy → nanti bisa buka modal form)
  const handleAdd = () => {
    const newCandidate: Candidate = {
      id: candidates.length + 1,
      name: "Kandidat Baru",
      position: "Fullstack Developer",
      interviewScore: 70,
      personalityScore: 75,
      skillScore: 80,
      educationLevel: "Bachelor",
      recruitmentStrategy: "Walk-in",
      status: "Pending",
    };
    setCandidates((prev) => [...prev, newCandidate]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Candidates</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#0097b2] text-white px-4 py-2 rounded-lg shadow hover:bg-[#007b8a] transition"
        >
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-[#0097b2]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-white">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Position</th>
              <th className="px-4 py-3 text-center font-semibold text-white">Interview</th>
              <th className="px-4 py-3 text-center font-semibold text-white">Personality</th>
              <th className="px-4 py-3 text-center font-semibold text-white">Skills</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Education</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Recruitment Strategy</th>
              <th className="px-4 py-3 text-center font-semibold text-white">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {candidates.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 whitespace-nowrap">{c.name}</td>
                <td className="px-4 py-3">{c.position}</td>
                <td className="px-4 py-3 text-center">{c.interviewScore}</td>
                <td className="px-4 py-3 text-center">{c.personalityScore}</td>
                <td className="px-4 py-3 text-center">{c.skillScore}</td>
                <td className="px-4 py-3">{c.educationLevel}</td>
                <td className="px-4 py-3">{c.recruitmentStrategy}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "Complete"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleUpdate(c.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
