import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/exploreSlice";
import { createCategory, deleteCategory, clearAdminMessages } from "../../redux/slices/adminSlice";

export default function ManagerCategories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.explore);
  const { isLoading, error, successMessage } = useSelector((state) => state.admin);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchCategories());
    return () => dispatch(clearAdminMessages());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCategory(newCategory)).then((res) => {
      if (!res.error) setNewCategory({ name: "", description: "" });
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This might affect providers in this category.")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>

      {/* ADD NEW CATEGORY FORM */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name (e.g. Painting)"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Name</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Description</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.description}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}