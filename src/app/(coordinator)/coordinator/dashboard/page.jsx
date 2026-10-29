"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import {
  parseAvailableDates,
  getTourTimeStatus,
  getTourStatusBadgeClass,
  formatTourDate,
} from "@/lib/tourStatus";

export default function CoordinatorDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState({
    totalTours: 0,
    activeBookings: 0,
    totalRevenue: 0,
    avgRating: 0,
  });

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const [statsRes, toursRes] = await Promise.allSettled([
          api.get("auth/coordinator/stats"),
          api.get("tours/my-tours"),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value?.data) {
          const data = statsRes.value.data;
          setStats({
            totalTours: data.totalTours || 0,
            activeBookings: data.totalActiveBookings || 0,
            totalRevenue: Number(data.totalRevenue || 0),
            avgRating: data.averageRating || 0,
          });
        }

        if (toursRes.status === "fulfilled" && Array.isArray(toursRes.value?.data)) {
          setTours(toursRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load coordinator dashboard data", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Real-time breakdown of tour statuses
  const tourCounts = useMemo(() => {
    const counts = {
      total: tours.length,
      upcoming: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
    };

    tours.forEach((t) => {
      const status = getTourTimeStatus(t);
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  }, [tours]);

  const statsCards = [
    {
      title: "Total Tours",
      value: stats.totalTours || tours.length,
      sub: "Your published tours",
      icon: FaMapMarkerAlt,
      iconBg: "bg-blue-400",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      sub: "Ongoing bookings",
      icon: FaCalendarAlt,
      iconBg: "bg-green-450",
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      sub: "All confirmed payments",
      icon: FaMoneyBillWave,
      iconBg: "bg-pink-400",
    },
    {
      title: "Customer Reviews",
      value: stats.avgRating,
      sub: "Average rating",
      icon: FaStar,
      iconBg: "bg-yellow-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-150">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Welcome back to your coordinator portal</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsCards.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Card key={idx} className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
                  <CardContent className="p-5 flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">
                        {s.title}
                      </span>
                      <span className="text-gray-900 font-extrabold text-2xl leading-none block">
                        {s.value}
                      </span>
                      <span className="text-gray-400 text-[11px] font-medium block">
                        {s.sub}
                      </span>
                    </div>

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${s.iconBg}`}>
                      <Icon size={18} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tour Status Breakdown Summary */}
          {tours.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-yellow-50/70 border border-yellow-100 rounded-xl">
                <span className="text-xs font-semibold text-yellow-700 block">Upcoming Tours</span>
                <span className="text-xl font-extrabold text-yellow-800 mt-1 block">{tourCounts.upcoming}</span>
              </div>
              <div className="p-3.5 bg-green-50/70 border border-green-100 rounded-xl">
                <span className="text-xs font-semibold text-green-700 block">Ongoing Tours</span>
                <span className="text-xl font-extrabold text-green-800 mt-1 block">{tourCounts.ongoing}</span>
              </div>
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                <span className="text-xs font-semibold text-blue-700 block">Completed Tours</span>
                <span className="text-xl font-extrabold text-blue-800 mt-1 block">{tourCounts.completed}</span>
              </div>
              <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-xl">
                <span className="text-xs font-semibold text-red-650 block">Cancelled Tours</span>
                <span className="text-xl font-extrabold text-red-700 mt-1 block">{tourCounts.cancelled}</span>
              </div>
            </div>
          )}

          {/* Recent Tour Packages Table */}
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Recent Tour Packages</h3>
                <p className="text-gray-400 text-xs mt-0.5">Live status of your listed tours</p>
              </div>
              <Link href="/coordinator/tours">
                <Button size="sm" variant="outline" className="text-xs font-bold gap-1 rounded-xl cursor-pointer">
                  Manage Tours <FaArrowRight size={11} />
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700">
                  <tr>
                    <th className="p-4">Tour Package</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4 text-center">Rate & Slots</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {tours.slice(0, 5).map((t) => {
                    const tourStatus = getTourTimeStatus(t);
                    const dates = parseAvailableDates(t.availableDates);
                    return (
                      <tr key={t._id || t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-gray-900 text-sm">{t.title}</p>
                          <span className="text-[10px] text-primary font-bold">{t.category}</span>
                        </td>
                        <td className="p-4 text-gray-600 max-w-[200px] truncate">{t.address || "—"}</td>
                        <td className="p-4 text-gray-700">
                          {dates.length > 0
                            ? `${formatTourDate(dates[0].start)} – ${formatTourDate(dates[0].end)}`
                            : "—"}
                        </td>
                        <td className="p-4 text-center text-gray-700 font-semibold">
                          ₱{Number(t.joinerPrice || 0).toLocaleString()} ({t.joinerMaxSlots || 0} slots)
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTourStatusBadgeClass(
                              tourStatus
                            )}`}
                          >
                            {tourStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {tours.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                        No tour packages listed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
