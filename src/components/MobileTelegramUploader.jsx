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

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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

      const res = await fetch("/api/send-to-telegram", {
        method: "POST",
        body: formData
      });

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 py-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-5"
      >
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Quick Sender</h1>
          <p className="text-sm text-slate-300">
            Privacy-safe Telegram uploader
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
          onPaste={(e) => e.preventDefault()}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabaringizni yozing..."
            name="secure_msg_field_x9"
            autoComplete="new-password"
            inputMode="text"
            className="w-full h-32 rounded-3xl bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-white/30 resize-none"
          />

          <label className="block rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 cursor-pointer active:scale-[0.995] transition">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <ImageIcon size={16} />
              <span>Rasm yoki video tanlang</span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              autoComplete="off"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              {isVideo ? (
                <video src={preview} controls className="w-full max-h-64" />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-64"
                />
              )}

              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {status.text && (
            <div
              className={`text-sm px-4 py-3 rounded-2xl border ${
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
            className="w-full rounded-3xl py-3 bg-white text-black font-medium flex items-center justify-center gap-2 disabled:opacity-60"
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
      </motion.div>
    </div>
  );
}