import { User } from '@/component/user/domain/model/user';

export type UserRepository = {
  findById: (id: string) => Promise<User | undefined>;
};
