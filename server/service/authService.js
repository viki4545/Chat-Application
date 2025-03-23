import User from "../models/user"

export const registerUserService = async(registerData) => {
    return await User.create({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
    })
}
