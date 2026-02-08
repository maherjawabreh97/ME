import { supabase } from "./supabaseClient.js";

/**
 * Dashboard (Merged) - FIXED
 * - Auth guard
 * - Profile CRUD (profiles)
 * - Document upload/view (documents + Storage bucket)
 * - Completion % + checklist
 *
 * FIXES:
 * ✅ documents table unique constraint (user_id, type) -> use UPSERT instead of INSERT
 * ✅ stable storage path per type (latest.ext) + storage upsert
 * ✅ guard against double-init if script is included twice
 */

const __FLAG = "__studentDashboardLoaded_v1";
if (typeof window !== "undefined" && window[__FLAG]) {
  console.warn("dashboard.merged.js already initialized; skipping duplicate load.");
} else {
  if (typeof window !== "undefined") window[__FLAG] = true;

  console.log("dashboard.merged.js loaded ✅");

  const BUCKET = "student-files";

  // ========================
  // DOM
  // ========================
  const el = {
    // profile
    full_name: document.getElementById("full_name"),
    mother_name: document.getElementById("mother_name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    desired_university: document.getElementById("desired_university"),
    desired_major: document.getElementById("desired_major"),

    saveProfile: document.getElementById("saveProfile"),
    refresh: document.getElementById("refresh"),
    userBadge: document.getElementById("userBadge"),

    // completion
    checklist: document.getElementById("checklist"),
    completionPct: document.getElementById("completionPct"),
    completionBar: document.getElementById("completionBar"),

    // acceptance
    acceptance: document.getElementById("acceptance"),

    // uploads
    photo_file: document.getElementById("photo_file"),
    passport_file: document.getElementById("passport_file"),
    transcript_file: document.getElementById("transcript_file"),
    secondary_file: document.getElementById("secondary_file"),
    other_file: document.getElementById("other_file"),

    uploadPhoto: document.getElementById("uploadPhoto"),
    uploadPassport: document.getElementById("uploadPassport"),
    uploadTranscript: document.getElementById("uploadTranscript"),
    uploadSecondary: document.getElementById("uploadSecondary"),
    uploadOther: document.getElementById("uploadOther"),

    status_photo: document.getElementById("status_photo"),
    status_passport: document.getElementById("status_passport"),
    status_transcript: document.getElementById("status_transcript"),
    status_secondary: document.getElementById("status_secondary"),
    status_other: document.getElementById("status_other"),

    viewPhoto: document.getElementById("viewPhoto"),
    viewPassport: document.getElementById("viewPassport"),
    viewTranscript: document.getElementById("viewTranscript"),
    viewSecondary: document.getElementById("viewSecondary"),
    viewOther: document.getElementById("viewOther"),

    // avatar preview (optional, exists in your HTML)
    avatarPreviewWrap: document.getElementById("avatarPreviewWrap"),
    avatarPreview: document.getElementById("avatarPreview"),

    // toast
    centerToast: document.getElementById("centerToast"),
  };
  // ========================
  // Prefill from URL (from universities search -> Apply Now)
  // ========================
  try {
    const params = new URLSearchParams(window.location.search);
    const u = params.get("university");
    const p = params.get("program");

    if (el.desired_university && u && !el.desired_university.value) el.desired_university.value = u;
    if (el.desired_major && p && !el.desired_major.value) el.desired_major.value = p;
  } catch (e) {
    // ignore
  }



  // ========================
  // Types
  // ========================
  const DOC_TYPES = {
    personal_photo: {
      label: "الصورة الشخصية",
      input: () => el.photo_file,
      btn: () => el.uploadPhoto,
      status: () => el.status_photo,
      view: () => el.viewPhoto,
      accept: "image/*",
      maxMB: 5,
    },
    passport: {
      label: "جواز السفر",
      input: () => el.passport_file,
      btn: () => el.uploadPassport,
      status: () => el.status_passport,
      view: () => el.viewPassport,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxMB: 12,
    },
    transcript: {
      label: "كشف العلامات",
      input: () => el.transcript_file,
      btn: () => el.uploadTranscript,
      status: () => el.status_transcript,
      view: () => el.viewTranscript,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxMB: 12,
    },
    secondary_certificate: {
      label: "شهادة الثانوية",
      input: () => el.secondary_file,
      btn: () => el.uploadSecondary,
      status: () => el.status_secondary,
      view: () => el.viewSecondary,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxMB: 12,
    },
    other_doc: {
      label: "وثائق أخرى",
      input: () => el.other_file,
      btn: () => el.uploadOther,
      status: () => el.status_other,
      view: () => el.viewOther,
      accept: ".pdf,.jpg,.jpeg,.png",
      maxMB: 12,
    },
  };

  // Optional doc type that you display (admin uploads it later)
  const ACCEPTANCE_TYPE = "acceptance";

  // ========================
  // State
  // ========================
  let user = null;
  let docsLatest = {}; // { type: {path, url} }
  const inFlightUpload = new Set();

  // ========================
  // UI Helpers
  // ========================
  function showCenterToast(msg, type = "ok", ms = 2600) {
    if (!el.centerToast) return alert(msg);

    const t = type === "success" ? "ok" : type;
    el.centerToast.className = `center-toast show ${t}`;
    el.centerToast.textContent = msg;

    clearTimeout(showCenterToast._t);
    showCenterToast._t = setTimeout(() => {
      el.centerToast.classList.remove("show");
    }, ms);
  }

  function setLoading(btn, loading, textWhenLoading = "جاري...") {
    if (!btn) return;
    btn.disabled = loading;

    if (loading) {
      btn.dataset._oldHTML = btn.innerHTML;
      btn.innerHTML = textWhenLoading;
    } else if (btn.dataset._oldHTML != null) {
      btn.innerHTML = btn.dataset._oldHTML;
      delete btn.dataset._oldHTML;
    }
  }

  function sanitizeFilename(name) {
    return String(name || "file")
      .replace(/[^\w.\-]+/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 90);
  }

  function safeExtFromName(name) {
    const s = String(name || "");
    const parts = s.split(".");
    if (parts.length < 2) return "bin";
    const ext = parts.pop().toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 8);
    return ext || "bin";
  }

  function formatErr(err) {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err.slice(0, 220);
    const msg = err.message || err.error_description || err.details || err.hint || "";
    if (msg) return String(msg).slice(0, 220);
    try {
      return JSON.stringify(err).slice(0, 220);
    } catch {
      return "Unknown error";
    }
  }


// ========================
// Storage URL helpers (PRIVATE bucket)
// ========================
function isHttpUrl(v) {
  return /^https?:\/\//i.test(String(v || "").trim());
}

function stripToStoragePath(v) {
  if (!v) return null;
  let s = String(v).trim();

  // If it's a full URL, strip known prefixes down to the object key
  if (isHttpUrl(s)) {
    const markers = [
      `/storage/v1/object/public/${BUCKET}/`,
      `/storage/v1/object/sign/${BUCKET}/`,
      `/storage/v1/object/${BUCKET}/`, // some proxies omit public/sign
      `/object/public/${BUCKET}/`,
      `/object/sign/${BUCKET}/`,
      `/object/${BUCKET}/`,
    ];
    for (const mk of markers) {
      const i = s.indexOf(mk);
      if (i !== -1) {
        s = s.slice(i + mk.length);
        break;
      }
    }
    s = s.replace(/^\/+/g, "");
  s = s.split("?")[0];
    s = s.split("?")[0];
    return s || null;
  }

  // If it contains URL-like segments but isn't a full URL
  const markers2 = [
    `storage/v1/object/public/${BUCKET}/`,
    `storage/v1/object/sign/${BUCKET}/`,
    `storage/v1/object/${BUCKET}/`,
    `object/public/${BUCKET}/`,
    `object/sign/${BUCKET}/`,
    `object/${BUCKET}/`,
  ];
  for (const mk of markers2) {
    const i = s.indexOf(mk);
    if (i !== -1) {
      s = s.slice(i + mk.length);
      break;
    }
  }

  // If someone stored "student-files/...."
  if (s.startsWith(`${BUCKET}/`)) s = s.slice(`${BUCKET}/`.length);

  s = s.replace(/^\/+/g, "");
  s = s.split("?")[0];
  return s || null;
}

function looksLikeDirPath(path) {
  const s = String(path || "");
  if (!s) return false;
  if (s.endsWith("/")) return true;
  const last = s.split("/").pop() || "";
  // no dot => probably folder (or "latest" without ext)
  return !last.includes(".");
}

/**
 * Build an openable URL for a PRIVATE bucket.
 * - Uses signed URL by default (expiresInSec).
 * - Avoids Storage.list() calls to reduce required permissions.
 */
async function buildDocLink(pathOrUrl, expiresInSec = 3600) {
  if (!pathOrUrl) return { path: null, url: null };

  const raw = stripToStoragePath(pathOrUrl) || String(pathOrUrl).trim();
  if (!raw) return { path: null, url: null };
  if (looksLikeDirPath(raw)) return { path: raw.replace(/\/+$/, ""), url: null };

  try {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(raw, expiresInSec);
    if (error) throw error;
    return { path: raw, url: data?.signedUrl || null };
  } catch (e) {
    // Fallback (if bucket is still public by accident)
    try {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(raw);
      return { path: raw, url: data?.publicUrl || (isHttpUrl(pathOrUrl) ? String(pathOrUrl) : null) };
    } catch {
      return { path: raw, url: isHttpUrl(pathOrUrl) ? String(pathOrUrl) : null };
    }
  }
}

/**
 * Always generate a fresh signed URL and open it.
 * This avoids "expired link" problems with private buckets.
 */
async function openSignedPath(pathOrUrl, expiresInSec = 3600) {
  const raw = stripToStoragePath(pathOrUrl) || String(pathOrUrl || "").trim();
  if (!raw) throw new Error("لا يوجد ملف لفتحه");
  if (looksLikeDirPath(raw)) throw new Error("مسار الملف غير صالح (مجلد وليس ملف)");

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(raw, expiresInSec);
  if (error) throw error;

  const url = data?.signedUrl;
  if (!url) throw new Error("تعذر إنشاء رابط تحميل");

  window.open(url, "_blank", "noopener");
  return url;
}


  // ========================
  // Auth
  // ========================
  async function requireUser() {
    // NOTE: In supabase-js v2, getUser() can return "Auth session missing!" when logged out.
    const { data: uData, error: uErr } = await supabase.auth.getUser();

    if (uErr) {
      const msg = String(uErr.message || uErr);
      if (!/auth session missing/i.test(msg)) throw uErr;
    }

    if (uData?.user) return uData.user;

    const { data: sData, error: sErr } = await supabase.auth.getSession();
    if (sErr) throw sErr;

    if (!sData?.session?.user) {
      const loginUrl = new URL("../auth/index.html", window.location.href).toString();
      location.replace(loginUrl);
      return null;
    }
    return sData.session.user;
  }


  // ========================
  // Profile
  // ========================
  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (el.full_name) el.full_name.value = data?.full_name ?? "";
    if (el.mother_name) el.mother_name.value = data?.mother_name ?? "";
    if (el.email) el.email.value = data?.email ?? user.email ?? "";
    if (el.phone) el.phone.value = data?.phone ?? "";
    if (el.desired_university) el.desired_university.value = data?.desired_university ?? "";
    if (el.desired_major) el.desired_major.value = data?.desired_major ?? "";

    if (el.userBadge) {
      el.userBadge.textContent = user.email ? `حساب: ${user.email}` : `UID: ${String(user.id).slice(0, 8)}...`;
    }
  }

  function validateProfileInputs() {
    const full_name = (el.full_name?.value || "").trim();
    const mother_name = (el.mother_name?.value || "").trim();
    const email = (el.email?.value || "").trim();
    const phone = (el.phone?.value || "").trim();
    const desired_university = (el.desired_university?.value || "").trim();
    const desired_major = (el.desired_major?.value || "").trim();

    if (el.full_name && full_name.length < 3) return { ok: false, msg: "اكتب الاسم الكامل بشكل صحيح" };
    if (el.mother_name && mother_name.length < 2) return { ok: false, msg: "اكتب اسم الأم بشكل صحيح" };
    if (el.email && !email.includes("@")) return { ok: false, msg: "اكتب الإيميل بشكل صحيح" };
    if (el.phone && phone.length < 8) return { ok: false, msg: "اكتب رقم واتساب صحيح" };
    if (el.desired_university && desired_university.length < 2) return { ok: false, msg: "اكتب الجامعة المطلوبة" };
    if (el.desired_major && desired_major.length < 2) return { ok: false, msg: "اكتب التخصص المطلوب" };

    return {
      ok: true,
      payload: { full_name, mother_name, email, phone, desired_university, desired_major },
    };
  }

  async function saveProfile() {
    const v = validateProfileInputs();
    if (!v.ok) return showCenterToast(v.msg, "warn", 2600);

    const payloadFull = {
      id: user.id,
      ...v.payload,
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabase.from("profiles").upsert(payloadFull, { onConflict: "id" });

    if (error) {
      const msg = String(error.message || "");
      const looksLikeMissingColumn = msg.includes("column") && msg.includes("does not exist");
      if (looksLikeMissingColumn) {
        const payloadMin = { id: user.id, full_name: v.payload.full_name, email: v.payload.email, phone: v.payload.phone };
        const r2 = await supabase.from("profiles").upsert(payloadMin, { onConflict: "id" });
        if (r2.error) throw r2.error;

        showCenterToast("تم حفظ البيانات ✅ (لكن يلزم إضافة أعمدة جديدة بقاعدة البيانات)", "warn", 4200);
      } else {
        throw error;
      }
    } else {
      showCenterToast("تم حفظ البيانات ✅", "ok", 2200);
    }

    await refreshAll();
  }

  // ========================
  // Documents
  // ========================
  async function loadDocumentsLatest() {
    const wanted = [...Object.keys(DOC_TYPES), ACCEPTANCE_TYPE];

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .in("type", wanted)
      .order("id", { ascending: false });

    if (error) throw error;

    const map = {};
    for (const row of data || []) {
      const t = row.type;
      if (!t || map[t]) continue; // keep first (latest by order)

const stored = row.url || row.path;
if (!stored) continue;

try {
  const built = await buildDocLink(stored, 3600);
  map[t] = { path: built.path || stored, url: built.url };
} catch (e) {
  // keep something truthy in path so completion/checklist works
  map[t] = { path: stored, url: isHttpUrl(stored) ? stored : null };
  console.warn("Doc link build failed for", t, stored, e);
}
}

    docsLatest = map;
    refreshDocsUI();
    refreshCompletionUI();

    const avatarUrl = docsLatest.personal_photo?.url;
    if (avatarUrl && el.avatarPreview && el.avatarPreviewWrap) {
      el.avatarPreview.src = avatarUrl;
      el.avatarPreviewWrap.style.display = "";
    }

    refreshAcceptanceUI();
  }

  // ✅ FIX: use UPSERT on (user_id, type) to avoid duplicate key error
  async function saveDocumentRow(type, path) {
    const base = { user_id: user.id, type, path };

    // 1) Try upsert with uploaded_by (if column exists)
    let r = await supabase
      .from("documents")
      .upsert({ ...base, uploaded_by: user.id }, { onConflict: "user_id,type" });

    if (!r.error) return;

    let msg = String(r.error.message || "");

    const missingColumn = msg.includes("column") && msg.includes("does not exist");
    const noConflictConstraint =
      msg.includes("no unique or exclusion constraint") ||
      msg.includes("ON CONFLICT specification") ||
      msg.includes("matching the ON CONFLICT");

    // 2) If uploaded_by column doesn't exist, retry minimal upsert
    if (missingColumn) {
      r = await supabase.from("documents").upsert(base, { onConflict: "user_id,type" });
      if (!r.error) return;
      msg = String(r.error.message || "");
    }

    // 3) If DB has no unique constraint for onConflict (older schema), fallback to insert
    if (noConflictConstraint) {
      // Try insert with uploaded_by then fallback minimal
      const ins1 = await supabase.from("documents").insert({ ...base, uploaded_by: user.id });
      if (!ins1.error) return;

      const msg2 = String(ins1.error.message || "");
      const missingColumn2 = msg2.includes("column") && msg2.includes("does not exist");

      if (missingColumn2) {
        const ins2 = await supabase.from("documents").insert(base);
        if (ins2.error) throw ins2.error;
        return;
      }

      // If still duplicate happens, last-resort update
      if (msg2.toLowerCase().includes("duplicate key")) {
        const upd = await supabase.from("documents").update({ path }).eq("user_id", user.id).eq("type", type);
        if (upd.error) throw upd.error;
        return;
      }

      throw ins1.error;
    }

    // otherwise throw the upsert error
    throw r.error;
  }

  async function uploadToStorage(type, file) {
    if (!file) throw new Error("اختر ملف أولاً");

    const safeName = sanitizeFilename(file.name);
    const ext = safeExtFromName(safeName);

    // ✅ stable path per doc type (replace file instead of creating infinite copies)
    const path = `students/${user.id}/${type}/latest.${ext}`;

    const maxMB = DOC_TYPES[type]?.maxMB ?? 12;
    if (file.size > maxMB * 1024 * 1024) {
      throw new Error(`حجم الملف كبير جداً (الحد ${maxMB}MB)`);
    }

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

    if (error) throw error;
    return path;
  }

  async function handleUpload(type) {
    const cfg = DOC_TYPES[type];
    if (!cfg) return;

    // local guard
    if (inFlightUpload.has(type)) return;
    inFlightUpload.add(type);

    const input = cfg.input();
    const btn = cfg.btn();
    const file = input?.files?.[0];

    if (!file) {
      inFlightUpload.delete(type);
      return showCenterToast("اختر ملف أولاً", "warn", 2200);
    }

    try {
      setLoading(btn, true, "رفع...");
      const path = await uploadToStorage(type, file);

      // ✅ FIXED: upsert row instead of insert
      await saveDocumentRow(type, path);

      if (input) input.value = "";

      showCenterToast(`تم رفع ${cfg.label} ✅`, "ok", 2200);
      await loadDocumentsLatest();
    } catch (e) {
      console.error(e);
      showCenterToast(`فشل رفع ${cfg.label} ❌ (${formatErr(e)})`, "danger", 4200);
    } finally {
      setLoading(btn, false);
      inFlightUpload.delete(type);
    }
  }

  // ========================
  // UI (Docs)
  // ========================
  function setStatusChip(statusEl, uploaded) {
    if (!statusEl) return;
    statusEl.classList.remove("chip", "ok", "warn", "danger");
    statusEl.classList.add("chip", uploaded ? "ok" : "warn");
    statusEl.textContent = uploaded ? "مرفوعة ✅" : "غير مرفوعة";
  }

  
function setViewLink(viewEl, pathOrUrl, label = "الملف") {
  if (!viewEl) return;

  if (pathOrUrl) {
    // Show and always generate a fresh signed URL (private bucket)
    viewEl.style.display = "inline-flex";

    // for <a> elements keep it clickable, but we handle click ourselves
    try {
      viewEl.href = "#";
      viewEl.target = "_blank";
      viewEl.rel = "noopener";
    } catch {}

    viewEl.onclick = async (e) => {
      try {
        e?.preventDefault?.();
        await openSignedPath(pathOrUrl, 3600);
      } catch (err) {
        console.error(err);
        showCenterToast(`تعذر فتح ${label} ❌ (${formatErr(err)})`, "danger", 4200);
      }
    };
  } else {
    try {
      viewEl.href = "#";
    } catch {}
    viewEl.style.display = "none";
    viewEl.onclick = null;
  }
}

  function refreshDocsUI() {
    for (const [type, cfg] of Object.entries(DOC_TYPES)) {
      const doc = docsLatest[type];
      const uploaded = !!doc?.path;
      setStatusChip(cfg.status(), uploaded);
      setViewLink(cfg.view(), doc?.path || doc?.url || null, cfg.label);
    }
  }

  // ========================
  // UI (Acceptance)
  // ========================
  function refreshAcceptanceUI() {
    if (!el.acceptance) return;

    const doc = docsLatest[ACCEPTANCE_TYPE];
    const hasAny = !!(doc?.path || doc?.url);

    if (!hasAny) {
      el.acceptance.innerHTML = `
        <span class="chip warn">غير متوفر حالياً</span>
        <p class="muted" style="margin-top:8px">عند صدور ملف القبول سيتم عرضه هنا.</p>
      `;
      return;
    }

    // Private bucket: generate a fresh signed URL on click
    el.acceptance.innerHTML = `
      <span class="chip ok">متوفر ✅</span>
      <p class="muted" style="margin-top:8px">
        <a href="#" id="downloadAcceptance" class="link">تحميل ملف القبول</a>
      </p>
    `;

    const a = document.getElementById("downloadAcceptance");
    if (a) {
      a.onclick = async (e) => {
        try {
          e?.preventDefault?.();
          await openSignedPath(doc.path || doc.url, 3600);
        } catch (err) {
          console.error(err);
          showCenterToast(`تعذر تحميل ملف القبول ❌ (${formatErr(err)})`, "danger", 5200);
        }
      };
    }
  }

  // ========================
  // Completion
  // ========================
  function computeCompletion() {
    const checks = [];

    const fullOk = (el.full_name?.value || "").trim().length >= 3;
    const motherOk = (el.mother_name?.value || "").trim().length >= 2;
    const emailOk = (el.email?.value || "").trim().includes("@");
    const phoneOk = (el.phone?.value || "").trim().length >= 8;
    const uniOk = (el.desired_university?.value || "").trim().length >= 2;
    const majorOk = (el.desired_major?.value || "").trim().length >= 2;

    checks.push(fullOk, motherOk, emailOk, phoneOk, uniOk, majorOk);

    for (const t of Object.keys(DOC_TYPES)) checks.push(!!docsLatest?.[t]?.path);

    const total = checks.length;
    const done = checks.filter(Boolean).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    return { pct, fullOk, motherOk, emailOk, phoneOk, uniOk, majorOk };
  }

  function refreshCompletionUI() {
    const c = computeCompletion();

    if (el.completionPct) {
      el.completionPct.classList.remove("ok", "warn", "danger", "chip");
      el.completionPct.classList.add("chip");
      el.completionPct.textContent = `${c.pct}%`;
      if (c.pct >= 100) el.completionPct.classList.add("ok");
      else if (c.pct >= 60) el.completionPct.classList.add("warn");
      else el.completionPct.classList.add("danger");
    }

    if (el.completionBar) el.completionBar.style.width = `${c.pct}%`;

    if (!el.checklist) return;

    const has = (t) => !!docsLatest?.[t]?.path;

    const items = [
      { ok: c.fullOk, text: "الاسم الكامل" },
      { ok: c.motherOk, text: "اسم الأم" },
      { ok: c.emailOk, text: "الإيميل" },
      { ok: c.phoneOk, text: "رقم الواتساب" },
      { ok: c.uniOk, text: "الجامعة المطلوبة" },
      { ok: c.majorOk, text: "التخصص المطلوب" },
      { ok: has("personal_photo"), text: "الصورة الشخصية" },
      { ok: has("passport"), text: "جواز السفر" },
      { ok: has("transcript"), text: "كشف العلامات" },
      { ok: has("secondary_certificate"), text: "شهادة الثانوية" },
      { ok: has("other_doc"), text: "وثائق أخرى" },
    ];

    el.checklist.innerHTML = items
      .map(
        (i) => `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:1px solid var(--border); border-radius:14px; background:#fff;">
          <div style="font-weight:900;">${i.text}</div>
          <span class="chip ${i.ok ? "ok" : "warn"}">${i.ok ? "مكتمل" : "ناقص"}</span>
        </div>
      `
      )
      .join("");
  }

  function bindLiveCompletion() {
    const fields = [el.full_name, el.mother_name, el.email, el.phone, el.desired_university, el.desired_major].filter(Boolean);
    fields.forEach((inp) => {
      inp.addEventListener("input", refreshCompletionUI);
      inp.addEventListener("change", refreshCompletionUI);
    });
  }

  // ========================
  // Init / Refresh
  // ========================
  async function refreshAll() {
    await loadProfile();
    await loadDocumentsLatest();
    refreshDocsUI();
    refreshCompletionUI();
    refreshAcceptanceUI();
  }

  function bindEvents() {
    if (el.saveProfile) {
      el.saveProfile.addEventListener("click", async () => {
        try {
          setLoading(el.saveProfile, true, "حفظ...");
          await saveProfile();
        } catch (e) {
          console.error(e);
          showCenterToast(`فشل الحفظ ❌ (${formatErr(e)})`, "danger", 4200);
        } finally {
          setLoading(el.saveProfile, false);
        }
      });
    }

    if (el.refresh) {
      el.refresh.addEventListener("click", async () => {
        try {
          setLoading(el.refresh, true, "تحديث...");
          await refreshAll();
          showCenterToast("تم التحديث ✅", "ok", 1600);
        } catch (e) {
          console.error(e);
          showCenterToast(`فشل التحديث ❌ (${formatErr(e)})`, "danger", 4200);
        } finally {
          setLoading(el.refresh, false);
        }
      });
    }

    if (el.uploadPhoto) el.uploadPhoto.addEventListener("click", () => handleUpload("personal_photo"));
    if (el.uploadPassport) el.uploadPassport.addEventListener("click", () => handleUpload("passport"));
    if (el.uploadTranscript) el.uploadTranscript.addEventListener("click", () => handleUpload("transcript"));
    if (el.uploadSecondary) el.uploadSecondary.addEventListener("click", () => handleUpload("secondary_certificate"));
    if (el.uploadOther) el.uploadOther.addEventListener("click", () => handleUpload("other_doc"));

    bindLiveCompletion();
  }

  (async function init() {
    try {
      if (!el.centerToast) console.warn("centerToast not found");
      bindEvents();

      user = await requireUser();
      if (!user) return;

      // show page content once authenticated
      document.documentElement.classList.remove("auth-pending");

      await refreshAll();
    } catch (e) {
      console.error(e);
      // show page content so the error is visible
      document.documentElement.classList.remove("auth-pending");
      showCenterToast(`Init error ❌ (${formatErr(e)})`, "danger", 5200);
    }
  })();
}
