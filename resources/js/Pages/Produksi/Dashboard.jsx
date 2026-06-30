import { router, usePage } from "@inertiajs/react";

export default function Dashboard({
    active_tasks,
    completed_tasks,
    my_tasks,
    notifications,
    flash,
}) {
    const { auth } = usePage().props;

    const badgeClass = (status) => {
        if (status === "Cutting") return "bg-blue-100 text-blue-700";
        if (status === "Sablon") return "bg-purple-100 text-purple-700";
        if (status === "Jahit") return "bg-yellow-100 text-yellow-800";
        if (status === "QC") return "bg-pink-100 text-pink-700";
        if (status === "Selesai" || status === "Dikirim")
            return "bg-green-100 text-green-700";
        return "bg-gray-100 text-gray-700";
    };

    const updateStatus = (e, orderId) => {
        e.preventDefault();

        const status = e.target.status.value;

        router.post(route("produksi.update"), {
            orderId: orderId,
            status,
        });
    };

    const logout = () => {
        router.post("/logout");
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
            <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-4 mb-6">
                    <div className="text-xl font-bold tracking-tight text-gray-900 flex flex-col">
                        OrdeRin{" "}
                        <span className="text-xs font-normal text-gray-500">
                            {" "}
                            Produksi
                        </span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                                {auth.user.nama?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <div className="text-xs font-bold text-gray-900">
                                    {auth.user.nama}
                                </div>
                                <div className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
                                    Tim Produksi
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="rounded-full border bg-white px-4 py-2 text-xs font-bold shadow-sm"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Flash Message */}
                {flash?.message && (
                    <div
                        className={`mb-6 px-4 py-3 rounded-xl shadow-sm text-sm font-semibold ${
                            flash.type === "success"
                                ? "bg-green-100 border border-green-400 text-green-700"
                                : "bg-red-100 border border-red-400 text-red-700"
                        }`}
                    >
                        {flash.message}
                    </div>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Tugas Sedang Dikerjakan
                            </div>
                            <div className="text-3xl font-black text-gray-900 mt-1">
                                {active_tasks}
                            </div>
                            <div className="text-xs text-orange-600 font-medium mt-0.5">
                                Butuh tindakan
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                            ✓
                        </div>
                    </div>

                    <div className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Tugas Selesai
                            </div>
                            <div className="text-3xl font-black text-gray-900 mt-1">
                                {completed_tasks}
                            </div>
                            <div className="text-xs text-green-600 font-medium mt-0.5">
                                Kerja bagus!
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                            ✓
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notifications */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm sticky top-6">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                Notifikasi Tugas Terbaru
                            </h2>

                            <div className="space-y-3">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-100 bg-gray-50 rounded-xl p-3.5"
                                        >
                                            <div className="text-xs text-gray-700 font-semibold leading-relaxed">
                                                {notif.pesan}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                                {new Date(
                                                    notif.created_at
                                                ).toLocaleString("id-ID")}{" "}
                                                WIB
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-xs text-gray-400 font-medium">
                                        Tidak ada notifikasi baru.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-white">
                                <h2 className="text-base font-bold text-gray-900">
                                    Daftar Tugas Produksi Anda
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Perbarui progress pengerjaan setiap kali ada
                                    perkembangan.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                            <th className="p-4 font-bold">
                                                Info Order
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Jumlah
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Deadline
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Status Sekarang
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Terakhir Diubah
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-sm">
                                        {my_tasks.length > 0 ? (
                                            my_tasks.map((task) => (
                                                <tr
                                                    key={task.id}
                                                    className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
                                                >
                                                    <td className="p-4">
                                                        <div className="font-bold text-blue-600">
                                                            {task.kode_order}
                                                        </div>
                                                        <div className="text-xs font-semibold text-gray-800 mt-0.5">
                                                            {task.jenis_produk}
                                                        </div>
                                                    </td>

                                                    <td className="p-4 font-bold text-gray-700 text-center">
                                                        {task.jumlah} pcs
                                                    </td>

                                                    <td className="p-4 text-xs font-medium text-gray-600 text-center">
                                                        {new Date(
                                                            task.deadline
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </td>

                                                    <td className="p-4 text-center">
                                                        <span
                                                            className={`${badgeClass(
                                                                task.status
                                                            )} px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </td>

                                                    <td className="p-4 text-xs font-medium text-gray-600 text-center">
                                                        {task.last_updated?task.last_updated:'-'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="p-8 text-center text-gray-400 font-medium"
                                                >
                                                    Belum ada tugas yang
                                                    di-assign oleh Admin untuk
                                                    Anda.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <a href={route('produksi.task')}>
                                <div className="p-2 border-b border-gray-100 bg-blue-600 rounded m-4">
                                    <h2 className="text-xs font-bold text-white text-center">
                                        Lihat Semua Tugas
                                    </h2>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
