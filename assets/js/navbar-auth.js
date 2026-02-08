import { supabase } from "./supabaseClient.js";


// --- Site root helper (works even if the site is hosted in a subfolder) ---
const SITE_ROOT = new URL("../../..", import.meta.url);
const toUrl = (p) => new URL(String(p).replace(/^\//, ""), SITE_ROOT).toString();

const authBtn = document.getElementById("authBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const welcomeUser = document.getElementById("welcomeUser");

function show(el, on = true) {
  if (!el) return;
  el.style.display = on ? "" : "none";
}

  function setAuthToLogin() {
    if (!authBtn) return;
    authBtn.href = toUrl("auth/index.html");
    authBtn.dataset.mode = "login";
    authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
  }

function setAuthToLogout() {
  if (!authBtn) return;
  authBtn.href = "#";
  authBtn.dataset.mode = "logout";
  authBtn.innerHTML = '<i class="fas fa-right-from-bracket"></i> تسجيل الخروج';
}

async function getStudentName(userId) {
  // نفس جدول صفحة الطالب
  const { data, error } = await supabase
    .from("students")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) return null;
  return data?.full_name ?? null;
}

async function renderNavbar() {
  if (!authBtn && !dashboardBtn && !welcomeUser) return;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    show(welcomeUser, false);
    show(dashboardBtn, false);
    setAuthToLogin();
    return;
  }

  const fullName = await getStudentName(user.id);

  const displayName = fullName || user.email || "مستخدم";

  if (welcomeUser) {
    welcomeUser.textContent = `أهلاً، ${displayName}`;
    show(welcomeUser, true);
  }

  if (dashboardBtn) {
    dashboardBtn.href = toUrl("reg-student/index.html");
    dashboardBtn.innerHTML = '<i class="fas fa-gauge"></i> لوحة التحكم';
    show(dashboardBtn, true);
  }

  setAuthToLogout();
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderNavbar();

  if (authBtn) {
    authBtn.addEventListener("click", async (e) => {
      if (authBtn.dataset.mode !== "logout") return;
      e.preventDefault();

      authBtn.style.pointerEvents = "none";
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        window.location.href = toUrl("index.html");
      }
    });
  }

  supabase.auth.onAuthStateChange(() => {
    renderNavbar();
  });
});
