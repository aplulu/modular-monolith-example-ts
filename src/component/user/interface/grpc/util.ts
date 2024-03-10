import { User } from '@/component/user/domain/model/user';
import { User as PBUser } from '@/grpc/example/user/v1/common_pb';

export const toPBUser = (user: User): PBUser => {
  return new PBUser({
    id: user.id,
    name: user.name,
  });
};
