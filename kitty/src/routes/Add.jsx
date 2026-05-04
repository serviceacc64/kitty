import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Add = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Failed to fetch members");
    } else {
      setMembers(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, member_id: data[0].id }));
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.member_id || !formData.amount || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from("contributions")
      .insert([{
        member_id: formData.member_id,
        amount: parseFloat(formData.amount),
        date: formData.date
      }]);

    if (error) {
      toast.error("Error saving contribution");
    } else {
      toast.success("Contribution recorded!");
      navigate("/");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Record Contribution</h1>
      </div>

      <Card className="glass shadow-elegant border-primary/10">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Contributor</label>
              <Select
                value={formData.member_id}
                onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                options={members.map(m => ({ label: m.name, value: m.id }))}
              />
              {members.length === 0 && (
                <p className="text-xs text-red-500">
                  No members yet. <Button variant="link" size="sm" onClick={() => navigate("/members")} className="h-auto p-0">Add some first</Button>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg" variant="rainbow" disabled={submitting || members.length === 0}>
              {submitting ? <Loader2 className="animate-spin" size={20} /> : "Save Contribution"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Add;
