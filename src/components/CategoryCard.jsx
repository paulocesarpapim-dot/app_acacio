import { Link } from "react-router-dom";

const categoryImages = {
  "Feijão": "https://images.pexels.com/photos/6613054/pexels-photo-6613054.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Farinha": "https://images.pexels.com/photos/8477743/pexels-photo-8477743.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Queijos": "https://images.pexels.com/photos/793129/pexels-photo-793129.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Manteiga": "https://images.pexels.com/photos/10165696/pexels-photo-10165696.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Bolachas": "https://images.pexels.com/photos/6103122/pexels-photo-6103122.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Rapadura": "https://images.pexels.com/photos/29748150/pexels-photo-29748150.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Doces": "https://images.pexels.com/photos/5365924/pexels-photo-5365924.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Cereais": "https://images.pexels.com/photos/4224269/pexels-photo-4224269.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Requeijão": "https://images.pexels.com/photos/12449964/pexels-photo-12449964.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Temperos": "https://images.pexels.com/photos/5740404/pexels-photo-5740404.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Carne de Sol": "https://images.pexels.com/photos/5237010/pexels-photo-5237010.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Outros": "https://images.pexels.com/photos/4224269/pexels-photo-4224269.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
};

const categoryEmojis = {
  "Feijão": "🫘",
  "Farinha": "🌾",
  "Queijos": "🧀",
  "Manteiga": "🧈",
  "Bolachas": "🍪",
  "Rapadura": "🍬",
  "Doces": "🍮",
  "Cereais": "🌽",
  "Requeijão": "🥛",
  "Temperos": "🌶️",
  "Carne de Sol": "🥩",
  "Outros": "📦",
};

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/produtos?categoria=${encodeURIComponent(category)}`}
      className="group relative overflow-hidden rounded-2xl aspect-square sm:aspect-[4/3] block"
    >
      <img
        src={categoryImages[category] || categoryImages["Outros"]}
        alt={category}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-2xl mb-1 block">{categoryEmojis[category] || "📦"}</span>
        <h3 className="text-white font-display text-lg font-semibold">{category}</h3>
      </div>
    </Link>
  );
}