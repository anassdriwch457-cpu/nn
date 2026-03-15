import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api";
import { HeroSlider } from "../components/HeroSlider";
import { ComicCard } from "../components/ComicCard";

export const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/comics/featured"), api.get("/comics/trending"), api.get("/comics/new-releases")]).then(
      ([featuredRes, trendingRes, newRes]) => {
        setFeatured(featuredRes.data);
        setTrending(trendingRes.data);
        setNewReleases(newRes.data);
      }
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>PrismYaoi | Premium Yaoi Webtoon Platform</title>
        <meta
          name="description"
          content="Discover trending and newly released yaoi webtoons with premium chapters and a sleek neon dark mode experience."
        />
      </Helmet>

      <div className="space-y-10">
        <HeroSlider comics={featured} />

        <section id="library">
          <h2 className="mb-4 text-2xl font-bold">
            <span className="bg-premium-sheen bg-clip-text text-transparent">Trending Now</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((comic) => (
              <ComicCard key={comic._id} comic={comic} />
            ))}
          </div>
        </section>

        <section id="search">
          <h2 className="mb-4 text-2xl font-bold text-premium-iris">New Releases</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newReleases.map((comic) => (
              <ComicCard key={comic._id} comic={comic} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
