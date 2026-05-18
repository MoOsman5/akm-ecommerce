'use client';
import { useEffect, useState } from 'react';
import { FiUserCheck, FiUserX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { usersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { load(); }, [page]);

  async function load() {
    setLoading(true);
    const { data } = await usersAPI.getAll({ page, limit: 20 });
    setUsers(data.users); setTotalPages(data.totalPages); setLoading(false);
  }

  async function toggleBlock(id: string) {
    await usersAPI.toggleBlock(id);
    toast.success('User status updated');
    load();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 border-b border-dark-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Phone</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Joined</th>
              <th className="text-right px-4 py-3 font-semibold text-dark-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-dark-50 hover:bg-dark-50/50">
                <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-dark-500">{u.email}</td>
                <td className="px-4 py-3 text-dark-500">{u.phone || '—'}</td>
                <td className="px-4 py-3"><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-neutral'}`}>{u.role}</span></td>
                <td className="px-4 py-3">{u.isBlocked ? <span className="badge badge-danger">Blocked</span> : <span className="badge badge-success">Active</span>}</td>
                <td className="px-4 py-3 text-dark-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleBlock(u._id)} className={`p-2 ${u.isBlocked ? 'text-green-500 hover:text-green-700' : 'text-red-400 hover:text-red-600'}`} title={u.isBlocked ? 'Unblock' : 'Block'}>
                    {u.isBlocked ? <FiUserCheck size={16} /> : <FiUserX size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 p-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${page === p ? 'bg-dark-900 text-white' : 'bg-dark-50'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
