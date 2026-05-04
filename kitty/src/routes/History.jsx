import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Edit2, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const History = () => {
  const [contributions, setContributions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [contRes, membRes] = await Promise.all([
      supabase
        .from("contributions")
        .select(`
          *,
          members (name)
        `)
        .order("date", { ascending: false }),
      supabase.from("members").select("*")
    ]);

    if (contRes.error) toast.error("Error fetching history");
    else setContributions(contRes.data);
    
    if (membRes.error) toast.error("Error fetching members");
    else setMembers(membRes.data);
    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    
    const { error } = await supabase.from("contributions").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Deleted");
      setContributions(prev => prev.filter(c => c.id !== id));
    }
  };

  const openEditModal = (item) => {
    setEditingItem({
      ...item,
      amount: item.amount.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("contributions")
      .update({
        member_id: editingItem.member_id,
        amount: parseFloat(editingItem.amount),
        date: editingItem.date
      })
      .eq("id", editingItem.id);

    if (error) toast.error("Failed to update");
    else {
      toast.success("Updated");
      setIsEditModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const filteredHistory = contributions.filter(c => 
    c.members?.name.toLowerCase().includes(search.toLowerCase()) ||
    c.amount.toString().includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gradient">History</h1>
          <p className="text-sm text-muted-foreground font-medium">Review and manage all contributions</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <Input 
            placeholder="Search transactions..." 
            className="pl-12 h-14 bg-card/40 border-none shadow-inner text-lg" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[2rem] overflow-hidden glass-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
              <TableHead className="h-16 px-8 font-black text-xs uppercase tracking-[0.2em]">Member</TableHead>
              <TableHead className="h-16 font-black text-xs uppercase tracking-[0.2em]">Amount</TableHead>
              <TableHead className="h-16 font-black text-xs uppercase tracking-[0.2em]">Date</TableHead>
              <TableHead className="h-16 px-8 text-right font-black text-xs uppercase tracking-[0.2em]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32">
                  <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                </TableCell>
              </TableRow>
            ) : filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32 text-muted-foreground font-bold italic">
                  No records found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-primary/[0.02] border-border/30 transition-all duration-300">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {item.members?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-black text-lg">{item.members?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-xl text-primary tracking-tighter">
                      ${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-bold text-sm">
                    {format(new Date(item.date), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={() => openEditModal(item)}>
                        <Edit2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Contribution"
      >
        {editingItem && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Member</label>
              <Select 
                value={editingItem.member_id}
                onChange={(e) => setEditingItem({...editingItem, member_id: e.target.value})}
                options={members.map(m => ({ label: m.name, value: m.id }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input 
                type="number" 
                step="0.01" 
                value={editingItem.amount}
                onChange={(e) => setEditingItem({...editingItem, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={editingItem.date}
                onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={20} /> : "Update Record"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default History;
