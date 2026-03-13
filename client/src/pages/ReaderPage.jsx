import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

export const ReaderPage = () => {
  const { comicId, chapterId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api
      .get(`/comics/${comicId}/chapters/${chapterId}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setData(null);
        setError(err?.response?.data?.message || "Could not load chapter");
      });
  }, [comicId, chapterId]);

  if (error) {
    return (
      <div className="space-y-4 rounded-xl border border-rose-500/40 bg-rose-950/20 p-6">
        <p className="text-rose-200">{error}</p>
        <Link to={`/comics/${comicId}`} className="inline-block rounded-full bg-prism-neon px-4 py-2 font-semibold text-slate-900">
          Back to Comic
        </Link>
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-300">Loading chapter...</p>;
  }

  const { chapter, previousChapter, nextChapter } = data;

  return (
    <>
      <Helmet>
        <title>
          {chapter.title} - Chapter {chapter.chapter_number} | PrismYaoi Reader
        </title>
      </Helmet>

      <div className="space-y-6">
        <header className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <h1 className="text-2xl font-black">
            Chapter {chapter.chapter_number}: {chapter.title}
          </h1>
        </header>

        <div className="space-y-4">
          {chapter.images.map((url, index) => (
            <img
              key={`${chapter._id}-${index}`}
              src={url}
              alt={`${chapter.title} panel ${index + 1}`}
              className="mx-auto w-full max-w-3xl rounded-lg border border-slate-800 object-cover"
              loading="lazy"
            />
          ))}
        </div>

        <div className="sticky bottom-4 z-40 mx-auto flex w-fit items-center gap-3 rounded-full border border-slate-600 bg-slate-950/90 px-3 py-2 shadow-neon">
          {previousChapter ? (
            <Link
              to={`/comics/${comicId}/read/${previousChapter.id}`}
              className="rounded-full border border-slate-600 px-4 py-2 text-sm hover:border-cyan-300"
            >
              Previous Chapter
            </Link>
          ) : (
            <span className="rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-500">No Previous</span>
          )}

          <Link to={`/comics/${comicId}`} className="rounded-full bg-prism-neon px-4 py-2 text-sm font-semibold text-slate-900">
            Chapter List
          </Link>

          {nextChapter ? (
            <Link
              to={`/comics/${comicId}/read/${nextChapter.id}`}
              className="rounded-full border border-slate-600 px-4 py-2 text-sm hover:border-fuchsia-300"
            >
              Next Chapter
            </Link>
          ) : (
            <span className="rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-500">No Next</span>
          )}
        </div>
      </div>
    </>
  );
};
