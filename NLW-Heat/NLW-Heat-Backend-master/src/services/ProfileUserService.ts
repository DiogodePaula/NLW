import prismaClient from "../prisma"
import { io } from '../app'

class ProfileUserService {
    async execute(user_id: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
            }
        });

        return user;
    }
}

export { ProfileUserService };
