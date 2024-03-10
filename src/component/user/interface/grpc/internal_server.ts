import { ConnectRouter } from '@connectrpc/connect';

import { UserUsecase } from '@/component/user/usecase/user_usecase';
import { toPBUser } from '@/component/user/interface/grpc/util';
import { InternalUserService } from '@/grpc/example/user/v1/internal_connect';
import {
  GetUserRequest,
  GetUserResponse,
} from '@/grpc/example/user/v1/internal_pb';

class InternalServer {
  constructor(private userUsecase: UserUsecase) {}

  getUser = async (req: GetUserRequest): Promise<GetUserResponse> => {
    const user = await this.userUsecase.findById(req.userId);
    if (!user) {
      throw new Error('user not found');
    }

    return new GetUserResponse({
      user: toPBUser(user),
    });
  };
}

export const RegisterUser = (
  router: ConnectRouter,
  userUsecase: UserUsecase
) => {
  const server = new InternalServer(userUsecase);

  router.service(InternalUserService, server);
};
