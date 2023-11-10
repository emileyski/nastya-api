import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/core/enums/roles.enum';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt', 'birthDate'],
    });
  }

  async create(createUserDto: CreateUserDto, picture?): Promise<User> {
    try {
      const hashedPassword = await hash(createUserDto.password);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);

      if (picture) {
        const { id: pictureId } = await this.filesService.saveOne(picture);
        await this.setPicture(user.id, pictureId);
      }

      return this.createReturnableUser(user);
    } catch (error) {
      throw new ConflictException(
        'User with this email or nickname is already exists',
      );
    }
  }

  async setPicture(id: string, picture: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    user.picture = picture;
    return await this.usersRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    picture?,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    if (user.picture) await this.filesService.deleteFileById(user.picture);

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password);
    }
    try {
      this.usersRepository.merge(user, updateUserDto);
      const newUser = await this.usersRepository.save(user);

      if (picture) {
        const { id: pictureId } = await this.filesService.saveOne(picture);
        await this.setPicture(user.id, pictureId);
        newUser.picture = pictureId;
      }

      return this.createReturnableUser(newUser);
    } catch (error) {
      throw new ConflictException('User with this email is already exists');
    }
  }

  async setRole(id: string, role: Roles): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    user.token = undefined;
    return await this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  createReturnableUser(user: User): User {
    const returnableUser = { ...user };
    delete returnableUser.password;
    delete returnableUser.token;
    return returnableUser;
  }
}
