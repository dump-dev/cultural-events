import { PaginatedResponseDTO } from "./dtos/paginated-response.dto";
import { PaginationMetaDTO } from "./dtos/pagination-meta.dto";
import PaginationHelper from "./pagination.helper";

export default class PaginationMapper {
  static toPaginatedResponseDTO<TData>(
    meta: PaginationMetaDTO,
    data: Array<TData>
  ): PaginatedResponseDTO<TData> {
    const { page, perPage, totalItems } = meta;

    return {
      page,
      perPage,
      totalItems,
      totalPages: PaginationHelper.totalPages(totalItems, perPage),
      data,
    };
  }
}
