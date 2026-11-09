import { timingSafeEqual } from "crypto";

// The register page only exists at /<REGISTER_SLUG>; without the env var registration is disabled
export const isRegisterSlug = (value: string | undefined | null): boolean => {
	const slug = process.env.REGISTER_SLUG;
	if (!slug || !value) return false;
	const a = Buffer.from(value);
	const b = Buffer.from(slug);
	return a.length === b.length && timingSafeEqual(a, b);
};
