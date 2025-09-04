import { PaginationMetaDTO } from "./pagination-meta.dto";

export type PaginatedResponseDTO<TData> = PaginationMetaDTO & {
  totalPages: number;
  data: Array<TData>;
};
