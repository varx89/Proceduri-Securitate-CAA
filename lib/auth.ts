import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const getJwtSecret = (): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error("Lipsește JWT_SECRET din env");
	return secret;
};

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number): string => {
	return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "10d" });
};

export const verifyToken = (token: string): { userId: number } | null => {
	try {
		return jwt.verify(token, getJwtSecret()) as { userId: number };
	} catch {
		return null;
	}
};

// Secure (HTTPS-only) cookies in production; SECURE_LOGIN=false turns it off for plain-HTTP setups
export const authCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production" && process.env.SECURE_LOGIN !== "false",
	sameSite: "strict" as const,
	path: "/",
};

export const AUTH_COOKIE_MAX_AGE = 10 * 24 * 60 * 60; // 10 days
