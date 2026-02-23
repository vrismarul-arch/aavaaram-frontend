import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";
import ProductCard from "../../components/ProductCard";
import "./Search.css";

export default function Search() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    API.get("/api/products")
      .then(res => {
        const filtered = res.data.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [query]);

  return (
    <div className="search-page">

      <h2 className="search-title">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <div className="search-loading">
          Loading...
        </div>
      ) : products.length > 0 ? (
        <div className="search-grid">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <h3>No products found</h3>
          <p>Try searching with a different keyword.</p>
        </div>
      )}

    </div>
  );
}