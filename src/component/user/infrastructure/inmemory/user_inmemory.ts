import { UserRepository } from '@/component/user/domain/repository/user_repository';
import { User } from '@/component/user/domain/model/user';

const users: User[] = [
  {
    id: '1',
    name: 'User 1',
  },
  {
    id: '2',
    name: 'User 2',
  },
];

class UserInMemory implements UserRepository {
  async findById(id: string): Promise<User | undefined> {
    return users.find((user) => user.id === id);
  }
}

export const NewUserInMemory = (): UserRepository => {
  return new UserInMemory();
};
