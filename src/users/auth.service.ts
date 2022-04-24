import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { encodePassword, comparePasswords } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const existingUserArr = await this.usersService.find(email);
    if (existingUserArr.length) {
      throw new BadRequestException('This user already exists');
    }

    //## Hash the users password

    const seasonedPassword = encodePassword(password);

    const user = await this.usersService.create(email, seasonedPassword);
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('This user does not exist');
    }
    const matched = comparePasswords(password, user.password);
    if (matched) {
      return user;
    }
    throw new BadRequestException('Passwords Do not match');
  }
}
