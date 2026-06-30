import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ConfirmParams = {
  tokenHash: string;
  type: EmailOtpType;
  next: string;
};

function parseConfirmParams(request: NextRequest): ConfirmParams | null {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  if (!tokenHash || !type) return null;
  return { tokenHash, type, next: searchParams.get("next") ?? "/" };
}

// Callback de confirmation d'email et de récupération de mot de passe.
// Supabase redirige ici avec `token_hash` + `type` ; on échange contre une session.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = parseConfirmParams(request);
  if (!params) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: params.type,
    token_hash: params.tokenHash,
  });
  if (error) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  return NextResponse.redirect(new URL(params.next, request.url));
}
