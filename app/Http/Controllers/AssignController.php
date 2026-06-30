<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignController extends Controller
{
    public function index()
    {

        $orderList = DB::table('orders')
            ->where('status', 'Pending')
            ->whereNotIn('id', function ($query) {
                $query->select('order_id')
                    ->from('assignments');
            })
            ->orderBy('created_at', 'asc')
            ->get();

        $employeeList = DB::table('users')
            ->where('role', 'produksi')
            ->orderByDesc('id')
            ->get();

        $orderHistory = DB::table('assignments as a')
            ->join('orders as o', 'a.order_id', '=', 'o.id')
            ->join('users as u', 'a.user_id', '=', 'u.id')
            ->select(
                'a.id',
                'o.kode_order',
                'o.jenis_produk',
                'o.status',
                'o.deadline',
                'u.nama as nama_pegawai',
                'a.assigned_at'
            )
            ->where('status','!=','Deleted')
            ->orderByDesc('a.assigned_at')
            ->get();


        return Inertia::render('Owner/Assign', [
            'orderList' => $orderList,
            'employeeList' => $employeeList,
            'orderHistory' => $orderHistory,
        ]);
    }
    public function assign(Request $request)
    {
        $order = DB::table('orders')
        ->where('id', $request->orderId)
        ->first();
        $request->validate([
            'orderId' => 'required',
            'employee' => 'required',
        ]);
        DB::table('assignments')->insert([
            'order_id' => $request->orderId,
            'user_id' => $request->employee,
            'assigned_at' => now(),
        ]);
        DB::table('notifications')->insert(([
            'user_id' => $request->employee,
            'pesan' => "Tugas Baru: Kerjakan Order {$order->kode_order} ({$order->jenis_produk})",
            'created_at'=>now(),
        ]));
        return back();
    }
}
