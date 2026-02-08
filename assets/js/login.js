import { supabase } from "./supabaseClient.js";

window.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");
  const msg     = document.getElementById("msg");

  const loginBtn  = document.getElementById("loginBtn")  || document.getElementById("login");
  const signupBtn = document.getElementById("signupBtn") || document.getElementById("signup");
  const homeBtn   = document.getElementById("homeBtn");

  // Forgot password elements
  const forgotLink   = document.getElementById("forgotLink");
  const resetModal   = document.getElementById("resetModal");
  const resetEmailEl = document.getElementById("resetEmail");
  const sendResetBtn = document.getElementById("sendResetBtn");
  const closeResetBtn= document.getElementById("closeResetBtn");
  const resetMsg     = document.getElementById("resetMsg");

  function setMsg(t){ if (msg) msg.textContent = t || ""; }
  function setResetMsg(t){ if (resetMsg) resetMsg.textContent = t || ""; }

  function openResetModal() {
    if (!resetModal) return;
    resetModal.classList.add("active");
    resetModal.setAttribute("aria-hidden", "false");
    setResetMsg("");
    // Prefill from email box
    resetEmailEl.value = (emailEl?.value || "").trim();
    resetEmailEl.focus();
  }

  function closeResetModal() {
    if (!resetModal) return;
    resetModal.classList.remove("active");
    resetModal.setAttribute("aria-hidden", "true");
    setResetMsg("");
  }

  async function goAfterLogin(userId){
    const { data: isAdmin, error } = await supabase
      .from("admins")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.log("Admin check error:", error);
      location.href = "../index.html";
      return;
    }

    // عندك الاثنين نفس التحويل
    if (isAdmin) location.href = "../index.html";
    else location.href = "../index.html";
  }

  // Home
  homeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "../index.html";
  });

  // Login
  loginBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    setMsg("جاري تسجيل الدخول...");

    const email = emailEl?.value.trim();
    const password = passEl?.value;

    if (!email || !password) return setMsg("اكتب الإيميل وكلمة المرور.");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg("فشل تسجيل الدخول: " + error.message);

    await goAfterLogin(data.user.id);
  });

  // Signup
  signupBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    setMsg("جاري إنشاء الحساب...");

    const email = emailEl?.value.trim();
    const password = passEl?.value;

    if (!email || !password) return setMsg("اكتب الإيميل وكلمة المرور.");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg("فشل التسجيل: " + error.message);

    setMsg("تم إنشاء الحساب ✅ إذا التفعيل شغال افحص الإيميل ثم سجل دخول.");
  });

  // Forgot password open
  forgotLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openResetModal();
  });

  // Close modal
  closeResetBtn?.addEventListener("click", closeResetModal);
  resetModal?.addEventListener("click", (e) => {
    if (e.target === resetModal) closeResetModal();
  });

  // Send reset email
  sendResetBtn?.addEventListener("click", async () => {
    setResetMsg("جاري الإرسال...");

    const email = (resetEmailEl?.value || "").trim();
    if (!email) return setResetMsg("اكتب الإيميل أولاً.");

    // يخليها تفتح /auth/reset.html بنفس فولدر صفحة اللوجين
    const redirectTo = new URL("./reset.html", window.location.href).href;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // ملاحظة: Supabase غالباً يرجع نجاح حتى لو الإيميل غير مسجل (حماية)
    if (error) return setResetMsg("فشل الإرسال: " + error.message);

    setResetMsg("✅ تم إرسال رابط تغيير كلمة السر. افحص الإيميل (و Spam).");
  });

  if (!loginBtn) console.log("❌ login button not found (id=loginBtn or login)");
  if (!signupBtn) console.log("❌ signup button not found (id=signupBtn or signup)");
});
