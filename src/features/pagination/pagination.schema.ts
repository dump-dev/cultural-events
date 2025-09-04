import * as z from "zod";
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
} from "../../constants/pagination";
import PaginationHelper from "./pagination.helper";

export const paginationSchema = z.object({
  page: z.coerce.number().gte(1).default(PAGINATION_DEFAULT_PAGE),
  ["per-page"]: z.coerce
    .number()
    .gte(1)
    .transform((perPage) => PaginationHelper.clampPerPage(perPage))
    .default(PAGINATION_DEFAULT_PER_PAGE),
});
