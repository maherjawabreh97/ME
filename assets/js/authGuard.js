import { supabase } from "./supabaseClient.js";

export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    location.href = "../auth/index.html";
    return null;
  }
  return user;
}

export async function requireAdmin(userId) {
  const { data: isAdmin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!isAdmin) {
    location.href = "student/index.html";
    return false;
  }
  return true;
}
