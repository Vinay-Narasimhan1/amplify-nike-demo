import products from "../../data/products";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

// Tell Next.js which product pages to build
export async function getStaticPaths() {
  return {
    paths: products.map((p) => ({ params: { id: String(p.id) } })),
    fallback: false,
  };
}

// Provide product data for each page
export async function getStaticProps({ params }) {
  const product = products.find((p) => String(p.id) === params.id) || null;
  return { props: { product } };
}

// Product detail page
export default function ProductPage({ product }) {
  const { addToCart } = useCart();

  if (!product) {
    return <main className="p-8">Product not found.</main>;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side: main + alt images */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow"
          />
          {product.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {product.images.slice(1).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} alt ${i + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right side: product info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.category}</p>
          <p className="text-2xl font-semibold mt-4">${product.price}</p>
          <p className="mt-6 text-gray-800">{product.description}</p>

          {/* Add to Cart button */}
          <button
            className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart!`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}

