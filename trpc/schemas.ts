import { PAGINAITION } from "@/config/constants";
import z from "zod";

export const baseQuerySchema = z.object({
  search: z.string().default(""),
  page: z.number().default(PAGINAITION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINAITION.MIN_PAGE_SIZE)
    .max(PAGINAITION.MAX_PAGE_SIZE)
    .default(PAGINAITION.DEFAULT_PAGE_SIZE),
});
