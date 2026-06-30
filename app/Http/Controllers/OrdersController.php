<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Customer;

class OrdersController extends Controller
{
    public function index()
    {
        if (Auth::user()->role!=='owner') {
            abort('401');
        }
        $orderList = Order::with('customer')
            ->where('status','!=','Deleted')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Owner/Orders', [
            'orderList' => $orderList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'jenis_produk' => 'required',
            'jumlah' => 'required|integer',
            'deadline' => 'required|date',
        ]);

        $format_tgl = date('ymd');
        $random_str = strtoupper(substr(uniqid(), -3));
        $kode_order = "ORD-" . $format_tgl . "-" . $random_str;



        $customer = Customer::where('nama', $request->nama_pelanggan)
            ->first();



        if (!$customer) {
            $customerId = DB::table('customers')->insertGetId([
                'nama' => $request->nama_pelanggan,
            ]);
        } else {
            $customerId = $customer->id;
        }

        DB::table('orders')->insert([
            'kode_order' => $kode_order,
            'customer_id' => $customerId,
            'jenis_produk' => $request->jenis_produk,
            'jumlah' => $request->jumlah,
            'status' => 'Pending',
            'deadline' => $request->deadline,
            'created_at' => now(),
        ]);


    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'jenis_produk' => 'required',
            'jumlah' => 'required|integer',
            'deadline' => 'required|date',
        ]);

        DB::table('orders')
        ->where('id',$request->id)
        ->update([
            // 'nama_pelanggan' => $request->nama_pelanggan,
            'jenis_produk' => $request->jenis_produk,
            'jumlah' => $request->jumlah,
            'deadline' => $request->deadline,
        ]);

    }

    public function delete(Request $request, $id)
    {   
        DB::table('orders')
        ->where('id',$request->id)
        ->update([
            'status'=>'Deleted',
        ]);

    }
}
