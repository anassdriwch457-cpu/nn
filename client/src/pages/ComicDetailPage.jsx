import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Crown, Lock, PlayCircle, Sparkles } from "lucide-react";
import { api } from "../api";
import { UnlockChapterModal } from "../components/UnlockChapterModal";
import { useAuth } from "../context/AuthContext";

export const ComicDetailPage = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const { user, refreshMe } = useAuth();
  const [comic, setComic] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [unlocking, setUnlocking] = useState(false);

  const fetchComic = useCallback(() => api.get(`/comics/${comicId}`).then((res) => setComic(res.data)), [comicId]);

  useEffect(() => {
    fetchComic();
  }, [fetchComic]);

  const sortedChapters = useMemo(
    () => (comic?.chapters ? [...comic.chapters].sort((a, b) => a.chapter_number - b.chapter_number) : []),
    [comic]
  );
  const firstReadableChapter = useMemo(
    () => sortedChapters.find((chapter) => !chapter.locked),
    [sortedChapters]
  );

  const onUnlockChapter = async () => {
    if (!selectedChapter) return;
    try {
      setUnlocking(true);
      await api.post("/coins/unlock", { chapterId: selectedChapter.chapter_ref });
      await refreshMe();
      await fetchComic();
      setSelectedChapter(null);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to unlock chapter";
      alert(message);
    } finally {
      setUnlocking(false);
    }
  };

  if (!comic) {
    return <p className="text-slate-300">Loading comic details...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{comic.title} | Obsidian Series</title>
        <meta name="description" content={comic.description} />
        <meta name="keywords" content={(comic.tags || []).join(",")} />
      </Helmet>

      <section className="space-y-7">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-obsidian-900/65 p-5 shadow-card-soft backdrop-blur-xl md:p-7">
          <img
            src={comic.cover_image}
            alt={comic.title}
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/92 to-obsidian-900/55" />
          <div className="relative z-10 grid gap-6 md:grid-cols-[260px_1fr]">
            <aside className="space-y-4 md:sticky md:top-24 md:self-start">
              <div className="group relative overflow-hidden rounded-3xl border border-white/[0.1] bg-obsidian-900/90 shadow-card-soft">
                <img
                  src={comic.cover_image}
                  alt={comic.title}
                  className="h-[360px] w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-transparent to-transparent" />
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
                <p className="mt-1 font-display text-lg font-semibold text-slate-50">{comic.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(comic.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-premium-iris"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <article className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.28em] text-premium-gold/80">Series Profile</p>
                <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {comic.title}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{comic.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {firstReadableChapter ? (
                  <Link
                    to={`/comics/${comicId}/read/${firstReadableChapter.chapter_ref}`}
                    className="btn-press inline-flex items-center gap-2 rounded-full bg-premium-sheen px-5 py-2.5 text-sm font-semibold text-obsidian-950 shadow-glow-violet"
                  >
                    <PlayCircle size={16} />
                    Start Reading
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    const firstLocked = sortedChapters.find((chapter) => chapter.locked);
                    if (!firstLocked) return;
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setSelectedChapter(firstLocked);
                  }}
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-premium-gold/40 bg-premium-gold/10 px-5 py-2.5 text-sm font-semibold text-premium-gold hover:bg-premium-gold/15"
                >
                  <Crown size={16} />
                  Premium Unlock
                </button>
              </div>
            </article>
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Episodes</p>
              <h2 className="font-display text-xl font-semibold text-slate-50">Chapter Playlist</h2>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-slate-300">
              <Sparkles size={14} className="text-premium-gold" />
              Binge Mode
            </div>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {sortedChapters.length ? (
              sortedChapters.map((chapter) => (
                <li
                  key={chapter.chapter_ref}
                  className="group relative flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all duration-300 ease-in-out hover:bg-white/[0.02] md:px-6"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      Chapter {chapter.chapter_number}: {chapter.title}
                    </p>
                    {chapter.is_premium && (
                      <p className="mt-1 inline-flex items-center gap-1 text-sm text-premium-gold">
                        <Crown size={14} />
                        Premium · {chapter.price_in_coins} coins
                      </p>
                    )}
                  </div>

                  {chapter.locked ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        setSelectedChapter(chapter);
                      }}
                      className="btn-press premium-border flex items-center gap-2 rounded-full bg-obsidian-900 px-4 py-2 text-sm font-semibold text-premium-gold transition-all duration-300 ease-in-out hover:bg-obsidian-850"
                    >
                      <Lock size={16} />
                      Unlock with {chapter.price_in_coins}
                    </button>
                  ) : (
                    <Link
                      to={`/comics/${comicId}/read/${chapter.chapter_ref}`}
                      className="btn-press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-100 hover:border-premium-iris/40 hover:text-white"
                    >
                      Read
                      <ChevronRight size={16} className="transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-slate-400">No chapters yet.</li>
            )}
          </ul>
        </div>
      </section>

      <UnlockChapterModal
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
        onConfirm={onUnlockChapter}
        loading={unlocking}
      />
    </>
  );
};
