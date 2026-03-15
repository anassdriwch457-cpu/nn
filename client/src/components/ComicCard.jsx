import { Link } from "react-router-dom";

export const ComicCard = ({ comic }) => {
  return (
    <Link
      to={`/comics/${comic._id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-obsidian-850/75 shadow-card-soft transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.015] hover:border-premium-iris/40 hover:shadow-glow-violet"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-70" />
      <img
        src={comic.cover_image}
        alt={comic.title}
        className="h-64 w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 space-y-2 p-4">
        <h3 className="line-clamp-1 font-serif text-xl font-semibold leading-tight text-white">{comic.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-200/90">{comic.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {(comic.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-obsidian-900/70 px-2 py-1 text-[11px] text-premium-iris">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
        <span className="btn-press rounded-full border border-premium-gold/40 bg-obsidian-900/70 px-5 py-2 text-sm font-semibold text-premium-gold shadow-glow-gold backdrop-blur">
          Play / Read
        </span>
      </div>
    </Link>
  );
};
