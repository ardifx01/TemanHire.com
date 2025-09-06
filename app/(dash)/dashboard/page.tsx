"use client";

import React from "react";
import { Users, Briefcase, UserCheck } from "lucide-react"; // ikon biar lebih menarik

const stats = [
  {
    title: "Total Candidates",
    value: 150,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Jobs",
    value: 12,
    icon: Briefcase,
    color: "text-green-600",
  },
  {
    title: "Vacant Positions",
    value: 24,
    icon: UserCheck,
    color: "text-purple-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition"
          >
            <div
              className={`p-3 rounded-full bg-gray-100 ${item.color}`}
            >
              <item.icon size={28} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">{item.title}</h2>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
