import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Image as ImageIcon, Send, X } from "lucide-react";

export default function MobileTelegramUploader() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [formKey, setFormKey] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.replaceState(null, "", window.location.href);

    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);

    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  const isVideo = useMemo(() => file?.type?.startsWith("video/"), [file]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus({ type: "", text: "" });
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const resetForm = () => {
    setMessage("");
    clearFile();
    setFormKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !file) {
      setStatus({ type: "error", text: "Matn yoki media tanlang." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", text: "" });

      const formData = new FormData();
      formData.append("message", message.trim());

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        "https://tg-sender-production.up.railway.app/api/send-to-telegram",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Server xatosi.");
      }

      resetForm();
      setStatus({ type: "success", text: "Telegramga yuborildi." });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Xatolik." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
   <div
  className="min-h-screen px-4 py-6 flex items-center justify-center text-white"
  style={{
    background:
      "linear-gradient(180deg, #020617 0%, #0f172a 45%, #020617 100%)"
  }}
>
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-[2.4rem] border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <div className="relative px-5 pt-6 pb-5">
          <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-5" />

          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Private Upload
            </p>

            <h1 className="text-[1.7rem] leading-tight font-semibold tracking-tight mt-1">
              Quick Sender
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Fast, clean and secure Telegram delivery
            </p>
          </div>

          <form
            key={formKey}
            onSubmit={handleSubmit}
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="space-y-4"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabaringizni yozing..."
              autoComplete="new-password"
              className="w-full h-32 rounded-[1.7rem] bg-white/[0.045] border border-white/10 px-4 py-4 text-sm outline-none resize-none placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.06] transition"
            />

            <label className="block rounded-[1.7rem] border border-dashed border-white/15 bg-white/[0.04] px-4 py-4 cursor-pointer transition hover:bg-white/[0.06]">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Image as ImageIcon size={16} />
                <span>Rasm yoki video tanlang</span>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {preview && (
              <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20">
                {isVideo ? (
                  <video src={preview} controls className="w-full max-h-72" />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full max-h-72 object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 bg-black/50 backdrop-blur-xl p-2 rounded-full"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {status.text && (
              <div
                className={`text-sm px-4 py-3 rounded-[1.3rem] border ${
                  status.type === "success"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-red-500/10 text-red-300 border-red-500/20"
                }`}
              >
                {status.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[1.6rem] py-3.5 bg-white text-black font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition active:scale-[0.99] shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Yuborish
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
