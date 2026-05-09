import React, { useMemo, useRef, useState } from "react";
import { Loader2, Image as ImageIcon, Send, X } from "lucide-react";

const API_URL =
  "https://tg-sender-production.up.railway.app/api/send-to-telegram";

export default function MobileTelegramUploader() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);

  const isVideo = useMemo(() => file?.type?.startsWith("video/"), [file]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (preview) URL.revokeObjectURL(preview);

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!message && !file) {
      setStatus("Xabar yoki file tanlang");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const fd = new FormData();
      fd.append("message", message);
      if (file) fd.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Xatolik");

      setMessage("");
      clearFile();
      setStatus("Yuborildi ✅");
    } catch (e) {
      setStatus("Xatolik ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Quick Sender</h2>
        <p style={styles.subtitle}>Telegram upload tool</p>

        <form onSubmit={submit} style={styles.form}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar yozing..."
            style={styles.textarea}
          />

          <label style={styles.uploadBox}>
            <ImageIcon size={16} />
            <span style={{ marginLeft: 8 }}>Rasm / Video tanlash</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </label>

          {preview && (
            <div style={styles.previewBox}>
              {isVideo ? (
                <video src={preview} controls style={styles.media} />
              ) : (
                <img src={preview} style={styles.media} />
              )}

              <button type="button" onClick={clearFile} style={styles.close}>
                <X size={14} />
              </button>
            </div>
          )}

          {status && <div style={styles.status}>{status}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Yuborilmoqda
              </>
            ) : (
              <>
                <Send size={16} /> Yuborish
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg,#020617,#0f172a,#020617)",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 18,
    backdropFilter: "blur(20px)",
    color: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  textarea: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    padding: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontSize: 13,
    opacity: 0.8,
  },
  previewBox: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    maxHeight: 260,
    objectFit: "cover",
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0,0,0,0.6)",
    border: "none",
    borderRadius: 20,
    color: "white",
    padding: 6,
    cursor: "pointer",
  },
  status: {
    fontSize: 13,
    opacity: 0.8,
  },
  button: {
    padding: 12,
    borderRadius: 16,
    border: "none",
    background: "white",
    color: "black",
    fontWeight: 600,
    cursor: "pointer",
  },
};
