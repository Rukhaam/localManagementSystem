import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import usePagination from "../../hooks/usePagination"; // 🌟 Import hook
import { fetchCategories } from "../../redux/slices/exploreSlice";
import { createCategory, deleteCategory, clearAdminMessages } from "../../redux/slices/adminSlice";

export default function ManagerCategories() {
  const dispatch = useDispatch();
  
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.explore);
  const { isLoading: adminLoading, error: adminError, successMessage } = useSelector((state) => state.admin);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
    return () => dispatch(clearAdminMessages());
  }, [dispatch, categories.length]);

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

  // 🌟 PAGINATION HOOK (5 per page)
  const { next, prev, currentData, currentPage, maxPage } = usePagination(categories, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>

      {adminError && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">{adminError}</div>}
      {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200">{successMessage}</div>}

      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        {/* ... Keep your existing Add Category Form ... */}
        <h2 className="text-xl font-bold mb-6">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Category Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" placeholder="Short Description" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" disabled={adminLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {adminLoading ? "Adding..." : "Create Category"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Description</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categoriesLoading ? (
              <tr><td colSpan="3" className="px-6 py-12 text-center text-blue-600 font-bold animate-pulse">Loading categories...</td></tr>
            ) : currentData().length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500 bg-gray-50">No categories found.</td></tr>
            ) : (
              // 🌟 MAPPED PAGINATED CATEGORIES
              currentData().map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(cat.id)} disabled={adminLoading} className="text-red-600 hover:text-red-800 text-sm font-bold disabled:opacity-50 transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* 🌟 CATEGORY PAGINATION CONTROLS */}
        {maxPage > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <span className="text-sm text-gray-700">Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{maxPage}</span></span>
            <div className="flex space-x-2">
              <button onClick={prev} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Previous</button>
              <button onClick={next} disabled={currentPage === maxPage} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}