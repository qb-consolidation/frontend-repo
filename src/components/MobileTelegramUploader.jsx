import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Image as ImageIcon, Send, X } from "lucide-react";

const API_URL =
  "https://tg-sender-production.up.railway.app/api/send-to-telegram";

export default function MobileTelegramUploader() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const inputRef = useRef(null);

  const isVideo = useMemo(
    () => file?.type?.startsWith("video/"),
    [file]
  );

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (preview) URL.revokeObjectURL(preview);

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus({ type: "", text: "" });
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !file) {
      setStatus({ type: "error", text: "Xabar yoki media tanlang" });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", text: "" });

      const formData = new FormData();
      formData.append("message", message.trim());
      if (file) formData.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Server xatosi");

      setMessage("");
      clearFile();
      setStatus({ type: "success", text: "Telegramga yuborildi ✅" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 text-white bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)]">
      
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-5 pb-3">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />

          <h1 className="text-[22px] font-semibold tracking-tight">
            Quick Sender
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Secure Telegram upload interface
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="p-5 pt-2 space-y-4">

          {/* TEXTAREA */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabaringizni yozing..."
            className="w-full h-28 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm outline-none resize-none placeholder:text-slate-500 focus:border-blue-400/40 transition"
          />

          {/* FILE INPUT */}
          <label className="flex items-center gap-2 p-4 rounded-2xl border border-dashed border-white/15 bg-white/5 cursor-pointer hover:bg-white/10 transition">
            <ImageIcon size={16} />
            <span className="text-sm text-slate-300">
              Rasm yoki video tanlang
            </span>

            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={onFileChange}
            />
          </label>

          {/* PREVIEW */}
          {preview && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              {isVideo ? (
                <video src={preview} controls className="w-full max-h-64" />
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-64 object-cover"
                />
              )}

              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* STATUS */}
          {status.text && (
            <div
              className={`text-sm px-4 py-3 rounded-xl border ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : "bg-red-500/10 text-red-300 border-red-500/20"
              }`}
            >
              {status.text}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-3 bg-white text-black font-medium flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.15)] active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? (
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
