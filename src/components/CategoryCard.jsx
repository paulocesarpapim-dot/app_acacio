import { Link } from "react-router-dom";

const categoryImages = {
  "Feijão": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop",
  "Farinha": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
  "Queijos": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
  "Manteiga": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop",
  "Bolachas": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
  "Rapadura": "https://images.unsplash.com/photo-1604431696980-07e518647610?w=400&h=300&fit=crop",
  "Doces": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
  "Cereais": "https://images.unsplash.com/photo-1536304993881-460ea32c4328?w=400&h=300&fit=crop",
  "Requeijão": "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=300&fit=crop",
  "Outros": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop",
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