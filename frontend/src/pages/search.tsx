import { useState } from "react";
import ProductCard from "../components/productCard";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(75000);
  const [page, setPage] = useState(1);

  const addToCart = () => {}
  const isPrevPage = page>1;
  const isNextPage = page<4;
  return (
    <div className="product-search">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="desc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            value={maxPrice}
            min={100}
            max={100000}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          ></input>
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptos">Laptops</option>
            <option value="cameras">Cameras</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <div className="search-product-list">
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
        </div>
        <article>
          <button disabled ={!isPrevPage} onClick = {() => setPage(prev => prev-1)}>Prev</button>
          <span>{page} of {4}</span>
          <button disabled = {!isNextPage} onClick = {() => setPage(prev => prev+1)}>Next</button>
        </article>
      </main>
    </div>
  );
};

export default Search;
