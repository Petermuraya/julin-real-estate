// domains/lead/lead.repository.ts
import { supabaseServer } from "@/infrastructure/database/supabase.client";

if (!supabaseServer) {
  throw new Error(
    "Supabase service role key not defined. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables."
  );
}

export async function createLead(lead: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  property_id: string;
}) {
  // ✅ Use non-null assertion since we already checked above
  const { data, error } = await supabaseServer!
    .from("leads")
    .insert([lead])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
