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

export const editorSchema = z.object({
  id: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().nullish(),
      position: z.object({ x: z.number(), y: z.number() }),
      data: z.record(z.string(), z.any()).optional(),
    }),
  ),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().nullish(),
      targetHandle: z.string().nullish(),
    }),
  ),
});
