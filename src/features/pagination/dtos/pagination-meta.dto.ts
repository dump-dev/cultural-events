import { PaginationDTO } from "./pagination.dto";

export type PaginationMetaDTO = PaginationDTO & {
  totalItems: number;
};
