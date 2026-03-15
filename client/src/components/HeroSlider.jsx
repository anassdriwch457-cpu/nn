import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const HeroSlider = ({ comics }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!comics.length) return undefined;
    const timer = setInterval(() => {
      setIndex((previous) => (previous + 1) % comics.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [comics.length]);

  if (!comics.length) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <p className="text-slate-300">No featured comics yet.</p>
      </div>
    );
  }

  const comic = comics[index];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] shadow-card-soft">
      <img src={comic.cover_image} alt={comic.title} className="h-80 w-full object-cover opacity-60" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-900/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-premium-gold/85">Featured Title</p>
        <h1 className="mb-2 max-w-xl font-serif text-4xl font-semibold">{comic.title}</h1>
        <p className="mb-5 max-w-xl text-slate-200">{comic.description}</p>
        <Link
          to={`/comics/${comic._id}`}
          className="btn-press w-fit rounded-full bg-premium-sheen px-5 py-2 font-bold text-obsidian-950 shadow-glow-violet"
        >
          Read Now
        </Link>
      </div>
    </section>
  );
};
