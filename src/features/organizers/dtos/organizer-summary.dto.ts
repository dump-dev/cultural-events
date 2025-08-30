import { UserDTO } from "../../users/dtos/user.dto";

export type OrganizerSummaryDTO = {
  id: string;
  displayName: string;
  user: Pick<UserDTO, "id" | "authEmail" | "name">;
};
