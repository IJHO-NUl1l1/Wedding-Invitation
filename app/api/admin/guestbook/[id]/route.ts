import { verifySession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/guestbook/[id]">
) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { status } = await request.json();

  if (!["approved", "rejected", "pending"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("guestbook")
    .update({ status })
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/guestbook/[id]">
) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const { error } = await supabase.from("guestbook").delete().eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
