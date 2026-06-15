"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, LogOut } from "lucide-react";

type Entry = {
  id: string;
  name: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Filter = "all" | "pending" | "approved" | "rejected";

const ITEMS_PER_PAGE = 8;

const STATUS_LABEL: Record<string, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "거부",
};

const STATUS_BADGE: Record<string, string> = {
  pending:  "bg-amber-50  text-amber-600  ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  rejected: "bg-rose-50   text-rose-500   ring-1 ring-rose-200",
};

const TABS: { key: Filter; label: string; color: string }[] = [
  { key: "pending",  label: "대기",  color: "text-amber-600" },
  { key: "approved", label: "승인",  color: "text-emerald-600" },
  { key: "rejected", label: "거부",  color: "text-rose-500" },
  { key: "all",      label: "전체",  color: "text-gray-500" },
];

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function AdminPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchEntries = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    const res = await fetch("/api/admin/guestbook");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchEntries(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeFilter = (f: Filter) => { setFilter(f); setPage(1); setExpanded(new Set()); };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: status as Entry["status"] } : e));
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/guestbook/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const counts = {
    all:      entries.length,
    pending:  entries.filter((e) => e.status === "pending").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-script text-gold text-2xl leading-none">H&amp;J</span>
            <span className="h-4 w-px bg-slate-200" />
            <span className="text-sm font-medium text-slate-600 tracking-wide">방명록 관리</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchEntries(true)}
              disabled={refreshing}
              title="새로고침"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* ── 메인 카드 ── */}
      <main className="max-w-5xl mx-auto px-8 py-6">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          {/* 탭 */}
          <div className="flex items-center px-6 border-b border-slate-100 flex-shrink-0">
            {TABS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => changeFilter(key)}
                className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors ${
                  filter === key ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {filter === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-t" />
                )}
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  filter === key
                    ? `${color} bg-current/10`
                    : "text-slate-300 bg-slate-50"
                }`}
                  style={filter === key ? { backgroundColor: "transparent" } : {}}
                >
                  <span className={filter === key ? color : "text-slate-400"}>
                    {counts[key]}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* 컬럼 헤더 */}
          <div className="flex items-center gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex-shrink-0">
            <span className="w-24 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">작성자</span>
            <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">상태</span>
            <span className="flex-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">메시지</span>
            <span className="w-28 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">일시</span>
            <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">관리</span>
          </div>

          {/* 목록 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-400">불러오는 중...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium text-slate-400">항목이 없습니다</p>
                <p className="text-xs text-slate-300">새로운 방명록이 들어오면 여기 표시됩니다</p>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-slate-100">
                {paginated.map((entry) => {
                  const isExp = expanded.has(entry.id);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 px-6 py-0 hover:bg-slate-50/80 transition-colors"
                      style={{ minHeight: "56px" }}
                    >
                      {/* 작성자 */}
                      <div className="w-24 flex-shrink-0 flex justify-center">
                        <p className="text-sm font-semibold text-slate-700 truncate">{entry.name}</p>
                      </div>

                      {/* 상태 */}
                      <div className="w-16 flex-shrink-0 flex justify-center">
                        <span className={`inline-flex items-center text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide ${STATUS_BADGE[entry.status]}`}>
                          {STATUS_LABEL[entry.status]}
                        </span>
                      </div>

                      {/* 메시지 */}
                      <div className="flex-1 min-w-0 py-3.5">
                        <p className={`text-sm text-slate-600 leading-relaxed break-words ${!isExp ? "line-clamp-2" : "whitespace-pre-wrap"}`}>
                          {entry.message}
                        </p>
                        {entry.message.length > 80 && (
                          <button
                            onClick={() => toggleExpand(entry.id)}
                            className="mt-0.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {isExp ? "접기 ↑" : "펼치기 ↓"}
                          </button>
                        )}
                      </div>

                      {/* 일시 */}
                      <div className="w-28 flex-shrink-0 text-center">
                        <p className="text-xs text-slate-500">
                          {new Date(entry.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(entry.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {/* 액션 — 항상 가로 */}
                      <div className="w-44 flex-shrink-0 flex items-center justify-center gap-1">
                        {entry.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(entry.id, "approved")}
                            className="whitespace-nowrap text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors"
                          >
                            승인
                          </button>
                        )}
                        {entry.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(entry.id, "rejected")}
                            className="whitespace-nowrap text-xs font-medium text-rose-500 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md transition-colors"
                          >
                            거부
                          </button>
                        )}
                        {entry.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(entry.id, "pending")}
                            className="whitespace-nowrap text-xs font-medium text-amber-600 hover:bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md transition-colors"
                          >
                            대기
                          </button>
                        )}
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="whitespace-nowrap text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="flex-shrink-0 flex items-center justify-center px-6 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="w-8 text-center text-xs text-slate-400 select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${
                      page === p
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
