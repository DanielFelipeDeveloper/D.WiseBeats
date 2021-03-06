import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  avatarFilename: string;
  user_id: string;
}

class UpdateUserAvatarService {
  public async execute({ avatarFilename, user_id }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) throw new Error('Only authenticated users can change avatar.');

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) await fs.promises.unlink(userAvatarFilePath);
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
