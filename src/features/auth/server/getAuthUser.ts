import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// Point d'entrée unique de l'autorisation applicative (cf. CLAUDE.md TIER 1).
// Toute fonction d'accès données récupère l'utilisateur via getAuthUser() et
// scope la requête par `user.id` — jamais d'id venant du client.
export async function getAuthUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
