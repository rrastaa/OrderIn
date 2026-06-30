import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Task({
    active_tasks,
    completed_tasks,
    my_tasks,
    notifications,
    flash,
    timeline,
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

    const statusStyle = {
        Pending: {
            dot: "bg-yellow-100 text-yellow-700 border-yellow-200",
            line: "bg-yellow-300",
        },
        Cutting: {
            dot: "bg-blue-100 text-blue-700 border-blue-200",
            line: "bg-blue-300",
        },
        Sablon: {
            dot: "bg-purple-100 text-purple-700 border-purple-200",
            line: "bg-purple-300",
        },
        Jahit: {
            dot: "bg-orange-100 text-orange-700 border-orange-200",
            line: "bg-orange-300",
        },
        QC: {
            dot: "bg-pink-100 text-pink-700 border-pink-200",
            line: "bg-pink-300",
        },
        Dikirim: {
            dot: "bg-emerald-100 text-emerald-700 border-emerald-200",
            line: "bg-emerald-300",
        },
        Selesai: {
            dot: "bg-green-100 text-green-700 border-green-200",
            line: "bg-green-300",
        },
    };
    const updateStatus = (e, orderId) => {
        e.preventDefault();

        const status = e.target.status.value;

        router.post(route("produksi.update"), {
            orderId: orderId,
            status,
        });
        showToast(
            "success",
            "Status berhasil diubah!",
            "Status pesanan telah terubah."
        );
    };

    const logout = () => {
        router.post("/logout");
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
            <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-4 mb-6">
                    <a href={route("produksi.dashboard")}>
                        <div className="text-xl font-bold tracking-tight text-gray-900 flex flex-col">
                            OrdeRin{" "}
                            <span className="text-xs font-normal text-gray-500">
                                {" "}
                                Produksi
                            </span>
                        </div>
                    </a>
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

                {/* Table */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-white">
                            <h2 className="text-base font-bold text-gray-900">
                                Timeline Produksi
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Ringkasan jumlah order berdasarkan progress
                                produksi.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="grid w-full grid-cols-7 items-start">
                                {timeline.map((item, index) => {
                                    const style = statusStyle[item.status] ?? {
                                        dot: "bg-gray-100 text-gray-700 border-gray-200",
                                        line: "bg-gray-300",
                                    };

                                    return (
                                        <div
                                            key={item.status}
                                            className="relative flex flex-col items-center"
                                        >
                                            {/* garis belakang */}
                                            {index !== timeline.length - 1 && (
                                                <div
                                                    className={`
                                absolute top-7 left-1/2 w-full h-[4px] rounded-full
                                ${item.total > 0 ? style.line : "bg-gray-200"}
                            `}
                                                />
                                            )}

                                            {/* bulatan */}
                                            <div
                                                className={`
                            relative z-10 w-14 h-14 rounded-full border flex items-center justify-center
                            text-lg font-black shadow-sm bg-white
                            ${
                                item.total > 0
                                    ? style.dot
                                    : "bg-gray-50 text-gray-400 border-gray-200"
                            }
                        `}
                                            >
                                                {item.total}
                                            </div>

                                            <div className="mt-3 text-center">
                                                <p className="text-xs font-bold text-gray-800 tracking-wide">
                                                    {item.status}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
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
                                            <th className="p-4 font-bold text-center">
                                                Info Order
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Jumlah
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Deadline
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Terakhir Diubah
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Status Sekarang
                                            </th>
                                            <th className="p-4 font-bold text-center">
                                                Aksi
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
                                                    <td className="p-4 text-xs font-medium text-gray-600 text-center">
                                                        {task.last_updated
                                                            ? task.last_updated
                                                            : "-"}
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

                                                    <td className="p-4 text-center">
                                                        {task.status !==
                                                            "Selesai" &&
                                                        task.status !==
                                                            "Dikirim" &&
                                                        task.status !==
                                                            "Deleted" ? (
                                                            <form
                                                                onSubmit={(e) =>
                                                                    updateStatus(
                                                                        e,
                                                                        task.id
                                                                    )
                                                                }
                                                                className="flex items-center gap-1.5 justify-center"
                                                            >
                                                                <select
                                                                    name="status"
                                                                    required
                                                                    defaultValue=""
                                                                    className="px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        -- Ubah
                                                                        Progress
                                                                        --
                                                                    </option>
                                                                    <option
                                                                        value="Cutting"
                                                                        disabled={
                                                                            task.status ===
                                                                            "Cutting"
                                                                        }
                                                                    >
                                                                        Cutting
                                                                    </option>
                                                                    <option
                                                                        value="Sablon"
                                                                        disabled={
                                                                            task.status ===
                                                                            "Sablon"
                                                                        }
                                                                    >
                                                                        Sablon
                                                                    </option>
                                                                    <option
                                                                        value="Jahit"
                                                                        disabled={
                                                                            task.status ===
                                                                            "Jahit"
                                                                        }
                                                                    >
                                                                        Jahit
                                                                    </option>
                                                                    <option
                                                                        value="QC"
                                                                        disabled={
                                                                            task.status ===
                                                                            "QC"
                                                                        }
                                                                    >
                                                                        QC
                                                                    </option>
                                                                    <option value="Selesai">
                                                                        Selesai
                                                                    </option>
                                                                </select>

                                                                <button
                                                                    type="submit"
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                                                                >
                                                                    Simpan
                                                                </button>
                                                            </form>
                                                        ) : (
                                                            <div className="text-center text-xs text-gray-400 font-semibold">
                                                                Terkunci
                                                            </div>
                                                        )}
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
                        {toast.type === "delete"
                            ? "✓"
                            : toast.type === "edit"
                            ? "✎"
                            : "✓"}
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
        </div>
    );
}
