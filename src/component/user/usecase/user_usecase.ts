import { User } from '@/component/user/domain/model/user';
import { UserRepository } from '@/component/user/domain/repository/user_repository';

export type UserUsecase = {
  findById: (id: string) => Promise<User | undefined>;
};

class UserUsecaseImpl implements UserUsecase {
  constructor(private userRepository: UserRepository) {}

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }
}

export const NewUserUsecase = (userRepository: UserRepository): UserUsecase => {
  return new UserUsecaseImpl(userRepository);
};
