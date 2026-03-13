export const UnlockChapterModal = ({ chapter, onClose, onConfirm, loading }) => {
  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-fuchsia-400/40 bg-slate-900 p-6 shadow-neon">
        <h2 className="mb-2 text-xl font-bold">Unlock Premium Chapter</h2>
        <p className="text-slate-300">
          {chapter.title} costs <span className="font-semibold text-fuchsia-300">{chapter.price_in_coins} coins</span>.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-prism-neon px-5 py-2 text-sm font-bold text-slate-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
};
