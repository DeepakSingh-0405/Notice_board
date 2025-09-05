// Marketplace.jsx
import { ID } from "appwrite";
import { databases, storage, config } from "../lib/appwrite";
import { useAuth } from "../state/AuthContext";
import { useEffect, useState } from "react";

const DATABASE_ID = config.dbId;
const MARKETPLACE_COLLECTION_ID = config.marketplace_collection;
const BUCKET_ID = config.bucketId;

export default function Marketplace() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MARKETPLACE_COLLECTION_ID
      );
      setItems(response.documents);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let imageFileId = "";

      if (imageFile) {
        const uploaded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          imageFile
        );
        imageFileId = uploaded.$id;
      }

      await databases.createDocument(
        DATABASE_ID,
        MARKETPLACE_COLLECTION_ID,
        ID.unique(),
        {
          title,
          description,
          price: parseInt(price, 10),
          imageFileId,
          userId: user?.$id ?? "guest",
        }
      );

      alert("Item posted successfully 🎉");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      await fetchItems();
    } catch (error) {
      console.error("Error posting item:", error);
    }
  }

  async function handleDelete(id) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        MARKETPLACE_COLLECTION_ID,
        id
      );
      setItems((list) => list.filter((x) => x.$id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-white">
        Buy & Sell an Item
      </h1>

      {/* Post Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg rounded-2xl p-6 mb-12"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="mb-4 text-gray-300"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2.5 rounded-xl shadow hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 transition"
        >
          Post Item
        </button>
      </form>

      {/* Items List */}
      <h2 className="text-3xl font-bold text-center my-8 text-white">
        My Items
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((i) => i.userId === user?.$id)
          .map((item) => {
            const fileId = item.imageFileId || item.imagefileId;
            const imageUrl = fileId
              ? storage.getFileView(BUCKET_ID, fileId)
              : null;

            return (
              <div
                key={item.$id}
                className="bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-xl transition"
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-white truncate">
                  {item.title}
                </h3>
                <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                  {item.description}
                </p>
                <p className="text-green-400 font-bold mt-4 text-lg">
                  ₹{item.price}
                </p>

                <button
                  onClick={() => handleDelete(item.$id)}
                  className="mt-5 w-full bg-red-600 text-white py-2.5 rounded-xl shadow hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition"
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
