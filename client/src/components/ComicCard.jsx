import { Link } from "react-router-dom";

export const ComicCard = ({ comic }) => {
  return (
    <Link
      to={`/comics/${comic._id}`}
      className="group overflow-hidden rounded-xl border border-slate-700 bg-slate-900/70 transition hover:border-fuchsia-400"
    >
      <img
        src={comic.cover_image}
        alt={comic.title}
        className="h-56 w-full object-cover transition group-hover:scale-105"
        loading="lazy"
      />
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-bold">{comic.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">{comic.description}</p>
        <div className="flex flex-wrap gap-2">
          {(comic.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-fuchsia-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
