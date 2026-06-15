import { verifySession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
