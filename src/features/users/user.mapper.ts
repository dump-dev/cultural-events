import User from "../../typeorm/entities/User";
import { UserDTO } from "./dtos/user.dto";

export default class UserMapper {
  static toDTO(user: User): UserDTO {
    const { id, name, authEmail, role } = user;

    return {
      id,
      name,
      authEmail,
      role,
    };
  }
}
