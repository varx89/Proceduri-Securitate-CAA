import { NextRequest, NextResponse } from "next/server";
import Procedure from "../../../../models/Procedure";
import fs from "fs";
import path from "path";
import { verifyToken } from "../../../../lib/auth";

const isAuthenticated = (request: NextRequest) => {
	const token = request.cookies.get("auth-token")?.value;
	return !!token && !!verifyToken(token);
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ message: "Neautorizat" }, { status: 401 });
	}

	try {
		const resolvedParams = await params;
		const id = parseInt(resolvedParams.id);
		const body = await request.json();
		const { title, description, category } = body as { title?: string; description?: string; category?: "proceduri" | "politici" };

		const procedure = await Procedure.findByPk(id);
		if (!procedure) {
			return NextResponse.json({ message: "Procedura nu a fost găsită" }, { status: 404 });
		}

		if (title !== undefined) procedure.title = title;
		if (description !== undefined) procedure.description = description;
		if (category !== undefined) procedure.category = category;

		await procedure.save();

		return NextResponse.json({ message: "Actualizare reușită", procedure });
	} catch (error) {
		console.error("Error updating procedure:", error);
		return NextResponse.json({ message: "Eroare la actualizare" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ message: "Neautorizat" }, { status: 401 });
	}

	try {
		const resolvedParams = await params;
		const id = parseInt(resolvedParams.id);

		// Find the procedure
		const procedure = await Procedure.findByPk(id);
		if (!procedure) {
			return NextResponse.json({ message: "Procedura nu a fost găsită" }, { status: 404 });
		}

		// Delete the file from public/uploads
		const diskPath = path.join(process.cwd(), "public", "uploads", procedure.fileName);
		if (fs.existsSync(diskPath)) {
			fs.unlinkSync(diskPath);
		}

		// Delete from database
		await procedure.destroy();

		return NextResponse.json({ message: "Procedura a fost ștearsă cu succes" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting procedure:", error);
		return NextResponse.json({ message: "Eroare la ștergerea procedurii" }, { status: 500 });
	}
}
