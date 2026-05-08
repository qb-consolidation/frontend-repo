import React, { useMemo, useRef, useState, useEffect } from "react";
            autoComplete="new-password"
            spellCheck={false}
            className="w-full h-32 rounded-3xl bg-white/5 border border-white/10 p-4 text-sm outline-none resize-none"
          />

          <label className="block rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <ImageIcon size={16} />
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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              {isVideo ? (
                <video src={preview} controls className="w-full max-h-64 object-cover" />
              ) : (
                <img src={preview} alt="preview" className="w-full max-h-64 object-cover" />
              )}

              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-2"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {status.text && (
            <div className={`text-sm px-4 py-3 rounded-2xl ${status.type === "success" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
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