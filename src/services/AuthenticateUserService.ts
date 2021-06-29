import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UserRepositories"


interface IAuthRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {
    async execute({email, password}: IAuthRequest) {
        const userRepository = getCustomRepository(UsersRepositories)

        const user = await userRepository.findOne({
            email
        })

        if(!user) {
            throw new Error("Email/Password incorrect")
        }

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new Error("Email/Password incorrect")
        }

        const token = sign({
            email: user.email
        }, 
        "notsecurekey", 
        {
            subject: user.id,
            expiresIn: "1d"
        })  

        return token;
    }
}

export {AuthenticateUserService}