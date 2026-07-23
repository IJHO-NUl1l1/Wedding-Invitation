import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type RsvpEntry = {
  id: string;
  name: string | null;
  side: "groom" | "bride" | null;
  attending: boolean;
  headcount: number;
  created_at: string;
};
