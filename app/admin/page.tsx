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

type Rsvp = {
  id: string;
  name: string | null;
  side: "groom" | "bride" | null;
  attending: boolean;
  headcount: number;
  created_at: string;
};

const SIDE_BADGE: Record<string, { label: string; cls: string }> = {
  groom: { label: "신랑측", cls: "bg-sky-50 text-sky-600 ring-1 ring-sky-200" },
  bride: { label: "신부측", cls: "bg-pink-50 text-pink-500 ring-1 ring-pink-200" },
  none:  { label: "-",     cls: "bg-slate-50 text-slate-400 ring-1 ring-slate-200" },
};

type Filter = "all" | "pending" | "approved" | "rejected";
type View = "guestbook" | "rsvp";

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
  const [view, setView] = useState<View>("guestbook");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [page, setPage] = useState(1);
  const [rsvpPage, setRsvpPage] = useState(1);
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

  const fetchRsvps = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    const res = await fetch("/api/admin/rsvp");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setRsvps(Array.isArray(data) ? data : []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchEntries(); fetchRsvps(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = (silent = false) =>
    view === "guestbook" ? fetchEntries(silent) : fetchRsvps(silent);

  const deleteRsvp = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/rsvp/${id}`, { method: "DELETE" });
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

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

  // ── RSVP 집계 ──
  const attendRsvps = rsvps.filter((r) => r.attending);
  const totalGuests = attendRsvps.reduce((s, r) => s + r.headcount, 0);
  const groomGuests = attendRsvps.filter((r) => r.side === "groom").reduce((s, r) => s + r.headcount, 0);
  const brideGuests = attendRsvps.filter((r) => r.side === "bride").reduce((s, r) => s + r.headcount, 0);
  const rsvpTotalPages = Math.max(1, Math.ceil(rsvps.length / ITEMS_PER_PAGE));
  const rsvpPaginated = rsvps.slice((rsvpPage - 1) * ITEMS_PER_PAGE, rsvpPage * ITEMS_PER_PAGE);

  const ActionButtons = ({ entry }: { entry: Entry }) => (
    <>
      {entry.status !== "approved" && (
        <button onClick={() => updateStatus(entry.id, "approved")}
          className="whitespace-nowrap text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors">
          승인
        </button>
      )}
      {entry.status !== "rejected" && (
        <button onClick={() => updateStatus(entry.id, "rejected")}
          className="whitespace-nowrap text-xs font-medium text-rose-500 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md transition-colors">
          거부
        </button>
      )}
      {entry.status !== "pending" && (
        <button onClick={() => updateStatus(entry.id, "pending")}
          className="whitespace-nowrap text-xs font-medium text-amber-600 hover:bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md transition-colors">
          대기
        </button>
      )}
      <button onClick={() => deleteEntry(entry.id)}
        className="whitespace-nowrap text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-colors">
        삭제
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-script text-gold text-2xl leading-none">H&amp;J</span>
            <span className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              {([
                { key: "guestbook", label: "방명록" },
                { key: "rsvp", label: "참석 여부" },
              ] as { key: View; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    view === key
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refresh(true)}
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
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 메인 카드 ── */}
      <main className="max-w-5xl mx-auto px-3 md:px-8 py-4 md:py-6">
        {view === "guestbook" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:h-[calc(100vh-8rem)]">

          {/* 탭 */}
          <div className="flex items-center px-3 md:px-6 border-b border-slate-100 flex-shrink-0">
            {TABS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => changeFilter(key)}
                className={`relative flex items-center gap-1.5 px-3 md:px-4 py-3.5 text-sm font-medium transition-colors ${
                  filter === key ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {filter === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-t" />
                )}
                {label}
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={filter === key ? { backgroundColor: "transparent" } : {}}>
                  <span className={filter === key ? color : "text-slate-400"}>
                    {counts[key]}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* 컬럼 헤더 — 데스크탑만 */}
          <div className="hidden md:flex items-center gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex-shrink-0">
            <span className="w-24 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">작성자</span>
            <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">상태</span>
            <span className="flex-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">메시지</span>
            <span className="w-28 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">일시</span>
            <span className="w-44 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">관리</span>
          </div>

          {/* 목록 */}
          <div className="flex-1 flex flex-col md:overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <p className="text-sm text-slate-400">불러오는 중...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
                <p className="text-sm font-medium text-slate-400">항목이 없습니다</p>
                <p className="text-xs text-slate-300">새로운 방명록이 들어오면 여기 표시됩니다</p>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-slate-100">
                {paginated.map((entry) => {
                  const isExp = expanded.has(entry.id);
                  return (
                    <div key={entry.id}>
                      {/* ── 모바일 카드 ── */}
                      <div className="md:hidden px-4 py-3.5 space-y-2 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700 truncate">{entry.name}</span>
                          <span className={`flex-shrink-0 inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide ${STATUS_BADGE[entry.status]}`}>
                            {STATUS_LABEL[entry.status]}
                          </span>
                        </div>
                        <p className={`text-sm text-slate-600 leading-relaxed break-words ${!isExp ? "line-clamp-2" : "whitespace-pre-wrap"}`}>
                          {entry.message}
                        </p>
                        {entry.message.length > 80 && (
                          <button onClick={() => toggleExpand(entry.id)}
                            className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                            {isExp ? "접기 ↑" : "펼치기 ↓"}
                          </button>
                        )}
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[11px] text-slate-400">
                            {new Date(entry.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                            {" "}
                            {new Date(entry.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <div className="flex items-center gap-1">
                            <ActionButtons entry={entry} />
                          </div>
                        </div>
                      </div>

                      {/* ── 데스크탑 테이블 행 ── */}
                      <div
                        className="hidden md:flex items-center gap-4 px-6 py-0 hover:bg-slate-50/80 transition-colors"
                        style={{ minHeight: "56px" }}
                      >
                        <div className="w-24 flex-shrink-0 flex justify-center">
                          <p className="text-sm font-semibold text-slate-700 truncate">{entry.name}</p>
                        </div>
                        <div className="w-16 flex-shrink-0 flex justify-center">
                          <span className={`inline-flex items-center text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide ${STATUS_BADGE[entry.status]}`}>
                            {STATUS_LABEL[entry.status]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-3.5">
                          <p className={`text-sm text-slate-600 leading-relaxed break-words ${!isExp ? "line-clamp-2" : "whitespace-pre-wrap"}`}>
                            {entry.message}
                          </p>
                          {entry.message.length > 80 && (
                            <button onClick={() => toggleExpand(entry.id)}
                              className="mt-0.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                              {isExp ? "접기 ↑" : "펼치기 ↓"}
                            </button>
                          )}
                        </div>
                        <div className="w-28 flex-shrink-0 text-center">
                          <p className="text-xs text-slate-500">
                            {new Date(entry.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(entry.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="w-44 flex-shrink-0 flex items-center justify-center gap-1">
                          <ActionButtons entry={entry} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="flex-shrink-0 flex items-center justify-center px-4 md:px-6 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
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
                      page === p ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
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
        )}

        {view === "rsvp" && (
        <div className="space-y-4">
          {/* ── 집계 대시보드 ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1">총 참석 인원</p>
              <p className="text-2xl font-bold text-slate-800">
                {totalGuests}<span className="text-sm font-medium text-slate-400 ml-1">명</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1">참석 응답</p>
              <p className="text-2xl font-bold text-emerald-600">
                {attendRsvps.length}<span className="text-sm font-medium text-slate-400 ml-1">건</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1">불참 응답</p>
              <p className="text-2xl font-bold text-rose-500">
                {rsvps.length - attendRsvps.length}<span className="text-sm font-medium text-slate-400 ml-1">건</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1">총 응답</p>
              <p className="text-2xl font-bold text-slate-800">
                {rsvps.length}<span className="text-sm font-medium text-slate-400 ml-1">건</span>
              </p>
            </div>
          </div>

          {/* 신랑측 vs 신부측 참석 인원 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">측별 참석 인원</p>
            {([
              { label: "신랑측", value: groomGuests, color: "bg-sky-400" },
              { label: "신부측", value: brideGuests, color: "bg-pink-400" },
            ]).map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-slate-500 flex-shrink-0">{label}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: totalGuests > 0 ? `${(value / totalGuests) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-slate-700 flex-shrink-0">{value}명</span>
              </div>
            ))}
          </div>

          {/* ── 응답 목록 ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="hidden md:flex items-center gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 rounded-t-2xl">
              <span className="w-24 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">이름</span>
              <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">측</span>
              <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">참석</span>
              <span className="flex-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">인원</span>
              <span className="w-28 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">일시</span>
              <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-slate-400 tracking-wider uppercase text-center">관리</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-sm text-slate-400">불러오는 중...</p>
              </div>
            ) : rsvps.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <p className="text-sm font-medium text-slate-400">응답이 없습니다</p>
                <p className="text-xs text-slate-300">참석 여부 응답이 들어오면 여기 표시됩니다</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {rsvpPaginated.map((r) => (
                  <div key={r.id}>
                    {/* 모바일 카드 */}
                    <div className="md:hidden px-4 py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${r.name ? "text-slate-700" : "text-slate-400"}`}>{r.name ?? "익명"}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${SIDE_BADGE[r.side ?? "none"].cls}`}>
                            {SIDE_BADGE[r.side ?? "none"].label}
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            r.attending ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-500 ring-1 ring-rose-200"
                          }`}>
                            {r.attending ? `참석 ${r.headcount}명` : "불참"}
                          </span>
                        </div>
                        <button onClick={() => deleteRsvp(r.id)}
                          className="text-xs font-medium text-slate-400 hover:text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                          삭제
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {new Date(r.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                        {" "}
                        {new Date(r.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {/* 데스크탑 행 */}
                    <div className="hidden md:flex items-center gap-4 px-6 py-3 hover:bg-slate-50/80 transition-colors">
                      <div className="w-24 flex-shrink-0 text-center">
                        <p className={`text-sm font-semibold truncate ${r.name ? "text-slate-700" : "text-slate-400"}`}>{r.name ?? "익명"}</p>
                      </div>
                      <div className="w-16 flex-shrink-0 flex justify-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${SIDE_BADGE[r.side ?? "none"].cls}`}>
                          {SIDE_BADGE[r.side ?? "none"].label}
                        </span>
                      </div>
                      <div className="w-16 flex-shrink-0 flex justify-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          r.attending ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-500 ring-1 ring-rose-200"
                        }`}>
                          {r.attending ? "참석" : "불참"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600">{r.attending ? `${r.headcount}명` : "-"}</p>
                      </div>
                      <div className="w-28 flex-shrink-0 text-center">
                        <p className="text-xs text-slate-500">
                          {new Date(r.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(r.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="w-16 flex-shrink-0 flex justify-center">
                        <button onClick={() => deleteRsvp(r.id)}
                          className="text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-colors">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {rsvps.length > 0 && (
              <div className="flex items-center justify-center px-4 md:px-6 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setRsvpPage((p) => Math.max(1, p - 1))}
                    disabled={rsvpPage === 1}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {getPageNumbers(rsvpPage, rsvpTotalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`e-${i}`} className="w-8 text-center text-xs text-slate-400 select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setRsvpPage(p)}
                        className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${
                          rsvpPage === p ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setRsvpPage((p) => Math.min(rsvpTotalPages, p + 1))}
                    disabled={rsvpPage === rsvpTotalPages}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
