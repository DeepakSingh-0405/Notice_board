// BuyPage.jsx
import { databases, storage } from "../lib/appwrite";
import { useEffect, useState } from "react";
import { config } from "../lib/appwrite";

const DATABASE_ID = config.dbId;
const MARKETPLACE_COLLECTION_ID = config.marketplace_collection;
const BUCKET_ID = config.bucketId;

export default function BuyPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, MARKETPLACE_COLLECTION_ID);
      setItems(res.documents);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-900 min-h-screen">
      {/* Page Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-14 text-white tracking-tight">
        🛍️ Marketplace
      </h1>

      {/* Empty State */}
      {items.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No items available right now.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const fileId = item.imageFileId || item.imagefileId;
            const imageUrl = fileId ? storage.getFileView(BUCKET_ID, fileId) : null;

            return (
              <div
                key={item.$id}
                className="group bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                {/* Product Image */}
                {imageUrl && (
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-green-400 font-bold mt-4 text-xl">
                    ₹{item.price}
                  </p>

                  {/* Buy Button */}
                  <button className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2.5 rounded-xl shadow hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                  onClick={()=> alert(`You buyed ${item.title}`)}>
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
