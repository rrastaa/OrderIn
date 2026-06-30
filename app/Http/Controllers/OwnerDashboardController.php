<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class OwnerDashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'owner') {
            abort('401');
        }
        $pendingList = DB::table('orders')
            ->where('status', 'Pending')
            ->orderByDesc('created_at')
            ->get();

        $orderList = DB::table('orders')
            ->where('status', '!=', 'Deleted')
            ->orderByDesc('created_at')
            ->get();


        $ordersInProduction = DB::table('orders')
            ->whereNotIn('status', ['Pending', 'Selesai', 'Dikirim'])
            ->count();

        $todayCompletedOrders = DB::table('orders')
            ->where('status', 'Selesai')
            ->whereDate('selesai', today())
            ->distinct('id')
            ->count('id');

        $completedTodayList = DB::table('orders')
            ->where('status', 'Selesai')
            ->whereDate('selesai', today())
            ->distinct('id')
            ->get();

        // dd($completedTodayList);

        $deadlineOrder = DB::table('orders')
            ->where('status', '!=', 'Selesai')
            ->select('jenis_produk', 'jumlah', DB::raw('DATEDIFF(deadline, CURDATE()) as days_left'))
            ->orderBy('deadline')
            ->first();

        $chart1Labels = [];
        $chart1Data = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);

            $chart1Labels[] = $date->format('M');

            $chart1Data[] = DB::table('orders')
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('jumlah');
        }

        $statuses = ['Pending', 'Cutting', 'Sablon', 'Jahit', 'QC', 'Selesai'];

        $chart2Data = collect($statuses)->map(function ($status) {
            return DB::table('orders')->where('status', $status)->count();
        });

        return Inertia::render('Owner/Dashboard', [
            'pendingList' => $pendingList,
            'orderList' => $orderList,
            'totalPendingOrders' => $pendingList->count(),
            'ordersInProduction' => $ordersInProduction,
            'todayCompletedOrders' => $todayCompletedOrders,
            'completedTodayList' => $completedTodayList,
            'deadlineOrder' => $deadlineOrder,
            'chart1Labels' => $chart1Labels,
            'chart1Data' => $chart1Data,
            'statuses' => $statuses,
            'chart2Data' => $chart2Data,
        ]);
    }
}