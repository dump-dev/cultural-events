import { PAGINATION_DEFAULT_MAX_PER_PAGE } from "../../constants/pagination";

export default class PaginationHelper {
  static skip(page: number, perPage: number) {
    return page < 2 ? 0 : (page - 1) * perPage;
  }

  static take(perPage: number, maxPerPage = PAGINATION_DEFAULT_MAX_PER_PAGE) {
    return PaginationHelper.clampPerPage(perPage, maxPerPage);
  }

  static clampPerPage(
    perPage: number,
    maxPerPage = PAGINATION_DEFAULT_MAX_PER_PAGE
  ) {
    return Math.min(perPage, maxPerPage);
  }

  static totalPages(totalItems: number, perPage: number) {
    return Math.ceil(totalItems / perPage);
  }
}
