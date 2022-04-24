import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import e = require('express');

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;
  const testData = {
    id: '1',
    email: 'test@gmail.com',
    password: 'test-password',
    hashedPassword: 'hashed password',
  };
  beforeEach(async () => {
    mockUsersService = {
      findOne: (id) =>
        Promise.resolve({
          email: testData.email,
          password: testData.hashedPassword,
          id: id,
        } as User),
      //@ts-ignore
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: testData.hashedPassword }]),
      // remove: () => update,
    };
    mockAuthService = {
      // signUp: () => console.log('helo'),
      signIn: (email: string, password: string) =>
        //@ts-ignore
        Promise.resolve({ id: testData.id, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll - returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers(testData.email);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(testData.email);
  });

  it('findAll should throw an error if a users do not exist with the given email', (done) => {
    mockUsersService.find = () => Promise.resolve([]);
    controller.findAllUsers(testData.email).catch((err) => done());
  });

  it('findOne - should return user with the given id', async () => {
    const user = await controller.findUser(testData.id);
    expect(user).toBeDefined();
  });

  it('findOne - should throw an error if user with given id is not found', (done) => {
    mockUsersService.findOne = () => null;
    controller.findUser(testData.id).catch((err) => done());
  });

  it('signin updates session obj and returns user', async () => {
    const session = { userId: '000' };
    const user = await controller.signin(
      { email: testData.email, password: testData.password },
      session,
    );

    expect(user.id).toEqual(testData.id);
    expect(session.userId).toEqual(testData.id);
  });
});
