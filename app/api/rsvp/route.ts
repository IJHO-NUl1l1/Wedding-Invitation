import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const name = body?.name?.trim() ?? "";
  const side = body?.side;
  const attending = body?.attending;
  const headcount = Number(body?.headcount ?? 0);

  if (!name) {
    return Response.json({ error: "이름을 입력해주세요" }, { status: 400 });
  }
  if (name.length > 20) {
    return Response.json({ error: "이름은 20자 이내로 입력해주세요" }, { status: 400 });
  }
  if (side !== "groom" && side !== "bride") {
    return Response.json({ error: "신랑측/신부측을 선택해주세요" }, { status: 400 });
  }
  if (typeof attending !== "boolean") {
    return Response.json({ error: "참석 여부를 선택해주세요" }, { status: 400 });
  }
  if (attending && (headcount < 1 || headcount > 10)) {
    return Response.json({ error: "인원은 1~10명까지 가능합니다" }, { status: 400 });
  }

  const { error } = await supabase.from("rsvp").insert({
    name,
    side,
    attending,
    headcount: attending ? headcount : 1,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}
