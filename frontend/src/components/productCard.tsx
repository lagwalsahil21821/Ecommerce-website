import { FaPlus } from "react-icons/fa";
type ProductCardProps = {
  id: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};

const ProductCard = ({
  id,
  photo,
  name,
  price,
  stock,
  handler,
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={photo} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
