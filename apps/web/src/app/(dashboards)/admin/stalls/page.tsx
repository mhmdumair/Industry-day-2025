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
import { X, Plus, Edit, Download, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface Stall {
  stallID: string;
  title: string;
  companyID: string;
  preference: string;
  company?: { companyName: string };
  roomID: string;
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
  const router = useRouter();
  const [companiesWithStalls, setCompaniesWithStalls] = useState<
    (Company & { stalls: Stall[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [newCompanyID, setNewCompanyID] = useState<string>();
  const [newTitle, setNewTitle] = useState("");
  const [newPreference, setNewPreference] = useState<Preference>(
    Preference.ALL
  );
  const [creating, setCreating] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomID, setSelectedRoomID] = useState<string>();

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogDescription, setAlertDialogDescription] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stallToDelete, setStallToDelete] = useState<{
    stallID: string;
    companyID: string;
  } | null>(null);

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

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
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          handleAuthError();
        } else {
          console.error("Failed to fetch data:", error);
          setAlertDialogTitle("Error");
          setAlertDialogDescription(
            "Failed to load data. Please check your network connection and try again."
          );
          setAlertDialogOpen(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesStallsAndRooms();
  }, []);

  const confirmRemove = (stallID: string, companyID: string) => {
    setStallToDelete({ stallID, companyID });
    setDeleteDialogOpen(true);
  };

  const handleRemove = async () => {
    if (!stallToDelete) return;
    const { stallID, companyID } = stallToDelete;
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
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Error deleting stall:", error);
        setAlertDialogTitle("Error");
        setAlertDialogDescription("Failed to delete stall. Please try again.");
        setAlertDialogOpen(true);
      }
    } finally {
      setDeleteDialogOpen(false);
      setStallToDelete(null);
    }
  };

  const openCreateDialog = (companyID: string) => {
    setEditingStall(null);
    setNewCompanyID(companyID);
    setNewTitle("");
    setNewPreference(Preference.ALL);
    setSelectedRoomID(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (stall: Stall) => {
    setEditingStall(stall);
    setNewCompanyID(stall.companyID);
    setNewTitle(stall.title);
    setNewPreference(stall.preference as Preference);
    setSelectedRoomID(stall.roomID);
    setDialogOpen(true);
  };

  const handleCreateStall = async () => {
    if (!selectedRoomID || !newCompanyID || !newTitle.trim()) {
      setAlertDialogTitle("Missing Information");
      setAlertDialogDescription("Please fill all the required fields.");
      setAlertDialogOpen(true);
      return;
    }
    setCreating(true);

    try {
      const dto = {
        roomID: selectedRoomID,
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
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Error creating stall:", error);
        setAlertDialogTitle("Error");
        setAlertDialogDescription(
          "Failed to create stall. Please check the console for details."
        );
        setAlertDialogOpen(true);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStall = async () => {
    if (!editingStall || !selectedRoomID || !newCompanyID || !newTitle.trim())
      return;
    setCreating(true);

    try {
      const dto = {
        roomID: selectedRoomID,
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
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Error updating stall:", error);
        setAlertDialogTitle("Error");
        setAlertDialogDescription(
          "Failed to update stall. Please check the console for details."
        );
        setAlertDialogOpen(true);
      }
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

  const exportStallInfo = () => {
    setExporting(true);
    try {
      const allStalls = companiesWithStalls.flatMap((company) =>
        company.stalls.map((stall) => ({
          ...stall,
          companyName: company.companyName,
          roomName: rooms.find((r) => r.roomID === stall.roomID)?.roomName || "N/A",
        }))
      );

      const headers = [
        "Company Name",
        "Stall Title",
        "Stream Preference",
        "Assigned Room",
      ];

      const rows = allStalls.map(stall => [
        stall.companyName,
        stall.title,
        stall.preference,
        stall.roomName,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell || "").replace(/"/g, '""');
            if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
              return `"${cellStr}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `interview-stalls-${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export failed:", error);
      setAlertDialogTitle("Export Error");
      setAlertDialogDescription("Failed to export stall data.");
      setAlertDialogOpen(true);
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );

  return (
    <div className="mt-6 mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Interview Stalls</h1>
        <Button
          onClick={exportStallInfo}
          disabled={exporting || companiesWithStalls.every(c => c.stalls.length === 0)}
          className="rounded-none"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Stalls Data
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companiesWithStalls.map((company) => (
          <Card
            key={company.companyID}
            className="rounded-none flex flex-col"
          >
            <CardHeader className="border-b p-4">
              <CardTitle className="text-xl font-semibold">
                {company.companyName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
              {company.stalls.length > 0 ? (
                company.stalls.map((stall) => (
                  <div
                    key={stall.stallID}
                    className="relative p-3 border rounded-none bg-muted"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{stall.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Preference: {stall.preference}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 p-1 rounded-none"
                          onClick={() => openEditDialog(stall)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 p-1 rounded-none"
                          onClick={() =>
                            confirmRemove(stall.stallID, company.companyID)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No stalls for this company yet.
                </p>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button
                onClick={() => openCreateDialog(company.companyID)}
                className="w-full rounded-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stall
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>
              {editingStall ? "Edit Stall" : "Create New Stall"}
            </DialogTitle>
            <DialogDescription>
              {editingStall
                ? `Editing stall for ${
                    companiesWithStalls.find(
                      (c) => c.companyID === newCompanyID
                    )?.companyName
                  }`
                : `Creating a new stall for ${
                    companiesWithStalls.find(
                      (c) => c.companyID === newCompanyID
                    )?.companyName
                  }`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Select
              value={selectedRoomID}
              onValueChange={(v) => setSelectedRoomID(v)}
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {rooms.map((room) => (
                  <SelectItem
                    key={room.roomID}
                    value={room.roomID}
                    className="rounded-none"
                  >
                    {room.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Stall title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-none"
            />
            <Select
              value={newPreference}
              onValueChange={(v) => setNewPreference(v as Preference)}
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Stream preference" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {Object.values(Preference).map((p) => (
                  <SelectItem key={p} value={p} className="rounded-none">
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
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              disabled={!newTitle.trim() || !selectedRoomID || creating}
              onClick={editingStall ? handleUpdateStall : handleCreateStall}
              className="rounded-none"
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

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertDialogOpen(false)}
              className="rounded-none"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              stall.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="rounded-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StallsGroupCard;