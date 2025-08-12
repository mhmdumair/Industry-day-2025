import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FooterProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    editData: any;
    safeString: (value: any) => string;
    handleEditOpen: () => void;
    handleUserInputChange: (field: string, value: string) => void;
    handleInputChange: (field: string, value: string) => void;
    handleSave: () => void;
    loading: boolean;
}

const Footer: React.FC<FooterProps> = ({
                                           isDialogOpen,
                                           setIsDialogOpen,
                                           editData,
                                           safeString,
                                           handleEditOpen,
                                           handleUserInputChange,
                                           handleInputChange,
                                           handleSave,
                                           loading
                                       }) => {
    return (
        <CardFooter className="justify-center pt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button type="button" onClick={handleEditOpen}>
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Admin Profile</DialogTitle>
                        <DialogDescription>
                            Update your admin information. Role cannot be changed.
                        </DialogDescription>
                    </DialogHeader>

                    {editData && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="first-name" className="text-right font-medium">
                                    First Name
                                </Label>
                                <Input
                                    id="first-name"
                                    value={safeString(editData.user.first_name)}
                                    onChange={(e) => handleUserInputChange("first_name", e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="last-name" className="text-right font-medium">
                                    Last Name
                                </Label>
                                <Input
                                    id="last-name"
                                    value={safeString(editData.user.last_name)}
                                    onChange={(e) => handleUserInputChange("last_name", e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter last name"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={safeString(editData.user.email)}
                                    onChange={(e) => handleUserInputChange("email", e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter email address"
                                    type="email"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right font-medium">
                                    Role
                                </Label>
                                <div className="col-span-3 flex items-center">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        {editData.user.role}
                                    </Badge>
                                    <span className="text-xs text-gray-500 ml-2">Cannot be changed</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="designation" className="text-right font-medium">
                                    Designation
                                </Label>
                                <Input
                                    id="designation"
                                    value={safeString(editData.designation)}
                                    onChange={(e) => handleInputChange("designation", e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter designation"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="profile-picture" className="text-right font-medium">
                                    Profile Picture <span className="text-xs text-gray-500 block">Optional</span>
                                </Label>
                                <Input
                                    id="profile-picture"
                                    value={safeString(editData.user.profile_picture)}
                                    onChange={(e) => handleUserInputChange("profile_picture", e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter profile picture URL"
                                    type="url"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardFooter>
    );
};

export default Footer;
