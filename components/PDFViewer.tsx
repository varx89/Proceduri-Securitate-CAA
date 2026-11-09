"use client";

import { useState } from "react";

interface PDFViewerProps {
	pdfUrl: string;
	onClose: () => void;
}

export default function PDFViewer({ pdfUrl, onClose }: PDFViewerProps) {
	const [loading, setLoading] = useState(true);

	return (
		<div className="pdf-modal" onClick={onClose}>
			<div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="pdf-modal-close" onClick={onClose}>
					×
				</button>

				<div className="d-flex flex-column h-100">
					{/* PDF Controls */}
					<div className="p-3 border-bottom bg-light">
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<span className="fw-bold">Vizualizare PDF</span>
							</div>
							<button className="btn btn-info btn-sm pe-4" onClick={onClose}>
								Închide
							</button>
						</div>
					</div>

					{/* PDF Content */}
					<div className="flex-grow-1 p-3" style={{ minHeight: 0 }}>
						{loading && (
							<div className="text-center">
								<div className="spinner-border text-primary" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
								<p className="mt-2">Se încarcă documentul...</p>
							</div>
						)}

						<iframe
							src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
							width="100%"
							height="100%"
							style={{ border: "none", minHeight: "500px" }}
							onLoad={() => setLoading(false)}
							onError={() => {
								console.error("Error loading PDF");
								setLoading(false);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
