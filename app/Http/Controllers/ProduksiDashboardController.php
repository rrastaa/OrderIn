<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
class ProduksiDashboardController extends Controller
{
    public function index()
    {
        $user_id = auth()->id();

        $active_tasks = DB::table('assignments as a')
            ->join('orders as o', 'a.order_id', '=', 'o.id')
            ->where('a.user_id', $user_id)
            ->whereNotIn('o.status', ['Selesai', 'Dikirim', 'Deleted'])
            ->count();

        $completed_tasks = DB::table('assignments as a')
            ->join('orders as o', 'a.order_id', '=', 'o.id')
            ->where('a.user_id', $user_id)
            ->whereIn('o.status', ['Selesai', 'Dikirim'])
            ->count();

            $latestLogs = DB::table('progress_logs')
            ->select('order_id', DB::raw('MAX(created_at) as last_updated'))
            ->groupBy('order_id');

        $my_tasks = DB::table('assignments as a')
            ->join('orders as o', 'a.order_id', '=', 'o.id')
            ->leftJoinSub($latestLogs, 'pl_latest', function ($join) {
                $join->on('o.id', '=', 'pl_latest.order_id');
            })
            ->leftJoin('progress_logs as pl', function ($join) {
                $join->on('pl.order_id', '=', 'pl_latest.order_id')
                    ->on('pl.created_at', '=', 'pl_latest.last_updated');
            })
            ->leftJoin('users as u', 'pl.user_id', '=', 'u.id')
            ->where('a.user_id', $user_id)
            ->select(
                'o.id',
                'o.kode_order',
                'o.jenis_produk',
                'o.jumlah',
                'o.deadline',
                'o.status',
                'pl.created_at as last_updated',
                'pl.status as last_status',
                'pl.catatan as last_note',
                'u.nama as updated_by'
            )
            ->orderByRaw("
                FIELD(o.status, 'Pending','Cutting','Sablon','Jahit','QC','Dikirim','Selesai','Deleted')
            ")
            ->orderBy('o.deadline')
            ->get()
            ->take(4);

        $notifications = DB::table('notifications')
            ->where('user_id', $user_id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Produksi/Dashboard', [
            'active_tasks' => $active_tasks,
            'completed_tasks' => $completed_tasks,
            'my_tasks' => $my_tasks,
            'notifications' => $notifications,
        ]);
    }

    
}