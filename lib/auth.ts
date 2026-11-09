import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number): string => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10d" });
};

export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
};

export const getTokenFromCookies = async (): Promise<string | null> => {
	const cookieStore = await cookies();
	return cookieStore.get("auth-token")?.value || null;
};

export const setAuthCookie = async (token: string) => {
	const cookieStore = await cookies();
	cookieStore.set("auth-token", token, {
		httpOnly: true,
		//secure: process.env.NODE_ENV === "production",
		secure: process.env.SECURE_LOGIN === "true",
		sameSite: "strict",
		maxAge: 10 * 24 * 60 * 60, // 10 days
	});
};

export const clearAuthCookie = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("auth-token");
};
