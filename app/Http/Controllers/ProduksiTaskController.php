<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProduksiTaskController extends Controller
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
            ->get();

        $statuses = ['Pending', 'Cutting', 'Sablon', 'Jahit', 'QC', 'Dikirim', 'Selesai'];

        $timeline = DB::table('orders')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->whereIn('status', $statuses)
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $timeline = collect($statuses)->map(function ($status) use ($timeline) {
            return [
                'status' => $status,
                'total' => $timeline[$status]->total ?? 0,
            ];
        });

        $notifications = DB::table('notifications')
            ->where('user_id', $user_id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // dd($my_tasks);
        return Inertia::render('Produksi/Task', [
            'active_tasks' => $active_tasks,
            'completed_tasks' => $completed_tasks,
            'my_tasks' => $my_tasks,
            'notifications' => $notifications,
            'timeline' => $timeline,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'orderId' => 'required|exists:orders,id',
            'status' => 'required',
        ]);

        DB::table('orders')
            ->where('id', $request->orderId)
            ->update([
                'status' => $request->status,
                'selesai' => $request->status == 'Selesai' ? now() : null,
            ]);

        DB::table('progress_logs')->insert([
            'order_id' => $request->orderId,
            'user_id' => auth()->id(),
            'status' => $request->status,
            'created_at' => now(),
        ]);

        return redirect()->back()->with([
            'message' => 'Status berhasil diperbarui.',
            'type' => 'success'
        ]);
    }
}
