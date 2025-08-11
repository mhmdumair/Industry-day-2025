"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
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

interface Stall {
  stallID: string;
  title: string;
  companyID: string;
  preference: string;
  company?: { companyName: string };
  roomID : string
}

interface Company {
  companyID: string;
  companyName: string;
}

interface Room {
  roomID: string;
  roomName: string;
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
  const [companiesWithStalls, setCompaniesWithStalls] = useState<
    (Company & { stalls: Stall[] })[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* dialog state */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [newCompanyID, setNewCompanyID] = useState<string>();
  const [newTitle, setNewTitle] = useState("");
  const [newPreference, setNewPreference] = useState<Preference>(Preference.ALL);
  const [creating, setCreating] = useState(false);

  /* room state */
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomID, setSelectedRoomID] = useState<string>();

  /* ---------- initial load ---------- */
  useEffect(() => {
    const fetchCompaniesStallsAndRooms = async () => {
      setLoading(true);
      try {
        const [companiesRes, roomsRes] = await Promise.all([
          api.get("/company"),
          api.get("/room"),
        ]);
        const allCompanies = companiesRes.data as Company[];
        setRooms(roomsRes.data as Room[]);

        const companiesWithStallsData = await Promise.all(
          allCompanies.map(async (company) => {
            const stallsRes = await api.get(
              `/stall/company/${company.companyID}`
            );
            return {
              ...company,
              stalls: stallsRes.data as Stall[],
            };
          })
        );
        setCompaniesWithStalls(companiesWithStallsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load data. Please check your network connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesStallsAndRooms();
  }, []);

  /* ---------- actions ---------- */
  const handleRemove = async (stallID: string, companyID: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this stall? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/stall/${stallID}`);
        setCompaniesWithStalls((prev) =>
          prev.map((company) => {
            if (company.companyID === companyID) {
              return {
                ...company,
                stalls: company.stalls.filter(
                  (stall) => stall.stallID !== stallID
                ),
              };
            }
            return company;
          })
        );
      } catch (error) {
        console.error("Error deleting stall:", error);
        alert("Failed to delete stall. Please try again.");
      }
    }
  };

  const openCreateDialog = (companyID: string) => {
    setEditingStall(null);
    setNewCompanyID(companyID);
    setNewTitle("");
    setNewPreference(Preference.ALL);
    setSelectedRoomID(undefined); // Reset the room selection for a new stall
    setDialogOpen(true);
  };

  const openEditDialog = (stall: Stall) => {
    setEditingStall(stall);
    setNewCompanyID(stall.companyID);
    setNewTitle(stall.title);
    setNewPreference(stall.preference as Preference);
    setSelectedRoomID(stall.roomID); // Pre-select the stall's current room
    setDialogOpen(true);
  };

  const handleCreateStall = async () => {
    if (!selectedRoomID || !newCompanyID || !newTitle.trim()) {
      alert("Missing information to create a stall.");
      return;
    }
    setCreating(true);

    try {
      const dto = {
        roomID: selectedRoomID, // Use the selected room from the dropdown
        companyID: newCompanyID,
        status: "active",
        title: newTitle,
        preference: newPreference,
      };

      const created = (await api.post("/stall", dto)).data as Stall;

      setCompaniesWithStalls((prev) =>
        prev.map((company) => {
          if (company.companyID === created.companyID) {
            return {
              ...company,
              stalls: [...company.stalls, created],
            };
          }
          return company;
        })
      );
      setDialogOpen(false);
      resetDialogState();
    } catch (error) {
      console.error("Error creating stall:", error);
      alert("Failed to create stall. Please check the console for details.");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStall = async () => {
    if (!editingStall || !selectedRoomID || !newCompanyID || !newTitle.trim()) return;
    setCreating(true);

    try {
      const dto = {
        roomID: selectedRoomID, // Use the selected room from the dropdown
        companyID: newCompanyID,
        title: newTitle,
        preference: newPreference,
      };

      const updated = (
        await api.patch(`/stall/${editingStall.stallID}`, dto)
      ).data as Stall;

      setCompaniesWithStalls((prev) =>
        prev.map((company) => {
          if (company.companyID === updated.companyID) {
            return {
              ...company,
              stalls: company.stalls.map((s) =>
                s.stallID === updated.stallID ? updated : s
              ),
            };
          }
          return company;
        })
      );
      setDialogOpen(false);
      resetDialogState();
    } catch (error) {
      console.error("Error updating stall:", error);
      alert("Failed to update stall. Please check the console for details.");
    } finally {
      setCreating(false);
    }
  };

  const resetDialogState = () => {
    setEditingStall(null);
    setNewCompanyID(undefined);
    setNewTitle("");
    setNewPreference(Preference.ALL);
    setSelectedRoomID(undefined);
  };

  /* ---------- render ---------- */
  if (loading) return <p className="p-4 text-center text-gray-500">Loading companies, stalls, and rooms...</p>;

  return (
    <div className="mt-6 mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Manage Interview Stalls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companiesWithStalls.map((company) => (
          <Card key={company.companyID} className="bg-white shadow-lg border border-gray-200 flex flex-col">
            <CardHeader className="bg-gray-50 border-b p-4">
              <CardTitle className="text-xl font-semibold">{company.companyName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
              {company.stalls.length > 0 ? (
                company.stalls.map((stall) => (
                  <div key={stall.stallID} className="relative p-3 border rounded-md shadow-sm bg-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">{stall.title}</h4>
                        <p className="text-xs text-gray-600">Preference: {stall.preference}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 p-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          onClick={() => openEditDialog(stall)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 p-1 bg-red-50 hover:bg-red-100 border-red-200"
                          onClick={() => handleRemove(stall.stallID, company.companyID)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No stalls for this company yet.</p>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t bg-gray-50">
              <Button
                onClick={() => openCreateDialog(company.companyID)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stall
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ---------- dialog for add/edit stall ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStall ? "Edit Stall" : "Create New Stall"}
            </DialogTitle>
            <DialogDescription>
              {editingStall
                ? `Editing stall for ${companiesWithStalls.find(c => c.companyID === newCompanyID)?.companyName}`
                : `Creating a new stall for ${companiesWithStalls.find(c => c.companyID === newCompanyID)?.companyName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Select
              value={selectedRoomID}
              onValueChange={(v) => setSelectedRoomID(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.roomID} value={room.roomID}>
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Stall title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
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
              disabled={!newTitle.trim() || !selectedRoomID || creating}
              onClick={editingStall ? handleUpdateStall : handleCreateStall}
            >
              {creating
                ? editingStall
                  ? "Updating…"
                  : "Creating…"
                : editingStall
                ? "Update Stall"
                : "Create Stall"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StallsGroupCard;