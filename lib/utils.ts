import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { HTTP_STATUS, HttpStatusCode } from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standard API response type.
 * `T` is the type of the `data` property.
 */
export type OkApiResult<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
  code?: HttpStatusCode;
};

/**
 * Fully type-safe helper to infer the type of API response from data type T.
 */

export type FailApiResult = {
  success: false;
  message: string;
  data: null;
  error?: unknown;
  code?: HttpStatusCode;
};

export type InferApiResponse<T> = OkApiResult<T>;

/**
 * Create a successful response.
 */
export function ok<T>({
  data,
  message = "Success",
  code = HTTP_STATUS.OK,
}: {
  data: T; // keep required
  message?: string;
  code?: HttpStatusCode;
}): OkApiResult<T> {
  return {
    success: true,
    code,
    message,
    data,
  };
}

/**
 * Create a failure response.
 */
export function fail(message = "Something went wrong", error?: unknown): FailApiResult {
  return {
    success: false,
    message,
    data: null,
    error,
  };
}

/**
 * Wrap a database or async operation and automatically throw a TRPCError if it fails.
 * Fully type-safe: returns the exact type from the passed function.
 */
export async function dbTry<T>(
  fn: () => Promise<T>,
  msg: string,
  code: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR",
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw new TRPCError({
      code,
      message: msg,
      cause: err,
    });
  }
}

export const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");
