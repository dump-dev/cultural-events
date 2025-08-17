import { Repository } from "typeorm";
import User from "../../../typeorm/entities/User";

export default class  UsersService {
    constructor(private usersRepository: Repository<User>) {}

    async getUsers() {
        return this.usersRepository.find()
    }
}