import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const tiers = [
  { label: "Starter", coins: 50, price: "$4.99" },
  { label: "Reader", coins: 120, price: "$9.99", popular: true },
  { label: "Binge", coins: 260, price: "$19.99" },
  { label: "Collector", coins: 700, price: "$49.99" },
];

export const BuyCoinsPage = () => {
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();

  const onBuy = async (coins) => {
    if (!user) {
      navigate("/login");
      return;
    }

    await api.post("/coins/top-up", { amount: coins });
    await refreshMe();
    alert(`Added ${coins} coins to your wallet.`);
  };

  return (
    <>
      <Helmet>
        <title>Buy Coins | PrismYaoi</title>
      </Helmet>

      <section>
        <h1 className="mb-2 text-3xl font-black">Buy Coins</h1>
        <p className="mb-6 text-slate-300">Unlock premium chapters instantly with Prism Coins.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <article
              key={tier.label}
              className={`rounded-2xl border p-5 ${tier.popular ? "border-fuchsia-400 shadow-neon" : "border-slate-700 bg-slate-900/60"}`}
            >
              {tier.popular && (
                <div className="mb-3 w-fit rounded-full bg-pride-rainbow px-3 py-1 text-xs font-bold text-slate-900">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-bold">{tier.label}</h2>
              <p className="mt-2 text-3xl font-black text-fuchsia-300">{tier.coins} Coins</p>
              <p className="mb-5 mt-1 text-slate-300">{tier.price}</p>
              <button
                type="button"
                onClick={() => onBuy(tier.coins)}
                className="w-full rounded-full bg-prism-neon px-4 py-2 font-bold text-slate-900"
              >
                Buy Now
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
