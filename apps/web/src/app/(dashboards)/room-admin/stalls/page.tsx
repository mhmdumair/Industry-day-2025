"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Edit } from "lucide-react";
import api from "../../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------- types ---------- */
interface Stall {
  stallID: string;
  title: string;
  companyID: string;
  preference: string;
  company?: { companyName: string };
}

interface Company {
  companyID: string;
  companyName: string;
}

enum Preference {
  BT = "BT",
  ZL = "ZL",
  CH = "CH",
  MT = "MT",
  BMS = "BMS",
  ST = "ST",
  GL = "GL",
  CS = "CS",
  DS = "DS",
  ML = "ML",
  CM = "CM",
  ES = "ES",
  MB = "MB",
  PH = "PH",
  ALL = "ALL",
}

const StallsGroupCard = () => {
  /* ---------- state ---------- */
  const [room, setRoom] = useState<{
    roomID: string;
    roomName: string;
    location: string;
  }>();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  /* dialog state */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [newCompanyID, setNewCompanyID] = useState<string>();
  const [newTitle, setNewTitle] = useState("");
  const [newPreference, setNewPreference] = useState<Preference>(Preference.ALL);
  const [creating, setCreating] = useState(false);

  /* ---------- initial load ---------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomAdminID = params.get("roomAdminId");
    if (!roomAdminID) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const ra = (await api.get(`/room-admin/${roomAdminID}`)).data;
        const r = ra.room;
        setRoom(r);

        const stallRes = (await api.get(`/stall/room/${r.roomID}`)).data as Stall[];

        const uniqueCompanyIDs = [...new Set(stallRes.map((s) => s.companyID))];
        const comps = await Promise.all(
          uniqueCompanyIDs.map((id) => api.get(`/company/${id}`).then((res) => res.data)),
        );
        const compMap: Record<string, Company> = {};
        comps.forEach((c: Company) => (compMap[c.companyID] = c));

        setStalls(stallRes.map((s) => ({ ...s, company: compMap[s.companyID] })));
        setCompanies(comps); // Set companies for the dropdown
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- actions ---------- */
  const handleRemove = async (stallID: string) => {
    if (window.confirm("Are you sure you want to delete this stall? This action cannot be undone.")) {
      try {
        await api.delete(`/stall/${stallID}`);
        setStalls((prev) => prev.filter((s) => s.stallID !== stallID));
      } catch (error) {
        console.error('Error deleting stall:', error);
        alert("Failed to delete stall. Please try again.");
      }
    }
  };

  const openCreateDialog = () => {
    setEditingStall(null);
    setNewCompanyID(undefined);
    setNewTitle("");
    setNewPreference(Preference.ALL);
    setDialogOpen(true);
  };

  const openEditDialog = (stall: Stall) => {
    setEditingStall(stall);
    setNewCompanyID(stall.companyID);
    setNewTitle(stall.title);
    setNewPreference(stall.preference as Preference);
    setDialogOpen(true);
  };

  const handleCreateStall = async () => {
    if (!room || !newCompanyID || !newTitle.trim()) return;
    setCreating(true);

    try {
      const dto = {
        roomID: room.roomID,
        companyID: newCompanyID,
        status: "active",
        title: newTitle,
        preference: newPreference,
      };
      
      const created = (await api.post("/stall", dto)).data as Stall;

      const comp =
        companies.find((c) => c.companyID === created.companyID) ??
        (await api.get(`/company/${created.companyID}`)).data;

      setStalls((prev) => [...prev, { ...created, company: comp }]);
      setDialogOpen(false);
      resetDialogState();
    } catch (error) {
      console.error('Error creating stall:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStall = async () => {
    if (!editingStall || !newCompanyID || !newTitle.trim()) return;
    setCreating(true);

    try {
      const dto = {
        companyID: newCompanyID,
        title: newTitle,
        preference: newPreference,
      };
      
      const updated = (await api.patch(`/stall/${editingStall.stallID}`, dto)).data as Stall;

      const comp =
        companies.find((c) => c.companyID === updated.companyID) ??
        (await api.get(`/company/${updated.companyID}`)).data;

      setStalls((prev) =>
        prev.map((s) =>
          s.stallID === editingStall.stallID
            ? { ...updated, company: comp }
            : s
        )
      );
      
      setDialogOpen(false);
      resetDialogState();
    } catch (error) {
      console.error('Error updating stall:', error);
    } finally {
      setCreating(false);
    }
  };

  const resetDialogState = () => {
    setEditingStall(null);
    setNewCompanyID(undefined);
    setNewTitle("");
    setNewPreference(Preference.ALL);
  };

  /* ---------- render ---------- */
  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="mt-3 mx-auto p-4">
      <Card className="bg-slate-100/80">
        <CardHeader>
          <CardTitle className="text-2xl">{room?.location || "Room"}</CardTitle>
          <CardDescription>{room?.roomName}</CardDescription>
        </CardHeader>

        <CardContent>
          {stalls.map((stall) => (
            <Card key={stall.stallID} className="relative mb-4">
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 p-1 bg-blue-100"
                  onClick={() => openEditDialog(stall)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 p-1 bg-red-400"
                  onClick={() => handleRemove(stall.stallID)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <CardHeader>
                <CardTitle>{stall.title}</CardTitle>
                <CardDescription>{stall.company?.companyName ?? stall.companyID}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs">Preference: {stall.preference}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <CardDescription>
            To add more interview stalls, contact the respective room admin
          </CardDescription>
          <Button onClick={openCreateDialog} variant="secondary" className="w-full mt-3">
            <Plus className="h-4 w-4 mr-2" />
            Add Stall
          </Button>
        </CardFooter>
      </Card>

      {/* ---------- dialog ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStall ? "Edit Stall" : "Create New Stall"}
            </DialogTitle>
            <DialogDescription>
              {editingStall ? "Update stall details" : "Select company, title, and preference"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* company dropdown */}
            <Select value={newCompanyID} onValueChange={(v) => setNewCompanyID(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.companyID} value={c.companyID}>
                    {c.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* title input */}
            <Input
              placeholder="Stall title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            {/* preference dropdown */}
            <Select
              value={newPreference}
              onValueChange={(v) => setNewPreference(v as Preference)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stream preference" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Preference).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              disabled={!newCompanyID || !newTitle.trim() || creating}
              onClick={editingStall ? handleUpdateStall : handleCreateStall}
            >
              {creating 
                ? (editingStall ? "Updating…" : "Creating…") 
                : (editingStall ? "Update Stall" : "Create Stall")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StallsGroupCard;