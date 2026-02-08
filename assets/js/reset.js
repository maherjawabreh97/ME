import { supabase } from "./supabaseClient.js";

window.addEventListener("DOMContentLoaded", async () => {
  const newPass = document.getElementById("newPassword");
  const confirmPass = document.getElementById("confirmPassword");
  const saveBtn = document.getElementById("saveBtn");
  const backBtn = document.getElementById("backBtn");
  const msgEl = document.getElementById("msg");
  const hintEl = document.getElementById("hint");

  const setMsg = (t, ok=false) => {
    msgEl.textContent = t || "";
    msgEl.style.color = ok ? "#0f766e" : "#b91c1c";
  };

  // 1) دعم روابط Supabase الجديدة (لو اجا code بالـ URL)
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  } catch (e) {
    console.log("exchangeCodeForSession skip:", e);
  }

  // 2) تحقق من وجود Session (لازم يكون موجود بعد الضغط على رابط الإيميل)
  const { data: sessData } = await supabase.auth.getSession();
  if (!sessData?.session) {
    if (hintEl) hintEl.textContent = "الرابط غير صالح أو انتهت صلاحيته. ارجع واطلب رابط جديد.";
    setMsg("لا توجد جلسة استرجاع. اطلب Reset مرة ثانية من صفحة تسجيل الدخول.");
  }

  backBtn?.addEventListener("click", () => {
    // يرجع لنفس فولدر reset -> /auth/
    window.location.href = new URL("./", window.location.href).href;
  });

  saveBtn?.addEventListener("click", async () => {
    setMsg("");

    const p1 = (newPass.value || "");
    const p2 = (confirmPass.value || "");

    if (p1.length < 8) return setMsg("كلمة المرور لازم تكون 8 أحرف أو أكثر.");
    if (p1 !== p2) return setMsg("كلمتا المرور غير متطابقتين.");

    const { data: s2 } = await supabase.auth.getSession();
    if (!s2?.session) return setMsg("الرابط غير صالح أو انتهت صلاحيته. اطلب رابط جديد.");

    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) return setMsg("فشل تغيير كلمة المرور: " + error.message);

    setMsg("✅ تم تغيير كلمة المرور بنجاح.", true);

    // اختياري: sign out ثم رجوع للوجين
    await supabase.auth.signOut();
    setTimeout(() => {
      window.location.href = new URL("./", window.location.href).href;
    }, 900);
  });
});
