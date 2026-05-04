import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Loader2, TrendingUp, Users, Wallet, Trophy, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const Dashboard = () => {
  const [data, setData] = useState({ members: [], contributions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [membRes, contRes] = await Promise.all([
      supabase.from("members").select("*"),
      supabase.from("contributions").select("*")
    ]);

    if (membRes.error || contRes.error) {
      toast.error("Failed to load dashboard data");
    } else {
      setData({ members: membRes.data, contributions: contRes.data });
    }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const totalMoney = data.contributions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const memberStats = data.members.map(member => {
      const contributions = data.contributions.filter(c => c.member_id === member.id);
      const total = contributions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      return {
        ...member,
        total,
        count: contributions.length
      };
    }).sort((a, b) => b.total - a.total);

    const topContributor = memberStats[0] || null;

    return {
      totalMoney,
      memberCount: data.members.length,
      topContributor,
      memberStats
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      {/* Hero Section */}
      <section className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 transition-opacity group-hover:opacity-30 duration-700" />
        <div className="relative overflow-hidden rounded-[2rem] bg-hero p-10 md:p-14 text-white shadow-2xl border border-white/10">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70 font-bold tracking-[0.2em] uppercase text-xs">
                <TrendingUp size={14} />
                <span>Total Collection</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter flex items-baseline gap-2">
                <span className="text-3xl font-bold opacity-60">$</span>
                {stats.totalMoney.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center gap-1 border border-white/10 min-w-[120px] transition-transform hover:scale-105">
                <Users size={24} className="text-white/60" />
                <span className="text-2xl font-black">{stats.memberCount}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Members</span>
              </div>
              {stats.topContributor && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center gap-1 border border-white/10 min-w-[120px] transition-transform hover:scale-105">
                  <Trophy size={24} className="text-yellow-400" />
                  <span className="text-2xl font-black text-rainbow">{stats.topContributor.name.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/40">MVP</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </section>

      {/* Member Breakdown */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Wallet size={32} className="text-primary" />
              Contributors
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Tracking group expenses and balances</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.memberStats.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/30">
              <p className="text-muted-foreground font-bold italic">No contributors yet. Start by adding members!</p>
            </div>
          ) : (
            stats.memberStats.map((member, index) => (
              <Card key={member.id} className={cn(
                "glass-card group overflow-hidden border-none glow",
                index === 0 && "ring-2 ring-primary/20 bg-primary/[0.03]"
              )}>
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
                      index === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-xl group-hover:text-primary transition-colors">{member.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <PlusCircle size={12} />
                        <span>{member.count} Entries</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-3xl font-black text-primary tracking-tighter">
                      ${member.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    {index === 0 && (
                      <span className="inline-block px-3 py-1 rounded-full bg-rainbow text-[10px] font-black text-white uppercase tracking-tighter shadow-sm">
                        Leader
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};


export default Dashboard;
