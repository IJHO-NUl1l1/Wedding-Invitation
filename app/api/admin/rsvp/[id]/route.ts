import { verifySession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/rsvp/[id]">
) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const { error } = await supabase.from("rsvp").delete().eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
