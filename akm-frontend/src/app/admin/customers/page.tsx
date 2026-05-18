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
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Top Title HUD */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 dark:text-dark-500 font-mono text-xs uppercase tracking-wider font-bold">
          [ SYSTEM_ACCESS_LOGS // {users.length} SUBSCRIBERS ]
        </p>
      </div>

      {/* Grid Log Table */}
      <div className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-dark-50 dark:bg-dark-900/60 border-b border-dark-150 dark:border-dark-850/80 font-mono text-[9px] tracking-wider uppercase text-dark-500">
              <tr>
                <th className="text-left px-5 py-4 font-bold">Subscriber Identity</th>
                <th className="text-left px-5 py-4 font-bold">Secure Email Address</th>
                <th className="text-left px-5 py-4 font-bold">Phone Number</th>
                <th className="text-left px-5 py-4 font-bold">Access Role</th>
                <th className="text-left px-5 py-4 font-bold">Registry Status</th>
                <th className="text-left px-5 py-4 font-bold">Access Granted</th>
                <th className="text-right px-5 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-150 dark:divide-dark-850/60 font-mono text-dark-900 dark:text-white">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-dark-100/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 font-bold text-dark-900 dark:text-white uppercase tracking-wider">{u.firstName} {u.lastName}</td>
                  <td className="px-5 py-4 text-dark-500 dark:text-dark-400 lowercase">{u.email}</td>
                  <td className="px-5 py-4 text-dark-400 dark:text-dark-500 font-bold">{u.phone || '—'}</td>
                  <td className="px-5 py-4">
                    {u.role === 'admin' ? (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-blue-500/5 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]">ADMIN_SEC</span>
                    ) : (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-dark-100/40 dark:bg-white/[0.02] text-dark-400 dark:text-dark-500 border-dark-150 dark:border-dark-800">CLIENT</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {u.isBlocked ? (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-red-500/5 text-red-500 border-red-500/20">BLOCKED</span>
                    ) : (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]">ACTIVE</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-dark-400 dark:text-dark-500 uppercase tracking-widest text-[9px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => toggleBlock(u._id)} 
                        className={`p-2 transition-colors ${
                          u.isBlocked 
                            ? 'text-green-500 hover:text-green-400' 
                            : 'text-red-500 hover:text-red-400'
                        }`} 
                        title={u.isBlocked ? 'UNBLOCK_CLIENT' : 'BLOCK_CLIENT'}
                      >
                        {u.isBlocked ? <FiUserCheck size={15} /> : <FiUserX size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 p-5 border-t border-dark-150 dark:border-dark-850/80">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button 
                key={p} 
                onClick={() => setPage(p)} 
                className={`w-8 h-8 rounded-lg text-[10px] font-mono transition-all uppercase font-bold border ${
                  page === p 
                    ? 'bg-dark-900 dark:bg-white text-white dark:text-black border-transparent shadow-[0_0_10px_rgba(0,0,0,0.1)]' 
                    : 'bg-dark-50 dark:bg-dark-900 text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-850 border-dark-150 dark:border-dark-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
