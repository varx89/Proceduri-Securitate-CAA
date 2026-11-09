"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
	id: string;
	file: File;
	category: string;
	title: string;
	description: string;
	status: "pending" | "uploading" | "success" | "error";
	error?: string;
}

export default function FileUpload() {
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			file,
			category: "proceduri",
			title: file.name.replace(".pdf", ""),
			description: file.name.replace(".pdf", ""),
			status: "pending",
		}));

		setUploadedFiles((prev) => [...prev, ...newFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
		},
		multiple: true,
	});

	const updateFile = (id: string, field: keyof UploadedFile, value: string) => {
		setUploadedFiles((prev) => prev.map((file) => (file.id === id ? { ...file, [field]: value } : file)));
	};

	const uploadFile = async (fileData: UploadedFile) => {
		updateFile(fileData.id, "status", "uploading");

		const formData = new FormData();
		formData.append("file", fileData.file);
		formData.append("category", fileData.category);
		formData.append("title", fileData.title);
		formData.append("description", fileData.description);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				updateFile(fileData.id, "status", "success");
				// Remove from list after 2 seconds
				setTimeout(() => {
					setUploadedFiles((prev) => prev.filter((f) => f.id !== fileData.id));
				}, 2000);
			} else {
				const error = await response.text();
				updateFile(fileData.id, "status", "error");
				updateFile(fileData.id, "error", error);
			}
		} catch (error) {
			updateFile(fileData.id, "status", "error");
			updateFile(fileData.id, "error", "Eroare de conexiune");
		}
	};

	const uploadAll = async () => {
		const pendingFiles = uploadedFiles.filter((f) => f.status === "pending");
		for (const file of pendingFiles) {
			await uploadFile(file);
		}
	};

	const removeFile = (id: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
	};

	return (
		<div>
			{/* Drop Zone */}
			<div {...getRootProps()} className={`upload-area ${isDragActive ? "dragover" : ""}`}>
				<input {...getInputProps()} />
				<div className="text-center">
					<i className="bi bi-cloud-upload fs-1 text-muted mb-3"></i>
					<h5>Glisează fișierele PDF aici</h5>
					<p className="text-muted">sau click pentru a selecta fișiere</p>
					<p className="small text-muted">Acceptă doar fișiere PDF</p>
				</div>
			</div>

			{/* Uploaded Files List */}
			{uploadedFiles.length > 0 && (
				<div className="mt-4">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h6>Fișiere încărcate ({uploadedFiles.length})</h6>
						<button className="btn btn-primary btn-sm" onClick={uploadAll} disabled={uploadedFiles.every((f) => f.status !== "pending")}>
							Încarcă toate
						</button>
					</div>

					{uploadedFiles.map((fileData) => (
						<div key={fileData.id} className="procedure-row">
							<div className="row align-items-center">
								<div className="col-md-3">
									<div className="d-flex align-items-center">
										<i className="bi bi-file-pdf text-danger me-2"></i>
										<span className="small">{fileData.file.name}</span>
									</div>
								</div>

								<div className="col-md-2">
									<select
										className="form-select form-select-sm"
										value={fileData.category}
										onChange={(e) => updateFile(fileData.id, "category", e.target.value)}
										disabled={fileData.status === "uploading"}
									>
										<option value="proceduri">Proceduri</option>
										<option value="politici">Politici</option>
									</select>
								</div>

								<div className="col-md-3">
									<input
										type="text"
										className="form-control form-control-sm"
										placeholder="Titlu"
										value={fileData.title}
										onChange={(e) => updateFile(fileData.id, "title", e.target.value)}
										disabled={fileData.status === "uploading"}
									/>
								</div>

								<div className="col-md-3">
									<input
										type="text"
										className="form-control form-control-sm"
										placeholder="Descriere"
										value={fileData.description}
										onChange={(e) => updateFile(fileData.id, "description", e.target.value)}
										disabled={fileData.status === "uploading"}
									/>
								</div>

								<div className="col-md-1">
									<div className="d-flex gap-1">
										{fileData.status === "pending" && (
											<button className="btn btn-success" onClick={() => uploadFile(fileData)}>
												<i className="bi bi-upload"></i>
											</button>
										)}

										{fileData.status === "uploading" && (
											<div className="spinner-border spinner-border-sm text-primary" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										)}

										{fileData.status === "success" && <i className="bi bi-check-circle text-success"></i>}

										{fileData.status === "error" && <i className="bi bi-x-circle text-danger" title={fileData.error}></i>}

										<button className="btn btn-outline-danger" onClick={() => removeFile(fileData.id)} disabled={fileData.status === "uploading"}>
											<i className="bi bi-trash"></i>
										</button>
									</div>
								</div>
							</div>

							{fileData.status === "error" && fileData.error && (
								<div className="mt-2">
									<small className="text-danger">{fileData.error}</small>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
