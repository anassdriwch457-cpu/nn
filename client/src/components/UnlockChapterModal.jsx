export const UnlockChapterModal = ({ chapter, onClose, onConfirm, loading }) => {
  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-obsidian-950/82 p-4 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="premium-border w-full max-w-md animate-float-up rounded-3xl bg-obsidian-900/95 p-6 shadow-glow-violet">
        <div className="mb-5">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-premium-gold/85">Premium Access</p>
          <h2 className="text-2xl font-display font-semibold text-white">Unlock this chapter</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-premium-iris">{chapter.title}</span> costs{" "}
            <span className="font-semibold text-premium-gold">{chapter.price_in_coins} coins</span>.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm text-slate-300">
            Fast unlock, instant access, and your progress is saved automatically across devices.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-press rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/[0.04]"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-press rounded-full bg-premium-sheen px-5 py-2 text-sm font-bold text-obsidian-950 shadow-glow-gold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Unlocking..." : `Unlock with ${chapter.price_in_coins} Coins`}
          </button>
        </div>
      </div>
    </div>
  );
};
