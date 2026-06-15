import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
  }

  await createSession();
  return Response.json({ ok: true });
}
