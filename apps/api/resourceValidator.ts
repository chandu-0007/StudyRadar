import { z } from "zod";

// Zod schema for validating standard string fields from multer form-data
export const resourceUploadSchema = z
    .object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        type: z.enum(["NOTES", "PPT", "PAST_PAPER", "LAB_MANUAL", "TEXTBOOK", "SYLLABUS", "VIDEO", "LINK", "OTHER"]),
        subjectId: z.string().uuid("Invalid subject ID"),
        semester: z.enum(["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6", "SEM7", "SEM8"]),
        unit: z.string().optional(),
        description: z.string().optional(),
        year: z.string().optional(),
        syllabusMatch: z.enum(["true", "false"]).optional(),
        examYear: z.string().optional(),
        examType: z.enum(["MID_SEM", "END_SEM"]).optional(),
    })
    .refine(
        (data) => {
            if (data.type === "PAST_PAPER") {
                return data.examYear !== undefined && data.examType !== undefined;
            }
            return true;
        },
        {
            message: "examYear and examType are required when type is PAST_PAPER",
            path: ["examType"],
        }
    );