"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Simulasi data user login
  const user = {
    name: "Agung",
    avatar: "/user-avatar.svg", // siapkan gambar avatar default di public/
  };

  // Tutup menu saat klik di luar atau tekan Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-4 border-b border-gray-200 bg-white">
      {/* Logo dashboard */}
      <Link href="/dashboard">
        <Image src="/TemanHire.svg" alt="logo" width={140} height={46} />
      </Link>

      {/* Desktop nav (khusus dashboard) */}
      <ul className="hidden h-full gap-10 lg:flex">
        <li>
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/manage" className="nav-link">
            Manage
          </Link>
        </li>
        <li>
          <Link href="/dashboard/hiring" className="nav-link">
            Hiring
          </Link>
        </li>
        <li>
          <Link href="/dashboard/consult" className="nav-link">
            Consult
          </Link>
        </li>
        <li>
          <Link href="/dashboard/interview" className="nav-link">
            Interview
          </Link>
        </li>
        <li>
          <Link href="/dashboard/scan" className="nav-link">
            Scan
          </Link>
        </li>
      </ul>

      {/* User info */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {user.name}</span>
        <Image
          src={user.avatar}
          alt="user avatar"
          width={36}
          height={36}
          className="rounded-full border"
        />
        <Button
          type="button"
          title="Logout"
          variant="btn_dark_green"
          href="/logout"
        />
      </div>

      {/* Mobile menu trigger */}
      <button
        className="inline-block lg:hidden cursor-pointer"
        aria-label="Buka menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((s) => !s)}
      >
        <Image src="/menu.svg" alt="menu" width={28} height={28} />
      </button>

      {/* Mobile dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`absolute right-5 top-16 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 lg:hidden
                    transition-[opacity,transform] duration-200 origin-top-right
                    ${isOpen ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col p-2">
          <Link
            href="/dashboard"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <Link
            href="/dashboard/reports"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Reports
          </Link>
          <div className="mt-3 border-t border-gray-100 pt-3">
            <Button
              type="button"
              title="Logout"
              variant="btn_dark_green"
              href="/logout"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
