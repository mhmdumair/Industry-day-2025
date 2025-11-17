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
import api from "../../lib/axios";
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

interface RoomAdminResponse {
  room: {
    roomID: string;
    roomName: string;
    location: string;
  };
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

// Separate component that uses useSearchParams
function StallsContent() {
  const [room, setRoom] = useState<RoomAdminResponse['room']>();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [newCompanyID, setNewCompanyID] = useState<string>();
  const [newTitle, setNewTitle] = useState("");
  const [newPreference, setNewPreference] = useState<Preference>(Preference.ALL);
  const [creating, setCreating] = useState(false);

  /* ---------- initial load ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = (await api.get<RoomAdminResponse>(`/room-admin/by-user`)).data;
        const r = res.room;
        setRoom(r);

        const stallRes = (await api.get<Stall[]>(`/stall/room/${r.roomID}`)).data;

        const uniqueCompanyIDs = [...new Set(stallRes.map((s: Stall) => s.companyID))];

        const comps = await Promise.all(
          uniqueCompanyIDs.map(async (id) => {
            const res = await api.get<Company>(`/company/${id}`);
            return res.data;
          }),
        );
        
        const compMap: Record<string, Company> = {};
        comps.forEach((c: Company) => (compMap[c.companyID] = c));

        setStalls(stallRes.map((s: Stall) => ({ ...s, company: compMap[s.companyID] })));
        setCompanies(comps);
        setError(null);
      } catch (err) {
        console.error('Error loading stalls:', err);
        setError("Failed to load stalls. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // The dependency array is now empty, as we don't rely on URL params

  /* ---------- actions ---------- */
  const handleRemove = async (stallID: string) => {
    // Replaced window.confirm with a non-blocking message
    const confirmed = confirm("Are you sure you want to delete this stall? This action cannot be undone.");
    if (confirmed) {
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

      const created = (await api.post<Stall>("/stall", dto)).data;

      const comp =
        companies.find((c) => c.companyID === created.companyID) ??
        (await api.get<Company>(`/company/${created.companyID}`)).data;

      setStalls((prev) => [...prev, { ...created, company: comp }]);
      setDialogOpen(false);
      resetDialogState();
    } catch (error) {
      console.error('Error creating stall:', error);
      alert("Failed to create stall. Please try again.");
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

      const updated = (await api.patch<Stall>(`/stall/${editingStall.stallID}`, dto)).data;

      const comp =
        companies.find((c) => c.companyID === updated.companyID) ??
        (await api.get<Company>(`/company/${updated.companyID}`)).data;

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
      alert("Failed to update stall. Please try again.");
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
  if (loading) return <p className="p-4 dark:text-gray-200">Loading…</p>;
  if (error) return <p className="p-4 text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="mt-3 mx-auto p-4 w-1/2">
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">{room?.location || "Room"}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{room?.roomName}</CardDescription>
        </CardHeader>
        <CardContent>
          {stalls.map((stall) => (
            <Card key={stall.stallID} className="relative mb-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-none">
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 p-1 border-gray-500 rounded-none"
                  onClick={() => openEditDialog(stall)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 p-1 bg-red-400 dark:bg-red-600 rounded-none"
                  onClick={() => handleRemove(stall.stallID)}
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{stall.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{stall.company?.companyName ?? stall.companyID}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-700 dark:text-gray-300">Preference: {stall.preference}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-center border-t border-gray-200 dark:border-gray-700">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            To add more interview stalls, contact the respective room admin
          </CardDescription>
          <Button onClick={openCreateDialog} variant="secondary" className="w-full mt-3 rounded-none dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Stall
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-none dark:bg-black dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              {editingStall ? "Edit Stall" : "Create New Stall"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {editingStall ? "Update stall details" : "Select company, title, and preference"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newCompanyID} onValueChange={(v) => setNewCompanyID(v)}>
              <SelectTrigger className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent className="rounded-none dark:bg-gray-800 dark:border-gray-600">
                {companies.map((c) => (
                  <SelectItem key={c.companyID} value={c.companyID} className="dark:text-gray-100">
                    {c.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Stall title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <Select
              value={newPreference}
              onValueChange={(v) => setNewPreference(v as Preference)}
            >
              <SelectTrigger className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Stream preference" />
              </SelectTrigger>
              <SelectContent className="rounded-none dark:bg-gray-800 dark:border-gray-600">
                {Object.values(Preference).map((p) => (
                  <SelectItem key={p} value={p} className="dark:text-gray-100">
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
              className="rounded-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              disabled={!newCompanyID || !newTitle.trim() || creating}
              onClick={editingStall ? handleUpdateStall : handleCreateStall}
              className="rounded-none"
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
}

const StallsGroupCard = () => {
  return <StallsContent />;
};

export default StallsGroupCard;
