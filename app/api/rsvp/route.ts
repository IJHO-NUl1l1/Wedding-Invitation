import { supabase } from "@/lib/supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const body = await request.json();
  const attending = body?.attending;
  const name = body?.name?.trim() ?? "";
  const side = body?.side;
  const headcount = Number(body?.headcount ?? 0);
  // 이전 응답 교체용 (본인 응답의 uuid를 알고 있어야 하므로 소유 증명이 된다)
  const replaceId =
    typeof body?.replaceId === "string" && UUID_RE.test(body.replaceId)
      ? body.replaceId
      : null;

  if (typeof attending !== "boolean") {
    return Response.json({ error: "참석 여부를 선택해주세요" }, { status: 400 });
  }

  // 참석은 이름·측·인원 필수, 불참은 익명 허용
  if (attending) {
    if (!name) {
      return Response.json({ error: "이름을 입력해주세요" }, { status: 400 });
    }
    if (name.length > 20) {
      return Response.json({ error: "이름은 20자 이내로 입력해주세요" }, { status: 400 });
    }
    if (side !== "groom" && side !== "bride") {
      return Response.json({ error: "신랑측/신부측을 선택해주세요" }, { status: 400 });
    }
    if (headcount < 1 || headcount > 10) {
      return Response.json({ error: "인원은 1~10명까지 가능합니다" }, { status: 400 });
    }
  }

  if (replaceId) {
    await supabase.from("rsvp").delete().eq("id", replaceId);
  }

  const { data, error } = await supabase
    .from("rsvp")
    .insert({
      name: attending ? name : name || null,
      side: attending ? side : side === "groom" || side === "bride" ? side : null,
      attending,
      headcount: attending ? headcount : 1,
    })
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, id: data.id }, { status: 201 });
}
