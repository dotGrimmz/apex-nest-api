import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('Auth Service', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  const mockData = {
    email: 'test@gmail.com',
    password: 'test-password',
    emailTwo: 'testTwo@gmail.com',
    passwordTwo: 'test-two-password',
    passwordHashed:
      '$2b$10$pyuM65ysBc39NIPeh2l/Au9FcDNjN/bDc6t9wugnOd0mqGfZgGD7i',
  };

  beforeEach(async () => {
    const users: User[] = [];
    mockUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      //@ts-ignore
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(users);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Sign Up - creates a new user with a seasoned password', async () => {
    const { email, password } = mockData;
    const user = await service.signUp(email, password);
    expect(user.password).not.toEqual(password);
  });

  it('Sign Up - should throw an error if users signs up with email in use', (done) => {
    const { email, password } = mockData;

    service
      .signUp(email, password)
      .then(() => service.signUp(email, password).catch((e) => done()));
  });

  it('Sign In - should throw an error if sign in is called with unused email', (done) => {
    const { email, password } = mockData;

    service.signIn(email, password).catch((err) => done());
  });

  it('Sign In - should throw an error if sign in passwords do not match', (done) => {
    const { email, passwordTwo } = mockData;

    service.signIn(email, passwordTwo).catch((err) => done());
  });

  it('Sign In - should return user data on successful signin', async () => {
    const { email, password } = mockData;

    await service.signUp(email, password);
    const user = await service.signIn(email, password);

    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });
});
