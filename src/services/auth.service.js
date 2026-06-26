import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUserService = async (userData) => {
    const existingUser = await prisma.hR.findUnique({ where: { email: userData.email } });
    if (existingUser) {
        return {status: false, message: 'User already exists'};
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.hR.create({
        data: {
        email : userData.email,  
        name: userData.name,
        password: hashedPassword,
        createdAt: new Date()
        }
    });
    
    return {status: true, data: newUser};
}

export const loginUserService = async (email, password) => {
    const existingUser = await prisma.hR.findUnique({ where: { email } });
    if (!existingUser) {
        return {status: false, message: 'User not found. Please check and try again'};
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return {status: false, message: 'Invalid password. Please check and try again'};
    }

    //If Valid User Generate JWT Token
    const token = jwt.sign({ id: existingUser.hrId}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {status: true, data: { token }};

}