import * as z from "zod";
import { paginationSchema } from "../../pagination/pagination.schema";

const now = () => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const isTodayOrFuture = (date: Date, today: Date = now()) => {
  return date >= today;
};

export const getCulturalEventsWithPaginationSchema = z
  .object({
    ...paginationSchema.shape,
    ["start-date"]: z.iso
      .date()
      .transform((isoDate) => new Date(isoDate))
      .refine((date) => isTodayOrFuture(date), {
        error: "start-date must be today or a future date",
      })
      .optional()
      .default(now()),
    ["end-date"]: z.iso
      .date()
      .transform((isoDate) => new Date(isoDate))
      .optional(),
  })
  .transform((schema) => ({
    page: schema.page,
    perPage: schema["per-page"],
    startDate: schema["start-date"],
    endDate: schema["end-date"],
  }));
