import { Link } from "react-router-dom";

const categoryImages = {
  "Feijão": "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
  "Cereais": "https://images.pexels.com/photos/8477743/pexels-photo-8477743.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
};

const categoryEmojis = {
  "Feijão": "🫘",
  "Cereais": "🌾",
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-2xl mb-1 block drop-shadow-lg">{categoryEmojis[category] || "📦"}</span>
        <h3 className="text-white text-xl font-extrabold tracking-wide drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)'}}>{category}</h3>
      </div>
    </Link>
  );
}