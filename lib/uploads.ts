import path from "path";

// PDFs live outside public/ so uploads made after the build are served too (mount this dir as a persistent volume)
export const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));

// Maps a stored file name to its path on disk, refusing anything that would escape UPLOAD_DIR
export const resolveUploadPath = (fileName: string): string | null => {
	const diskPath = path.resolve(/*turbopackIgnore: true*/ UPLOAD_DIR, fileName);
	return path.dirname(diskPath) === UPLOAD_DIR ? diskPath : null;
};
