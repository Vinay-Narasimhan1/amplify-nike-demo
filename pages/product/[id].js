import products from "../../data/products";

export async function getStaticPaths() {
  return {
    paths: products.map((p) => ({ params: { id: String(p.id) } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => String(p.id) === params.id) || null;
  return { props: { product } };
}

export default function ProductPage({ product }) {
  if (!product) return <main className="p-8">Not found</main>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow" />
          {product.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {product.images.slice(1).map((src, i) => (
                <img key={i} src={src} alt={`${product.name} ${i+2}`} className="w-full h-32 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.category}</p>
          <p className="text-2xl font-semibold mt-4">${product.price}</p>
          <p className="mt-6 text-gray-800">{product.description}</p>
          <button className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
