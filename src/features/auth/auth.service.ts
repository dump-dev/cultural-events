import { Repository } from "typeorm";
import User from "../../typeorm/entities/User";
import { CredentialsDTO } from "./dtos/credentials.dto";
import { JwtService } from "./jwt.service";
import { InvalidCredentialsError } from "./types/InvalidCredentialsError";

export default class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async login(credentials: CredentialsDTO) {
    const user = await this.userRepository.findOneBy({
      authEmail: credentials.email,
    });

    if (!user) throw new InvalidCredentialsError();

    if (!(await user.verifyPassword(credentials.password)))
      throw new InvalidCredentialsError();

    const accessToken = JwtService.createAccessToken({
      userId: user.id,
      firstName: user.name.split(" ")[0],
      role: user.role,
    });

    return { accessToken };
  }
}
