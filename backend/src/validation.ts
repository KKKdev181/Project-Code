import { z } from "zod";

const email = z.union([z.string().email(), z.literal(""), z.null()]).optional();

export const serviceSchema = z.object({
  service_date: z.string().nullable().optional(),
  service_name: z.string().min(1, "Service Name is required"),
  hpsm_name_en: z.string().nullable().optional(),
  hpsm_name_ar: z.string().nullable().optional(),
  code: z.string().min(1, "CODE is required"),
  customer_name: z.string().nullable().optional(),
  budget_code: z.string().nullable().optional(),
  group_name: z.string().nullable().optional(),
  division: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  project_manager: z.string().nullable().optional(),
  project_manager_email: email,
  technical_lead: z.string().nullable().optional(),
  technical_manager_email: email,
  support_department: z.string().nullable().optional(),
  support_spoc: z.string().nullable().optional(),
  support_spoc_email: email,
  hosted_location: z.string().nullable().optional(),
  project_info_ar: z.string().nullable().optional(),
  project_info_en: z.string().nullable().optional()
});

export const allowedSorts = new Set([
  "service_name","code","customer_name","division","department",
  "project_manager","technical_lead","support_department","hosted_location","updated_at"
]);
