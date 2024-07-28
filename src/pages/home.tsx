import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";

const Home = () => {
  const addToCart = () => {};
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findMore">
          More
        </Link>
      </h1>

      <main>
        {Array.from({ length: 10 }, (_, i) => (
          <ProductCard
            id={"kdjfak"}
            photo={
              "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
            }
            name={"Mac Air 3"}
            price={210000}
            stock={200}
            handler={addToCart}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;
