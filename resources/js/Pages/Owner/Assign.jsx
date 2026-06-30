import { useForm } from "@inertiajs/react";

export default function Assign({ orderList, employeeList, orderHistory }) {
    const { data, setData, post, processing, errors } = useForm({
        orderId: "",
        employee: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("owner.assign.assign"));
    };

    return (
        <div className="bg-gray-50 p-4 md:p-8 min-h-screen font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <a
                        href={route("owner.dashboard")}
                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm font-semibold text-sm flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-3 mr-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                        </svg>
                        Dashboard
                    </a>
                    <h1 className="text-2xl font-bold ml-6 text-gray-900">
                        Manajemen Tim Produksi
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Beri Tugas Baru
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih pesanan dan tugaskan ke pegawai
                                    produksi yang tersedia.
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Pilih Pesanan
                                    </label>
                                    <select
                                        name="order_id"
                                        required
                                        onChange={(e) =>
                                            setData("orderId", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    >
                                        <option value="" disabled selected>
                                            -- Pilih Order Aktif --
                                        </option>
                                        {orderList.map((order) => (
                                            <option value={order.id}>
                                                {order.kode_order}{" "}
                                                {order.jenis_produk}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Tugaskan Kepada
                                    </label>
                                    <select
                                        name="user_id"
                                        required
                                        onChange={(e) =>
                                            setData("employee", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    >
                                        <option value="" disabled selected>
                                            -- Pilih Pegawai --
                                        </option>
                                        {employeeList.map((emp) => (
                                            <option value={emp.id}>
                                                {emp.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    name="assign_team"
                                    disabled={processing}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
                                >
                                    <i className="fa-solid fa-paper-plane mr-2"></i>{" "}
                                    Assign Tugas
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Daftar Penugasan Aktif
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Riwayat pegawai yang ditugaskan
                                        mengerjakan order.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Order
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Produk
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Pegawai
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {orderHistory.length > 0 ? (
                                            orderHistory.map((order) => (
                                                <tr className="hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                                                    <td className="p-4">
                                                        <div className="font-bold text-blue-600">
                                                            {order.kode_order}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {order.deadline}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-800 font-medium">
                                                        {order.jenis_produk}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                                                {order.nama_pegawai.charAt(
                                                                    0
                                                                )}
                                                            </div>
                                                            <span className="font-semibold text-gray-700">
                                                                {
                                                                    order.nama_pegawai
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {order.status ==
                                                            "Selesai" ||
                                                        order.status ==
                                                            "Dikirim" ? (
                                                            <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                                {order.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colspan="4"
                                                    className="p-8 text-center text-gray-400"
                                                >
                                                    Belum ada data penugasan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
