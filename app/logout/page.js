export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LogoutPage() {
  const c = cookies();

  // Esborrem possibles noms de cookie (segur i no fa mal)
  c.delete("session");
  c.delete("auth");
  c.delete("token");
  c.delete("padel_session");
  c.delete("padel-auth");
  c.delete("pl_session");
  c.delete("pl_auth");

  redirect("/login");
}
