"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PDFViewer from "../components/PDFViewer";
import VariableProximity from "./utils/VariableProximity";
import BlurText from "./utils/BlurText";
import { useRef } from "react";

interface Procedure {
	id: number;
	title: string;
	description: string;
	category: "proceduri" | "politici" | string;
	filePath: string;
	fileName: string;
}
interface VariableProximityProps {
	label: string;
	radius?: number;
	falloff?: "linear" | "exponential" | "gaussian";
}
interface BlurTextProps {
	text: string;
	delay?: number;
	direction?: "top" | "bottom";
}

function VariableProximityComponent({ label, radius = 100, falloff = "linear" }: VariableProximityProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<div ref={containerRef} style={{ position: "relative" }}>
			<VariableProximity
				label={label}
				className="variable-proximity-demo"
				fromFontVariationSettings="'wght' 400, 'opsz' 9"
				toFontVariationSettings="'wght' 1000, 'opsz' 40"
				containerRef={containerRef}
				radius={radius}
				falloff={falloff}
			/>
		</div>
	);
}

function BlurTextComponent({ text, delay = 100, direction = "top" }: BlurTextProps) {
	return (
		<>
			<BlurText text={text} delay={delay} animateBy="words" direction={direction} className="text-2xl mb-8" />
		</>
	);
}

export default function Home() {
	const [procedures, setProcedures] = useState<Procedure[]>([]);
	const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "proceduri" | "politici">("all");

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

	const handleCardClick = (procedure: Procedure) => {
		setSelectedPDF(procedure.filePath);
	};

	const closePDF = () => {
		setSelectedPDF(null);
	};

	const scrollToGrid = () => {
		const el = document.getElementById("procedures");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	const handleFilterClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, next: "proceduri" | "politici") => {
		e.preventDefault();
		setFilter(next);
		scrollToGrid();
	};

	const filteredProcedures = procedures.filter((p) => (filter === "all" ? true : p.category === filter));

	return (
		<div>

			{/* Hero Section */}
			<section className="hero-section">
				<div className="container text-center">
					<h1 className="display-4 fw-semibold mb-4">
						<BlurText text="Proceduri & Politici NIS Compania de Apa Arad" delay={100} direction="top" />
					</h1>

					<div className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "600px" }}>
						<VariableProximityComponent
							label="Securitatea informațiilor începe cu noi. Procedurile și politicile NIS asigură protecția datelor, continuitatea activității și conformitatea cu standardele. Respectarea lor este cheia unui mediu de lucru sigur și eficient."
							radius={120}
							falloff="gaussian"
						/>
					</div>

				</div>
			</section>

			{/* Procedures Section */}
			<section id="procedures" className="py-5">
				<div className="container">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<div className="text-start">
							<h2 className="fw-semibold mt-2 mb-0">Proceduri și Politici</h2>
						</div>
						<div className="btn-group" role="group">
							<button className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-light"}`} onClick={() => setFilter("all")} title="Toate">
								Toate
							</button>
							<button className={`btn btn-sm ${filter === "proceduri" ? "btn-primary" : "btn-light"}`} onClick={(e) => handleFilterClick(e, "proceduri")}>
								Proceduri
							</button>
							<button className={`btn btn-sm ${filter === "politici" ? "btn-primary" : "btn-light"}`} onClick={(e) => handleFilterClick(e, "politici")}>
								Politici
							</button>
						</div>
					</div>

					{loading ? (
						<div className="text-center">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<div className="row g-4">
							{filteredProcedures.slice() // facem o copie ca să nu modificăm array-ul original
								.sort((a, b) => a.title.localeCompare(b.title)) // sortare alfabetică
								.map((procedure) => (
								<div key={procedure.id} className="col-md-6 col-lg-4">
									<div className="procedure-card p-4 h-100" onClick={() => handleCardClick(procedure)}>
										<span className={`category-badge ${procedure.category === "politici" ? "politici" : ""}`}>
											{procedure.category === "proceduri" ? "Proceduri" : "Politici"}
										</span>
										<h3 className="fw-semibold h5">{procedure.title}</h3>
										<p className="text-muted mb-4">{procedure.description}</p>
										<div className="text-primary fw-medium">
											Vizualizare <i className="bi bi-arrow-right ms-1"></i>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Footer */}
			<footer className="footer py-5">
				<div className="container">
					<div className="border-top pt-4 text-center text-muted small">
						<p>&copy; 2025 Compania de Apa Arad SA. Toate drepturile rezervate.</p>
					</div>
				</div>
			</footer>

			{/* PDF Modal */}
			{selectedPDF && <PDFViewer pdfUrl={selectedPDF} onClose={closePDF} />}
		</div>
	);
}
