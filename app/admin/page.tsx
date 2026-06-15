"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = {
  id: string;
  name: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Filter = "all" | "pending" | "approved" | "rejected";

const STATUS_LABEL: Record<string, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "거부",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/guestbook");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: status as Entry["status"] } : e))
    );
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/guestbook/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.status === filter);
  const counts = {
    all: entries.length,
    pending: entries.filter((e) => e.status === "pending").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-blush/20 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-script text-gold text-xl leading-none">Admin</p>
          <p className="font-serif text-xs text-charcoal-light tracking-wider">방명록 관리</p>
        </div>
        <button
          onClick={logout}
          className="text-xs font-serif text-charcoal-light border border-blush/30 px-3 py-1.5 rounded-full active:bg-blush/10"
        >
          로그아웃
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-serif transition-colors ${
              filter === f
                ? "bg-blush text-white"
                : "bg-white text-charcoal-light border border-blush/20"
            }`}
          >
            {f === "all" ? "전체" : STATUS_LABEL[f]}
            <span className="ml-1 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="px-4 pb-8 space-y-3">
        {loading ? (
          <p className="text-center text-sm font-serif text-charcoal-light py-12">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm font-serif text-charcoal-light py-12">항목이 없습니다</p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10"
            >
              {/* 이름 + 상태 + 날짜 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm text-charcoal">{entry.name}</span>
                  <span
                    className={`text-[10px] font-serif px-2 py-0.5 rounded-full ${STATUS_COLOR[entry.status]}`}
                  >
                    {STATUS_LABEL[entry.status]}
                  </span>
                </div>
                <span className="text-[10px] text-charcoal-light flex-shrink-0">
                  {new Date(entry.created_at).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* 메시지 */}
              <p className="text-xs text-charcoal leading-5 font-serif mb-3 whitespace-pre-wrap">
                {entry.message}
              </p>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                {entry.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(entry.id, "approved")}
                    className="flex-1 py-2 text-xs font-serif text-green-700 bg-green-50 border border-green-200 rounded-xl active:bg-green-100"
                  >
                    승인
                  </button>
                )}
                {entry.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(entry.id, "rejected")}
                    className="flex-1 py-2 text-xs font-serif text-red-600 bg-red-50 border border-red-200 rounded-xl active:bg-red-100"
                  >
                    거부
                  </button>
                )}
                {entry.status !== "pending" && (
                  <button
                    onClick={() => updateStatus(entry.id, "pending")}
                    className="flex-1 py-2 text-xs font-serif text-amber-700 bg-amber-50 border border-amber-200 rounded-xl active:bg-amber-100"
                  >
                    대기로
                  </button>
                )}
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="px-3 py-2 text-xs font-serif text-charcoal-light bg-gray-50 border border-gray-200 rounded-xl active:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
