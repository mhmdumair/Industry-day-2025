"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { AxiosError } from "axios";

// --- Constants & Enums ---

const studentLevels = ["level_1", "level_2", "level_3", "level_4"] as const;

const SubjectEnum = z.enum([
  "BT", "ZL", "CH", "MT", "BMS", "ST", "GL", 
  "CS", "DS", "ML", "CM", "ES", "MB", "PH"
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

// --- Zod Schema ---

const formSchema = z.object({
  user: z.object({
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    role: z.literal("student"),
  }),
  student: z.object({
    regNo: z
      .string()
      .regex(/^S\/(0[0-9]|1[0-9]|2[0-3])\/\d{3}$/, {
        message: "Format must be S/XX/XXX ",
      }),
    
    nic: z.string().regex(/^([0-9]{9}[vVxX]|[0-9]{12})$/, {
      message: "NIC must be 9 digits+V or 12 digits",
    }),

    linkedin: z.string().optional(),

    contact: z.string().regex(/^0\d{9}$/, {
      message: "Mobile must be 10 digits starting with 0",
    }),

    group: z
      .string()
      .min(1, "Group is required")
      .transform((val) => val.toUpperCase())
      .refine((val) => {
        const groups = val.split("_");
        const result = groups.every((g) =>
          SubjectEnum.safeParse(g).success
        );
        return result;
      }, {
        message: "Invalid Group. Allowed: BT, ZL, CH, MT, BMS, ST, GL, CS, DS, ML, CM, ES, MB, PH. If SOR, use format like CS_ST_MT",
      }),

    level: z.enum(studentLevels),
  }),
  cv_file: z
    .custom<FileList>()
    .refine((files) => {
        if (!files || files.length === 0) return true;
        return files[0]?.size <= MAX_FILE_SIZE;
    }, "Max file size is 5MB.")
    .refine((files) => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
    }, "Only .pdf files are accepted."),
});

type FormValues = z.infer<typeof formSchema>;

// --- Component ---

export default function CreateStudent() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: { role: "student", email: "", first_name: "", last_name: "" },
      student: { level: "level_3", regNo: "", nic: "", linkedin: "", contact: "", group: "" },
    },
  });

  const cvFile = watch("cv_file");
  const selectedFile = cvFile && cvFile.length > 0 ? cvFile[0] : null;

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    setSuccessMessage(null);

    try {
      const dataToSend = new FormData();

      const jsonPayload = JSON.stringify({
        user: data.user,
        student: data.student,
      });
      dataToSend.append("createStudentDto", jsonPayload);

      if (data.cv_file && data.cv_file.length > 0) {
        dataToSend.append("cv_file", data.cv_file[0]);
      }

      await api.post("/student", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Student created successfully!");
      reset();
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      const errorMsg = (err.response?.data as any)?.message || "Failed to create student";
      setApiError(errorMsg);
    }
  };

  return (
    <Card className="bg-white dark:bg-black shadow-md mt-3 mb-3 max-w-[80%] mx-auto rounded-none">
      <CardHeader>
        <CardTitle className="text-xl leading-4 dark:text-white">
          Create Student
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Register new user and student details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* --- Global Messages --- */}
          {apiError && (
            <div className="text-red-500 p-2 border border-red-500 text-center text-sm rounded-none">{apiError}</div>
          )}
          {successMessage && (
            <div className="text-green-500 p-2 border border-green-500 text-center text-sm rounded-none">{successMessage}</div>
          )}

          {/* --- User Section --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 dark:text-gray-300">Email</Label>
              <Input
                {...register("user.email")}
                type="email"
                placeholder="e.g., student@example.com"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.user?.email && <p className="text-red-500 text-xs mt-1">{errors.user.email.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">First Name</Label>
              <Input
                {...register("user.first_name")}
                placeholder="e.g., John"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.user?.first_name && <p className="text-red-500 text-xs mt-1">{errors.user.first_name.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">Last Name</Label>
              <Input
                {...register("user.last_name")}
                placeholder="e.g., Doe"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.user?.last_name && <p className="text-red-500 text-xs mt-1">{errors.user.last_name.message}</p>}
            </div>
          </div>

          {/* --- Student Section --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <Label className="mb-1 dark:text-gray-300">Registration Number</Label>
              <Input
                {...register("student.regNo")}
                placeholder="S/XX/XXX"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.student?.regNo && <p className="text-red-500 text-xs mt-1">{errors.student.regNo.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">NIC</Label>
              <Input
                {...register("student.nic")}
                placeholder="NIC"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.student?.nic && <p className="text-red-500 text-xs mt-1">{errors.student.nic.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">Contact</Label>
              <Input
                {...register("student.contact")}
                placeholder="07x xxxxxxx"
                className="rounded-none dark:bg-black dark:text-white"
              />
              {errors.student?.contact && <p className="text-red-500 text-xs mt-1">{errors.student.contact.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">Group</Label>
              <Input
                {...register("student.group")}
                placeholder="CS"
                className="rounded-none dark:bg-black dark:text-white uppercase"
                onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register("student.group").onChange(e);
                }}
              />
              {errors.student?.group && <p className="text-red-500 text-xs mt-1">{errors.student.group.message}</p>}
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">LinkedIn (Optional)</Label>
              <Input
                {...register("student.linkedin")}
                placeholder="e.g., https://linkedin.com/in/johndoe"
                className="rounded-none dark:bg-black dark:text-white"
              />
            </div>
            <div>
              <Label className="mb-1 dark:text-gray-300">Level</Label>
              <Controller
                control={control}
                name="student.level"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="rounded-none dark:bg-black dark:text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none dark:bg-black dark:text-white">
                      {studentLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* --- CV Upload Section --- */}
          <div className="space-y-3 pt-2">
            <Label htmlFor="cv_file" className="dark:text-gray-300">
              Upload CV (PDF Only, Max 5MB) - Optional
            </Label>
            
            <div className={`border-2 border-dashed rounded-none p-6 transition-colors ${
                errors.cv_file ? "border-red-500 bg-red-50" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50"
            }`}>
              <div className="flex flex-col items-center justify-center space-y-3">
                {!selectedFile ? (
                  <>
                    <div className="p-3">
                      <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="text-center">
                      <Label htmlFor="cv_file" className="cursor-pointer">
                        <span className="text-sm font-medium underline text-gray-700 dark:text-gray-300">
                          Click to upload
                        </span>
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PDF files only (Max 5MB)
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 w-full max-w-xs mx-auto p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                         reset({ ...watch(), cv_file: undefined });
                         const fileInput = document.getElementById('cv_file') as HTMLInputElement;
                         if (fileInput) fileInput.value = '';
                      }}
                      className="text-green-700 hover:text-green-900 dark:text-green-300"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Input
                  id="cv_file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  {...register("cv_file")}
                />
              </div>
            </div>
            {errors.cv_file && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors.cv_file.message as string}
                </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4 rounded-none dark:bg-white dark:text-black dark:hover:bg-gray-200" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}