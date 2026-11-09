import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isRegisterSlug } from "../../lib/register";
import RegisterForm from "../../components/RegisterForm";

export const metadata: Metadata = {
	title: "Înregistrare utilizator",
	robots: { index: false, follow: false },
};

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	if (!isRegisterSlug(slug)) notFound();

	return <RegisterForm registerKey={slug} />;
}
