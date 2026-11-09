"use client";

import { useState, useEffect } from "react";

interface Procedure {
	id: number;
	title: string;
	description: string;
	category: string;
	fileName: string;
	createdAt: string;
	filePath?: string;
}

export default function ProcedureList() {
	const [procedures, setProcedures] = useState<Procedure[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [savingId, setSavingId] = useState<number | null>(null);

	useEffect(() => {
		fetchProcedures();
	}, []);

	const fetchProcedures = async () => {
		try {
			const response = await fetch("/api/procedures");
			if (response.ok) {
				const data = await response.json();
				setProcedures(data);
			}
		} catch (error) {
			console.error("Error fetching procedures:", error);
		} finally {
			setLoading(false);
		}
	};

	const deleteProcedure = async (id: number) => {
		if (!confirm("Ești sigur că vrei să ștergi această procedură?")) {
			return;
		}

		try {
			const response = await fetch(`/api/procedures/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setProcedures((prev) => prev.filter((p) => p.id !== id));
			} else {
				alert("Eroare la ștergerea procedurii");
			}
		} catch (error) {
			console.error("Error deleting procedure:", error);
			alert("Eroare la ștergerea procedurii");
		}
	};

	const saveProcedure = async (id: number, updates: Partial<Pick<Procedure, "title" | "description" | "category">>) => {
		setSavingId(id);
		try {
			const response = await fetch(`/api/procedures/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates),
			});
			if (!response.ok) throw new Error("Eroare la actualizare");
			const data = await response.json();
			setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.procedure } : p)));
		} catch (e) {
			alert("Eroare la actualizare");
		} finally {
			setSavingId(null);
		}
	};

	const handleChange = (id: number, field: keyof Procedure, value: string) => {
		setProcedures((prev) => prev.map((p) => (p.id === id ? ({ ...p, [field]: value } as Procedure) : p)));
	};

	const filteredProcedures = procedures.filter((procedure) => {
		if (filter === "all") return true;
		return procedure.category === filter;
	});

	if (loading) {
		return (
			<div className="text-center py-4">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Filter */}
			<div className="mb-3">
				<div className="btn-group" role="group">
					<button type="button" className={`btn btn-outline-primary ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
						Toate ({procedures.length})
					</button>
					<button type="button" className={`btn btn-outline-primary ${filter === "proceduri" ? "active" : ""}`} onClick={() => setFilter("proceduri")}>
						Proceduri ({procedures.filter((p) => p.category === "proceduri").length})
					</button>
					<button type="button" className={`btn btn-outline-primary ${filter === "politici" ? "active" : ""}`} onClick={() => setFilter("politici")}>
						Politici ({procedures.filter((p) => p.category === "politici").length})
					</button>
				</div>
			</div>

			{/* Procedures Table */}
			{filteredProcedures.length === 0 ? (
				<div className="text-center py-4">
					<i className="bi bi-inbox fs-1 text-muted mb-3"></i>
					<h5>Nu există proceduri</h5>
					<p className="text-muted">Încarcă fișiere PDF pentru a începe</p>
				</div>
			) : (
				<div className="table-responsive">
					<table className="table table-hover align-middle table-sticky-actions">
						<thead>
							<tr>
								<th>Fișier</th>
								<th>Categorie</th>
								<th style={{ minWidth: 160 }}>Titlu</th>
								<th style={{ minWidth: 160 }}>Descriere</th>
								{/* <th>Data</th> */}
								<th className="col-actions text-nowrap" style={{ width: 140, minWidth: 140 }}>
									Acțiuni
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredProcedures.map((procedure) => (
								<tr key={procedure.id}>
									<td>
										<div className="d-flex align-items-center gap-2">
											<i className="bi bi-file-pdf text-danger"></i>
											<div style={{ maxWidth: 350, minWidth: 280 }}>
												<a
													href={procedure.filePath || `/uploads/${procedure.fileName}`}
													target="_blank"
													rel="noopener noreferrer"
													className="small text-decoration-none"
												>
													{procedure.fileName}
												</a>
											</div>
										</div>
									</td>
									<td>
										<select
											className="form-select form-select-sm"
											value={procedure.category}
											onChange={(e) => handleChange(procedure.id, "category", e.target.value)}
										>
											<option value="proceduri">Proceduri</option>
											<option value="politici">Politici</option>
										</select>
									</td>
									<td>
										<input
											type="text"
											className="form-control form-control-sm"
											value={procedure.title}
											onChange={(e) => handleChange(procedure.id, "title", e.target.value)}
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control form-control-sm"
											value={procedure.description}
											onChange={(e) => handleChange(procedure.id, "description", e.target.value)}
										/>
									</td>
									{/* <td>
										<small className="text-muted">{new Date(procedure.createdAt).toLocaleDateString("ro-RO")}</small>
									</td> */}
									<td className="col-actions text-nowrap" style={{ width: 140, minWidth: 140 }}>
										<div className="d-flex gap-2 justify-content-end">
											<button
												className="btn btn-sm btn-success"
												disabled={savingId === procedure.id}
												onClick={() =>
													saveProcedure(procedure.id, { title: procedure.title, description: procedure.description, category: procedure.category as any })
												}
											>
												{savingId === procedure.id ? (
													<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
												) : (
													<i className="bi bi-save"></i>
												)}
											</button>
											<button className="btn btn-sm btn-outline-danger" onClick={() => deleteProcedure(procedure.id)}>
												<i className="bi bi-trash"></i>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
