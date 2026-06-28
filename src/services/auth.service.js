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
        password: hashedPassword
        },
        select: {
            hrId: true,
            name: true,
            email: true
        }
    });
    
    return {status: true, data: newUser};
}

export const loginUserService = async (userData) => {
    const existingUser = await prisma.hR.findUnique({ where: { email: userData.email } });
    if (!existingUser) {
        return {status: false, message: 'User not found. Please check and try again'};
    }

    const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
    if (!isPasswordValid) {
        return {status: false, message: 'Invalid password. Please check and try again'};
    }

    const token = jwt.sign({ hrId: existingUser.hrId}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {status: true, data: { token }};
}