import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api";

const defaultComicForm = {
  title: "",
  description: "",
  status: "Ongoing",
  cover_image: "",
  tags: "",
  featured: false,
};

const defaultChapterForm = {
  chapter_number: 1,
  title: "",
  images: "",
  is_premium: false,
  price_in_coins: 0,
};

export const AdminComicsPage = () => {
  const [comics, setComics] = useState([]);
  const [comicForm, setComicForm] = useState(defaultComicForm);
  const [chapterComicId, setChapterComicId] = useState("");
  const [chapterForm, setChapterForm] = useState(defaultChapterForm);

  const loadComics = () => api.get("/comics").then((res) => setComics(res.data));

  useEffect(() => {
    loadComics();
  }, []);

  const createComic = async (e) => {
    e.preventDefault();
    await api.post("/admin/comics", {
      ...comicForm,
      tags: comicForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setComicForm(defaultComicForm);
    await loadComics();
  };

  const addChapter = async (e) => {
    e.preventDefault();
    if (!chapterComicId) {
      alert("Select a comic first");
      return;
    }
    await api.post(`/admin/comics/${chapterComicId}/chapters`, {
      ...chapterForm,
      images: chapterForm.images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    });
    setChapterForm(defaultChapterForm);
    await loadComics();
  };

  return (
    <>
      <Helmet>
        <title>Admin Content Management | PrismYaoi</title>
      </Helmet>

      <section className="space-y-8">
        <h1 className="text-3xl font-black">Content Management</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={createComic} className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="text-xl font-bold">Upload New Comic</h2>
            <input
              required
              placeholder="Title"
              value={comicForm.title}
              onChange={(e) => setComicForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <textarea
              required
              placeholder="Description"
              value={comicForm.description}
              onChange={(e) => setComicForm((p) => ({ ...p, description: e.target.value }))}
              className="h-24 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <input
              required
              placeholder="Cover Image URL"
              value={comicForm.cover_image}
              onChange={(e) => setComicForm((p) => ({ ...p, cover_image: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <input
              placeholder="Tags (comma-separated)"
              value={comicForm.tags}
              onChange={(e) => setComicForm((p) => ({ ...p, tags: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <div className="flex items-center gap-3 text-sm">
              <select
                value={comicForm.status}
                onChange={(e) => setComicForm((p) => ({ ...p, status: e.target.value }))}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={comicForm.featured}
                  onChange={(e) => setComicForm((p) => ({ ...p, featured: e.target.checked }))}
                />
                Featured
              </label>
            </div>
            <button type="submit" className="rounded-full bg-prism-neon px-4 py-2 font-bold text-slate-900">
              Create Comic
            </button>
          </form>

          <form onSubmit={addChapter} className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="text-xl font-bold">Add Chapter & Set Price</h2>
            <select
              value={chapterComicId}
              onChange={(e) => setChapterComicId(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            >
              <option value="">Select Comic</option>
              {comics.map((comic) => (
                <option key={comic._id} value={comic._id}>
                  {comic.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              required
              placeholder="Chapter Number"
              value={chapterForm.chapter_number}
              onChange={(e) => setChapterForm((p) => ({ ...p, chapter_number: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <input
              required
              placeholder="Chapter Title"
              value={chapterForm.title}
              onChange={(e) => setChapterForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <textarea
              required
              placeholder="Image URLs (one per line)"
              value={chapterForm.images}
              onChange={(e) => setChapterForm((p) => ({ ...p, images: e.target.value }))}
              className="h-28 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={chapterForm.is_premium}
                onChange={(e) => setChapterForm((p) => ({ ...p, is_premium: e.target.checked }))}
              />
              Premium Chapter
            </label>
            <input
              type="number"
              min={0}
              placeholder="Price in Coins"
              value={chapterForm.price_in_coins}
              onChange={(e) => setChapterForm((p) => ({ ...p, price_in_coins: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
            />
            <button type="submit" className="rounded-full bg-pride-rainbow px-4 py-2 font-bold text-slate-900">
              Add Chapter
            </button>
          </form>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <h2 className="text-xl font-bold">Current Comics</h2>
          {comics.map((comic) => (
            <div key={comic._id} className="rounded-lg border border-slate-700 p-3">
              <p className="font-semibold">{comic.title}</p>
              <p className="text-sm text-slate-300">{comic.chapters?.length || 0} chapters</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
