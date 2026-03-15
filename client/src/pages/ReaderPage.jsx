import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, List, Sparkles } from "lucide-react";
import { api } from "../api";

export const ReaderPage = () => {
  const { comicId, chapterId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [immersive, setImmersive] = useState(false);
  const [loadedPanels, setLoadedPanels] = useState({});
  const [nextPreview, setNextPreview] = useState(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setError("");
    setLoading(true);
    setLoadedPanels({});
    api
      .get(`/comics/${comicId}/chapters/${chapterId}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setData(null);
        setError(err?.response?.data?.message || "Could not load chapter");
      })
      .finally(() => setLoading(false));
  }, [comicId, chapterId]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      const movingDown = y > lastScrollY.current;
      if (y < 64) {
        setImmersive(false);
      } else if (movingDown && y > 140) {
        setImmersive(true);
      } else if (!movingDown) {
        setImmersive(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextChapterId = data?.nextChapter?.id;
  const nextChapterNumber = data?.nextChapter?.chapter_number;

  useEffect(() => {
    if (!nextChapterId) {
      setNextPreview(null);
      return;
    }

    let active = true;
    api
      .get(`/comics/${comicId}/chapters/${nextChapterId}`)
      .then((res) => {
        if (!active) return;
        const previewChapter = res.data?.chapter;
        setNextPreview({
          chapter_number: previewChapter?.chapter_number ?? nextChapterNumber,
          title: previewChapter?.title || "Continue the story",
          image: previewChapter?.images?.[0] || null,
        });
      })
      .catch(() => {
        if (!active) return;
        setNextPreview({
          chapter_number: nextChapterNumber,
          title: "A premium chapter awaits",
          image: null,
        });
      });

    return () => {
      active = false;
    };
  }, [comicId, nextChapterId, nextChapterNumber]);

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-2xl space-y-4 rounded-3xl border border-rose-300/25 bg-rose-950/20 p-6">
        <p className="text-rose-200">{error}</p>
        <Link
          to={`/comics/${comicId}`}
          className="btn-press inline-block rounded-full bg-premium-sheen px-4 py-2 font-semibold text-obsidian-950"
        >
          Back to Comic
        </Link>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-3 py-6 md:px-6">
        <div className="skeleton-shimmer h-24 rounded-3xl border border-white/[0.08]" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton-shimmer h-[360px] rounded-2xl border border-white/[0.07]" />
        ))}
      </div>
    );
  }

  const { chapter, previousChapter, nextChapter } = data;

  return (
    <>
      <Helmet>
        <title>
          {chapter.title} - Chapter {chapter.chapter_number} | Obsidian Reader
        </title>
      </Helmet>

      <div className="relative mx-auto w-full max-w-4xl px-3 pb-28 pt-4 md:px-6">
        <header
          className={`glass-panel sticky top-3 z-40 rounded-3xl p-4 shadow-card-soft transition-all duration-300 ease-in-out ${
            immersive ? "pointer-events-none -translate-y-5 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-premium-gold/80">Immersive Reader</p>
              <h1 className="text-balance font-serif text-2xl font-semibold text-white md:text-3xl">
                Chapter {chapter.chapter_number}: {chapter.title}
              </h1>
            </div>
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300 sm:flex">
              <Sparkles size={14} className="text-premium-iris" />
              Binge Flow
            </div>
          </div>
        </header>

        <section className="mt-5 space-y-4">
          {chapter.images.map((url, index) => (
            <figure
              key={`${chapter._id}-${index}`}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-900/80"
            >
              {!loadedPanels[index] && <div className="skeleton-shimmer absolute inset-0 min-h-[320px]" />}
              <img
                src={url}
                alt={`${chapter.title} panel ${index + 1}`}
                className={`mx-auto w-full object-cover transition-all duration-300 ease-in-out ${
                  loadedPanels[index] ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() =>
                  setLoadedPanels((previous) => ({
                    ...previous,
                    [index]: true,
                  }))
                }
              />
            </figure>
          ))}
        </section>

        <section className="mt-9">
          {nextChapter ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-obsidian-900/70 p-6">
              {nextPreview?.image && (
                <img
                  src={nextPreview.image}
                  alt="Next chapter teaser"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-obsidian-900/50" />
              <div className="relative z-10 space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-premium-gold/80">Up Next Teaser</p>
                <h2 className="font-serif text-3xl font-semibold text-white">
                  Chapter {nextPreview?.chapter_number ?? nextChapter.chapter_number}
                </h2>
                <p className="max-w-xl text-sm text-slate-300">
                  {nextPreview?.image
                    ? "A blurred preview is waiting. Continue now and keep the momentum alive."
                    : "The next chapter is locked behind premium access. Unlock and continue instantly."}
                </p>
                <Link
                  to={`/comics/${comicId}/read/${nextChapter.id}`}
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-premium-sheen px-5 py-2.5 text-sm font-semibold text-obsidian-950 shadow-glow-violet"
                >
                  Continue to Chapter {nextChapter.chapter_number}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/[0.08] bg-obsidian-900/65 p-6 text-center text-slate-300">
              You reached the latest chapter. New drops will appear here first.
            </div>
          )}
        </section>

        <div
          className={`glass-panel fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-2 rounded-2xl px-3 py-2 shadow-card-soft transition-all duration-300 ease-in-out ${
            immersive ? "pointer-events-none translate-y-20 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {previousChapter ? (
            <Link
              to={`/comics/${comicId}/read/${previousChapter.id}`}
              className="btn-press flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-xs text-slate-200 hover:border-premium-iris/40 sm:text-sm"
            >
              <ChevronLeft size={14} />
              Prev
            </Link>
          ) : (
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-500 sm:text-sm">No Prev</span>
          )}

          <Link
            to={`/comics/${comicId}`}
            className="btn-press inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-100 ring-1 ring-white/10 sm:text-sm"
          >
            <List size={14} />
            Chapters
          </Link>

          {nextChapter ? (
            <Link
              to={`/comics/${comicId}/read/${nextChapter.id}`}
              className="btn-press flex items-center gap-1 rounded-full bg-premium-sheen px-3 py-2 text-xs font-semibold text-obsidian-950 sm:text-sm"
            >
              Next
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-500 sm:text-sm">No Next</span>
          )}
        </div>
      </div>
    </>
  );
};
