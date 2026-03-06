import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProviders } from "../../redux/slices/adminSlice";
import { fetchCategories } from "../../redux/slices/exploreSlice";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { providers } = useSelector((state) => state.admin);
  const { categories } = useSelector((state) => state.explore);

  useEffect(() => {
    dispatch(fetchAllProviders());
    dispatch(fetchCategories());
  }, [dispatch]);

  const pendingApprovals = providers.filter(p => !p.is_approved).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Command Center</h1>
        <p className="text-gray-500 mt-2">Oversee providers, categories, and platform health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/approve-providers" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 uppercase">Pending Approvals</div>
          <div className="text-4xl font-extrabold text-amber-600">{pendingApprovals}</div>
        </Link>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm font-medium text-gray-500 uppercase">Total Providers</div>
          <div className="text-4xl font-extrabold text-blue-600">{providers.length}</div>
        </div>
        <Link to="/admin/categories" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 uppercase">Active Categories</div>
          <div className="text-4xl font-extrabold text-green-600">{categories.length}</div>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-800">Quick Actions</h3>
          <p className="text-blue-600">Common administrative tasks you can perform.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/categories" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">Add New Category</Link>
          <Link to="/admin/approve-providers" className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold border border-blue-200 hover:bg-blue-50">Review Providers</Link>
        </div>
      </div>
    </div>
  );
}