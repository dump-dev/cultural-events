import { PaginationDTO } from "../../pagination/dtos/pagination.dto";

export type GetCulturalEventsWithoutPaginationDTO = {
  startDate: Date;
  endDate?: Date;
};

export type GetCulturalEventsWithPaginationDTO = PaginationDTO &
  GetCulturalEventsWithoutPaginationDTO;

