import { PAGINAITION } from "@/config/constants";
import { parseAsInteger, parseAsString } from "nuqs/server";

export const baseQueryParams = {
  page: parseAsInteger.withDefault(PAGINAITION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger.withDefault(PAGINAITION.DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
