import { QueryFailedError, Repository } from "typeorm";
import User from "../../../typeorm/entities/User";
import { RegisterUserDTO } from "./dtos/register-user.dto";

export default class CreateUserService {
  constructor(private userRepository: Repository<User>) {}

  async create(registerUserDTO: RegisterUserDTO) {
    const user = new User();
    user.name = registerUserDTO.name;
    user.authEmail = registerUserDTO.email;
    user.password = registerUserDTO.password;
    return this.userRepository.save(user);
  }
}
