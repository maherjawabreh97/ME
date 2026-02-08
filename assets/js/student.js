import { supabase } from "./supabaseClient.js";


// --- Site root helper (works even if the site is hosted in a subfolder) ---
const SITE_ROOT = new URL("../../..", import.meta.url);
const toUrl = (p) => new URL(String(p).replace(/^\//, ""), SITE_ROOT).toString();

window.addEventListener("DOMContentLoaded", async () => {
  // =========================
  // 1) Protect page (Require Auth)
  // =========================
  async function requireAuth() {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      window.location.replace(new URL("../auth/index.html", window.location.href).toString());
      return null;
    }
    return user;
  }

  const user = await requireAuth();
  if (!user) return;

  // =========================
  // 2) Elements
  // =========================
  const btn = document.getElementById("saveStudent");
  const msg = document.getElementById("msg");

  // Drawer Navbar elements (as in dashboard navbar)
  const hamburger = document.getElementById("hamburger");
  const backdrop = document.getElementById("drawerBackdrop");
  const closeBtn = document.getElementById("drawerClose");

  // Logout button (optional if exists)
  const logoutBtn = document.getElementById("logoutBtn");

  // =========================
  // 3) Message helper
  // =========================
  function showMsg(text, type = "info") {
    if (!msg) return;

    msg.textContent = text;
    msg.classList.remove("ok", "err", "show");
    msg.classList.add("show");

    if (type === "ok") msg.classList.add("ok");
    if (type === "err") msg.classList.add("err");
  }

  // =========================
  // 4) Drawer open/close
  // =========================
  function openDrawer() {
    document.body.classList.add("drawer-open");
  }

  function closeDrawer() {
    document.body.classList.remove("drawer-open");
  }

  hamburger?.addEventListener("click", openDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  closeBtn?.addEventListener("click", closeDrawer);

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // close drawer when clicking a link inside it
  document.querySelectorAll("#drawer a").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });

  // =========================
  // 5) Logout
  // =========================
  logoutBtn?.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showMsg("Logout failed: " + error.message, "err");
        return;
      }
      window.location.href = "../index.html";
    } catch (e) {
      console.log(e);
      showMsg("Logout error", "err");
    }
  });

  // =========================
  // 6) Save Student
  // =========================
  if (!btn) {
    console.error("saveStudent button not found!");
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      showMsg("Saving...", "info");

      // form values
      const full_name = document.getElementById("full_name")?.value.trim() || "";
      const school_name = document.getElementById("school_name")?.value.trim() || "";
      const edu_level = document.getElementById("edu_level")?.value || "";
      const grade_year = document.getElementById("grade_year")?.value.trim() || "";
      const study_field = document.getElementById("study_field")?.value.trim() || "";
      const edu_status = document.getElementById("edu_status")?.value || "";

      // required fields
      if (!full_name || !school_name || !study_field) {
        showMsg("Please fill: full name, school/university, and major.", "err");
        return;
      }

      // cache locally
      const student_profile = {
        id: user.id,
        full_name,
        school_name,
        edu_level,
        grade_year,
        study_field,
        edu_status,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("student_profile", JSON.stringify(student_profile));

      // save to DB
      const { data, error } = await supabase
        .from("students")
        .upsert(
          {
            id: user.id,
            full_name,
            school_name,
            edu_level,
            grade_year,
            study_field,
            edu_status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select();

      if (error) {
        showMsg("Save failed: " + error.message, "err");
        return;
      }

      console.log("Saved:", data);
      showMsg("Saved successfully ✅", "ok");

      // redirect
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 700);
    } catch (err) {
      console.log(err);
      showMsg("Unexpected error occurred.", "err");
    }
  });
});
