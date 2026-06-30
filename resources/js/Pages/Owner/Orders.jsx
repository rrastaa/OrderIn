import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Orders({ orderList }) {
    const statusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-red-100 text-red-700";
            case "Cutting":
                return "bg-blue-100 text-blue-700";
            case "Sablon":
                return "bg-purple-100 text-purple-700";
            case "Jahit":
                return "bg-yellow-100 text-yellow-800";
            case "QC":
                return "bg-pink-100 text-pink-700";
            case "Selesai" || "Dikirim":
                return "bg-green-100 text-green-700";

            default:
                break;
        }
    };

    const addForm = useForm({
        nama_pelanggan: "",
        jenis_produk: "",
        jumlah: "",
        deadline: "",
    });

    const editForm = useForm({
        customer_id: "",
        nama_pelanggan: "",
        jenis_produk: "",
        jumlah: "",
        deadline: "",
    });

    const deleteForm = useForm({
        kode_order: "",
        customer_id: "",
        nama_pelanggan: "",
        jenis_produk: "",
        jumlah: "",
        deadline: "",
    });

    const [toast, setToast] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
    });

    const showToast = (type, title, message) => {
        setToast({
            show: true,
            type,
            title,
            message,
        });

        setTimeout(() => {
            setToast((prev) => ({
                ...prev,
                show: false,
            }));
        }, 2500);
    };

    const submit = (e) => {
        e.preventDefault();

        addForm.post(route("owner.orders.store"), {
            onSuccess: () => {
                addForm.reset();
                showToast(
                    "success",
                    "Order berhasil ditambahkan",
                    "Data pesanan telah tersimpan."
                );
            },
        });
    };

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const openEditModal = (order) => {
        setSelectedOrder(order);

        editForm.setData({
            customer_id: order.customer.id,
            nama_pelanggan: order.customer.nama,
            jenis_produk: order.jenis_produk,
            jumlah: order.jumlah,
            deadline: order.deadline,
        });

        setShowEditModal(true);
    };

    const openDeleteModal = (order) => {
        setSelectedOrder(order);

        deleteForm.setData({
            customer_id: order.customer.id,
            nama_pelanggan: order.customer.nama,
            jenis_produk: order.jenis_produk,
            jumlah: order.jumlah,
            deadline: order.deadline,
        });

        setShowDeleteModal(true);
    };

    const update = (e) => {
        e.preventDefault();

        editForm.post(route("owner.orders.update", selectedOrder.id), {
            onSuccess: () => {
                setShowEditModal(false);
                showToast(
                    "edit",
                    "Order berhasil diperbarui",
                    "Perubahan data pesanan telah disimpan."
                );
            },
        });
    };
    const del = (e) => {
        e.preventDefault();

        deleteForm.post(route("owner.orders.delete", selectedOrder.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                showToast(
                    "delete",
                    "Order berhasil dihapus",
                    "Data pesanan telah dipindahkan dari daftar aktif."
                );
            },
        });
    };

    const [search, setSearch] = useState("");

    const filteredOrders = orderList.filter((order) => {
        const keyword = search.toLowerCase();

        return (
            order.kode_order.toLowerCase().includes(keyword) ||
            order.jenis_produk.toLowerCase().includes(keyword) ||
            order.customer.nama.toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="bg-gray-50 p-4 md:p-8 min-h-screen font-sans text-gray-800">
            <div className="w-full max-w-[1400px] mx-auto">
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
                        Manajemen Order Baru
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Input Order Baru
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Sistem akan membuat kode unik otomatis untuk
                                    setiap pesanan masuk.
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Nama Pelanggan / Instansi
                                    </label>

                                    <input
                                        type="text"
                                        value={addForm.data.nama_pelanggan}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "nama_pelanggan",
                                                e.target.value
                                            )
                                        }
                                        required
                                        autoComplete="off"
                                        placeholder="Contoh: PT Maju Jaya / Budi"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    />

                                    {addForm.errors.nama_pelanggan && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {addForm.errors.nama_pelanggan}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Jenis Produk
                                    </label>

                                    <input
                                        type="text"
                                        value={addForm.data.jenis_produk}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "jenis_produk",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Contoh: Kaos Hitam Polos Premium"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Jumlah (Pcs)
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={addForm.data.jumlah}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "jumlah",
                                                e.target.value
                                            )
                                        }
                                        required
                                        placeholder="Contoh: 50"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Tanggal Deadline
                                    </label>

                                    <input
                                        type="date"
                                        value={addForm.data.deadline}
                                        onChange={(e) =>
                                            addForm.setData(
                                                "deadline",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
                                >
                                    Tambah Order
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="mb-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari Kode Order / Produk..."
                                className="w-full rounded-full bg-white shadow-sm border border-gray-200 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Daftar Keseluruhan Order
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Semua status order dari masuk hingga
                                    selesai.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Kode & Pelanggan
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Produk
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Jumlah & Batas
                                            </th>
                                            <th className="p-4 font-bold border-b border-gray-100">
                                                Status
                                            </th>
                                            <th className="p-4 font-bold text-center border-b border-gray-100">
                                                Aksi
                                            </th>
                                            <th className="p-4 font-bold text-center border-b border-gray-100">
                                                More
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                                                >
                                                    <td className="p-4">
                                                        <div className="font-bold text-blue-600">
                                                            {order.kode_order}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {
                                                                order.customer
                                                                    .nama
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-800 font-semibold">
                                                        {order.jenis_produk}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold">
                                                            {order.jumlah}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {order.deadline}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`${statusColor(
                                                                order.status
                                                            )} px-2.5 py-1 rounded-md text-[11px] font-bold uppercase`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {order.status ==
                                                        "Pending" ? (
                                                            <a
                                                                href={route(
                                                                    "owner.assign"
                                                                )}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                                                            >
                                                                <i className="fa-solid fa-user-plus text-[10px]"></i>{" "}
                                                                Assign Tim
                                                            </a>
                                                        ) : (
                                                            <span class="text-xs text-gray-400 font-medium">
                                                                <i class="fa-solid fa-check-double text-emerald-500 mr-1"></i>{" "}
                                                                Sudah Di-assign
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="">
                                                        <div className="flex flex-row justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        order
                                                                    )
                                                                }
                                                                className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-4"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        order
                                                                    )
                                                                }
                                                                className="bg-[#b81c1c] hover:bg-[#8f1717] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-4"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colspan="5"
                                                    className="p-8 text-center text-gray-400 font-medium"
                                                >
                                                    Belum ada data order masuk.
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
            <div
                className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 transform transition-all duration-500 ease-out ${
                    toast.show
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
            >
                <div
                    className={`relative flex items-center gap-3 overflow-hidden rounded-xl border px-5 py-3 shadow-xl backdrop-blur-sm ${
                        toast.type === "delete"
                            ? "border-emerald-200 bg-emerald-50"
                            : toast.type === "edit"
                            ? "border-blue-200 bg-blue-50"
                            : "border-emerald-200 bg-emerald-50"
                    }`}
                >
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                            toast.type === "delete"
                                ? "bg-emerald-500"
                                : toast.type === "edit"
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                        }`}
                    >
                        {toast.type === "delete" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        ) : toast.type === "edit" ? (
                            "✎"
                        ) : (
                            "✓"
                        )}
                    </div>

                    <div>
                        <p
                            className={`text-sm font-bold ${
                                toast.type === "delete"
                                    ? "text-emerald-800"
                                    : toast.type === "edit"
                                    ? "text-blue-800"
                                    : "text-emerald-800"
                            }`}
                        >
                            {toast.title}
                        </p>

                        <p
                            className={`text-xs ${
                                toast.type === "delete"
                                    ? "text-emerald-600"
                                    : toast.type === "edit"
                                    ? "text-blue-600"
                                    : "text-emerald-600"
                            }`}
                        >
                            {toast.message}
                        </p>
                    </div>
                </div>
            </div>
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Edit Order</h2>

                        <form onSubmit={update}>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                    Nama Pelanggan / Instansi
                                </label>
                                <input
                                    value={editForm.data.nama_pelanggan}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "nama_pelanggan",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    placeholder="Nama Pelanggan"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                    Jenis Produk
                                </label>
                                <input
                                    value={editForm.data.jenis_produk}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "jenis_produk",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    placeholder="Jenis Produk"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                    Jumlah (PCS)
                                </label>
                                <input
                                    type="number"
                                    value={editForm.data.jumlah}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "jumlah",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                    placeholder="Jumlah"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                    Tanggal Deadline
                                </label>
                                <input
                                    type="date"
                                    value={editForm.data.deadline}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "deadline",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold mb-4">
                            Delete Order?
                        </h2>

                        <form onSubmit={del}>
                            <div className="mb-4">
                                <label className="font-bold text-blue-600">
                                    {selectedOrder?.kode_order}
                                </label>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    {selectedOrder?.jenis_produk}
                                </label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={deleteForm.processing}
                                    className="px-4 py-2 bg-[#b81c1c] hover:bg-[#8f1717] text-white rounded-lg text-sm font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
