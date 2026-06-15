import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, name, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = body?.name?.trim() ?? "";
  const message = body?.message?.trim() ?? "";

  if (!name || !message) {
    return Response.json({ error: "이름과 메시지를 입력해주세요" }, { status: 400 });
  }
  if (name.length > 20) {
    return Response.json({ error: "이름은 20자 이내로 입력해주세요" }, { status: 400 });
  }
  if (message.length > 300) {
    return Response.json({ error: "메시지는 300자 이내로 입력해주세요" }, { status: 400 });
  }

  const { error } = await supabase
    .from("guestbook")
    .insert({ name, message, status: "pending" });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}
