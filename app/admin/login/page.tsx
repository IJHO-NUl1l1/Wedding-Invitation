"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-script text-pink text-5xl mb-2">Admin</p>
          <p className="font-sans text-white text-sm tracking-widest">방명록 관리</p>
          <div className="w-10 h-px bg-pink-soft mx-auto mt-3" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="w-full px-4 py-3 border border-white/20/40 rounded-xl text-sm font-sans text-white bg-white/5 focus:outline-none focus:border-white/20-dark placeholder:text-white/60/40"
          />
          {error && (
            <p className="text-red-400 text-xs text-center font-sans">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-pink-soft text-white font-sans text-sm rounded-xl tracking-widest disabled:opacity-40 active:bg-pink transition-colors"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
