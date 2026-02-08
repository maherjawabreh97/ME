import { supabase } from "./supabaseClient.js";

export async function doLogout() {
  await supabase.auth.signOut();
  location.href = "index.html";
}
