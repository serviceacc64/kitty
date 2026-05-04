import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/Table";
import { Trash2, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Failed to fetch members");
      console.error(error);
    } else {
      setMembers(data);
    }
    setLoading(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setAdding(true);
    const { error } = await supabase
      .from("members")
      .insert([{ name: newName.trim() }]);

    if (error) {
      toast.error("Error adding member");
    } else {
      toast.success("Member added!");
      setNewName("");
      fetchMembers();
    }
    setAdding(false);
  };

  const handleDeleteMember = async (id) => {
    if (!confirm("Are you sure? This will delete all their contributions too!")) return;

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting member");
    } else {
      toast.success("Member removed");
      fetchMembers();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-2 px-2">
        <h1 className="text-4xl font-black tracking-tight text-gradient">Manage Members</h1>
        <p className="text-sm text-muted-foreground font-medium">Build your circle of contributors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass-card border-none h-fit glow">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <UserPlus size={24} className="text-primary" />
              New Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-background/50 border-none h-14 font-bold text-lg"
              />
              <Button type="submit" className="w-full h-14 text-lg font-black" variant="rainbow" disabled={adding}>
                {adding ? <Loader2 className="animate-spin" size={24} /> : "Add to Kitty"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                <TableHead className="h-16 px-8 font-black text-xs uppercase tracking-[0.2em]">Contributor Name</TableHead>
                <TableHead className="h-16 px-8 text-right font-black text-xs uppercase tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-20 text-muted-foreground font-bold italic">
                    No members yet. Invite your friends!
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-primary/[0.02] border-border/30 transition-colors">
                    <TableCell className="px-8 py-5 font-black text-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};


export default Members;
