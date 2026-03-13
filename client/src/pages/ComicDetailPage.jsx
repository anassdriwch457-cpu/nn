import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
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

  const fetchComic = () => api.get(`/comics/${comicId}`).then((res) => setComic(res.data));

  useEffect(() => {
    fetchComic();
  }, [comicId]);

  const sortedChapters = useMemo(
    () => (comic?.chapters ? [...comic.chapters].sort((a, b) => a.chapter_number - b.chapter_number) : []),
    [comic]
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
        <title>{comic.title} | PrismYaoi</title>
        <meta name="description" content={comic.description} />
        <meta name="keywords" content={(comic.tags || []).join(",")} />
      </Helmet>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <img src={comic.cover_image} alt={comic.title} className="w-full rounded-2xl border border-slate-700 object-cover" />
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-300">Status</p>
            <p className="font-semibold">{comic.status}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(comic.tags || []).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-fuchsia-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <h1 className="mb-3 text-3xl font-black">{comic.title}</h1>
          <p className="mb-6 text-slate-200">{comic.description}</p>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/60">
            <div className="border-b border-slate-700 px-4 py-3 font-semibold">Chapters</div>
            <ul>
              {sortedChapters.map((chapter) => (
                <li
                  key={chapter.chapter_ref}
                  className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      Chapter {chapter.chapter_number}: {chapter.title}
                    </p>
                    {chapter.is_premium && (
                      <p className="text-sm text-fuchsia-300">Premium · {chapter.price_in_coins} coins</p>
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
                      className="flex items-center gap-2 rounded-full border border-fuchsia-400/50 px-4 py-2 text-sm"
                    >
                      <Lock size={16} />
                      Unlock
                    </button>
                  ) : (
                    <Link
                      to={`/comics/${comicId}/read/${chapter.chapter_ref}`}
                      className="rounded-full bg-prism-neon px-4 py-2 text-sm font-semibold text-slate-900"
                    >
                      Read
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <UnlockChapterModal
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
        onConfirm={onUnlockChapter}
        loading={unlocking}
      />
    </>
  );
};
