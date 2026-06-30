import { router } from "@inertiajs/react";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({
    pendingList,
    orderList,
    totalPendingOrders,
    ordersInProduction,
    todayCompletedOrders,
    completedTodayList,
    deadlineOrder,
    chart1Labels,
    chart1Data,
    statuses,
    chart2Data,
}) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState("");

    const filteredOrders =
        orderList?.filter((order) => {
            const keyword = search.toLowerCase();

            return (
                order.kode_order?.toLowerCase().includes(keyword) ||
                order.jenis_produk?.toLowerCase().includes(keyword) ||
                order.status?.toLowerCase().includes(keyword) ||
                order.deadline?.toLowerCase().includes(keyword)
            );
        }) ?? [];

    const volumeOrderData = {
        labels: chart1Labels,
        datasets: [
            {
                label: "Total Pcs Dipesan",
                data: chart1Data,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const statusProduksiData = {
        labels: statuses,
        datasets: [
            {
                label: "Jumlah Project Order",
                data: chart2Data,
                backgroundColor: [
                    "#f59e0b",
                    "#3b82f6",
                    "#a855f7",
                    "#eab308",
                    "#ec4899",
                    "#10b981",
                ],
                borderRadius: 4,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Head title="Owner Dashboard" />

            <div className="mx-auto w-full max-w-[1400px] p-4 md:p-8">
                <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row">
                    <div className="text-xl font-bold text-gray-900 flex-1">
                        OrdeRin
                    </div>

                    <div className="flex flex-1 gap-4 justify-end">
                        <div className="relative w-full sm:max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari Kode Order / Produk..."
                                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />

                            {search && (
                                <div className="absolute left-0 right-0 top-11 z-50 max-h-80 overflow-y-auto rounded-xl border bg-white p-2 shadow-lg">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <a href={route("owner.orders")}>
                                                <div
                                                    key={order.id}
                                                    className="mb-2 flex justify-between rounded-lg border p-3 text-xs hover:bg-gray-50"
                                                >
                                                    <div className="flex flex-col">
                                                        <div className="font-bold text-blue-600 text-sm">
                                                            {order.kode_order}
                                                        </div>
                                                        <div>
                                                            {order.jenis_produk}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col text-end">
                                                        <div className="text-gray-500">
                                                            Status:{" "}
                                                            {order.status}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            Deadline:{" "}
                                                            {order.deadline}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-xs text-gray-400">
                                            Order tidak ditemukan.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="rounded-full border bg-white px-4 py-2 text-xs font-bold shadow-sm">
                                {auth?.user?.nama ?? "Owner"}
                            </div>
                            <button
                                type="button"
                                onClick={() => router.post(route("logout"))}
                                className="rounded-full border bg-white px-4 py-2 text-xs font-bold shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card
                        title="Pesanan Pending Baru"
                        value={totalPendingOrders}
                        color="text-amber-600"
                    />
                    <Card
                        title="Sedang Diproduksi"
                        value={ordersInProduction}
                        color="text-blue-600"
                    />
                    <Card
                        title="Selesai Hari Ini"
                        value={todayCompletedOrders}
                        color="text-green-600"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-xs font-bold">
                            Volume Pre-Order
                        </h2>
                        <div className="h-44">
                            <Line
                                data={volumeOrderData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="mb-3 text-xs font-bold">
                            Monitor Beban Kerja Divisi Produksi
                        </h2>
                        <div className="h-44">
                            <Bar
                                data={statusProduksiData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-bold">
                            Antrean Pesanan Pending
                        </h2>

                        <div className="space-y-2">
                            {pendingList.length > 0 ? (
                                pendingList.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-3"
                                    >
                                        <div>
                                            <div className="text-xs font-bold">
                                                {order.kode_order}
                                            </div>
                                            <div className="text-xs">
                                                {order.jenis_produk}
                                            </div>
                                            <div className="text-[10px] text-red-600">
                                                DL: {order.deadline}
                                            </div>
                                        </div>

                                        <div className="text-xs font-bold">
                                            {order.jumlah} Pcs
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed p-6 text-center text-xs text-gray-400">
                                    Tidak ada pesanan pending.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-bold">
                            Pesanan Selesai Hari Ini
                        </h2>

                        <div className="space-y-2">
                            {completedTodayList.length > 0 ? (
                                completedTodayList.map((order, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-xl border bg-gray-50 p-3"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-blue-600">
                                                {order.kode_order}
                                            </div>
                                            <div className="text-xs">
                                                {order.jenis_produk}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                Selesai jam {order.jam_selesai}{" "}
                                                WIB
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                                            {order.jumlah} Pcs
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed p-6 text-center text-xs text-gray-400">
                                    Belum ada order selesai hari ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="mb-3 text-xs font-bold">
                            Order Paling Mendesak
                        </div>

                        {deadlineOrder ? (
                            <div className="flex justify-between rounded-xl border p-3">
                                <div>
                                    <div className="text-xs font-bold">
                                        {deadlineOrder.jenis_produk}
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                        {deadlineOrder.jumlah} Pcs Order
                                    </div>
                                </div>

                                <div className="text-[10px] font-semibold">
                                    {deadlineOrder.days_left} Hari Lagi
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400">
                                Tidak ada order aktif
                            </div>
                        )}
                    </div>

                    <Link
                        href={route("owner.orders")}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
                    >
                        <div className="text-sm font-bold text-emerald-900">
                            Add & Manage Orders
                        </div>
                        <div className="text-[10px] text-emerald-600">
                            Input order baru dari pelanggan
                        </div>
                    </Link>

                    <Link
                        href={route("owner.assign")}
                        className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm"
                    >
                        <div className="text-sm font-bold text-blue-900">
                            Assign Team
                        </div>
                        <div className="text-[10px] text-blue-600">
                            Tugaskan order ke pegawai aktif (
                            {totalPendingOrders} pending)
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, color }) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
            <div>
                <div className="text-xs font-bold uppercase text-gray-500">
                    {title}
                </div>
                <div className={`mt-1 text-3xl font-black ${color}`}>
                    {value}
                </div>
            </div>
        </div>
    );
}
