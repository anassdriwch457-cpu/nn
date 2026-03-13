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
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center">
        <p className="text-slate-300">No featured comics yet.</p>
      </div>
    );
  }

  const comic = comics[index];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-fuchsia-500/30 shadow-neon">
      <img src={comic.cover_image} alt={comic.title} className="h-80 w-full object-cover opacity-60" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-fuchsia-300">Featured Title</p>
        <h1 className="mb-2 max-w-xl text-4xl font-extrabold">{comic.title}</h1>
        <p className="mb-5 max-w-xl text-slate-200">{comic.description}</p>
        <Link
          to={`/comics/${comic._id}`}
          className="w-fit rounded-full bg-prism-neon px-5 py-2 font-bold text-slate-900 transition hover:scale-105"
        >
          Read Now
        </Link>
      </div>
    </section>
  );
};
