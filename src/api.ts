/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data: any) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Vibrant Branded Colors
  const primaryColor = [30, 58, 138]; // Deep Royal Blue
  const accentColor = [79, 70, 229];  // Indigo Vibrant
  const highlightColor = [234, 88, 12]; // Vibrant Orange

  const margin = 15;
  const rowsPerPageFirst = 24; // Pehle page pe 48 (Details ki wajah se)
  const rowsPerPageSubsequent = 32; // Baaki pages pe 64 (Details hatne ki wajah se)
  
  const totalItems = data.rows.length;

  // --- Helper: Draw Header & Footer (Common for all pages) ---
  const drawPageFrame = (pdf: jsPDF, pageNum: number, totalP: number) => {
    // Header Line
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.6);
    pdf.line(margin, 22, pageWidth - margin, 22);

    // Fixed Bottom Footer Section
    const footerLineY = pageHeight - 20;
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.6);
    pdf.line(margin, footerLineY, pageWidth - margin, footerLineY);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text(`${data.millName}`, margin, footerLineY + 8);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Authorized Signature", pageWidth - margin, footerLineY + 8, { align: "right" });
    
    pdf.setFontSize(8);
    pdf.text(`Page ${pageNum} of ${totalP}`, pageWidth / 2, pageHeight - 5, { align: "center" });
  };

  // --- Logic: Data Splitting ---
  let currentItemIndex = 0;
  let pageNumber = 1;

  // Function to calculate total pages (Approximate)
  const totalPages = Math.ceil(totalItems <= 48 ? 1 : 1 + (totalItems - 48) / 64);

  while (currentItemIndex < totalItems) {
    if (pageNumber > 1) doc.addPage();
    
    drawPageFrame(doc, pageNumber, totalPages);

    let startY = 28; // Default start for page 2+

    if (pageNumber === 1) {
      // --- Page 1 ONLY: Mill & Owner Details ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${data.millName.toUpperCase()}`, pageWidth / 2, 18, { align: "center" });

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const infoY = 32;

      doc.setFont("helvetica", "bold");
      doc.text("MILL DETAILS", margin, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(`GSTIN: ${data.gst || "N/A"}`, margin, infoY + 5);
      doc.text(`Address: ${data.millAddress}`, margin, infoY + 10, { maxWidth: 80 });
      doc.text(`Date: ${data.date}`, margin, infoY + 20);

      doc.setFont("helvetica", "bold");
      doc.text("OWNER DETAILS", 120, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${data.ownerName}`, 120, infoY + 5);
      doc.text(`Address: ${data.ownerAddress}`, 120, infoY + 10, { maxWidth: 75 });
      doc.text(`Vehicle: ${data.pickupNumber}`, 120, infoY + 20);

      startY = 68;
          // --- Tree Name Bar (Every Page) ---
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, startY - 10, pageWidth - (margin * 2), 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`${data.treeName.toUpperCase()}`, pageWidth / 2, startY - 4.5, { align: "center" });
    } else {
      // --- Page 2+: Small Header for Continuity ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${data.millName.toUpperCase()}`, pageWidth / 2, 15, { align: "center" });
    }



    // Determine how many rows for this page
    const rowsThisPageCount = pageNumber === 1 ? rowsPerPageFirst : rowsPerPageSubsequent;
    const pageData = data.rows.slice(currentItemIndex, currentItemIndex + rowsThisPageCount * 2);
    
    const mid = Math.ceil(pageData.length / 2);
    const leftRows = pageData.slice(0, mid);
    const rightRows = pageData.slice(mid);

    const tableConfig: any = {
      theme: "grid",
      startY: startY,
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8.5, halign: "center" },
      bodyStyles: { fontSize: 8.5, halign: "center", textColor: [40, 40, 40] },
      columnStyles: { 0: { fontStyle: "bold", fillColor: [249, 250, 251], cellWidth: 10 } },
    };

    // Draw Left Table
    autoTable(doc, {
      ...tableConfig,
      margin: { left: margin },
      tableWidth: 88,
      head: [["S.N", "W", "T", "L", "PCS", "CFT"]],
      body: leftRows.map((r: any, idx: number) => [
        currentItemIndex + idx + 1, r.width, r.thick, r.length, r.piece, Number(r.total).toFixed(2)
      ]),
    });

    // Draw Right Table
    if (rightRows.length > 0) {
      autoTable(doc, {
        ...tableConfig,
        margin: { left: 107 },
        tableWidth: 88,
        head: [["S.N", "W", "T", "L", "PCS", "CFT"]],
        body: rightRows.map((r: any, idx: number) => [
          currentItemIndex + mid + idx + 1, r.width, r.thick, r.length, r.piece, Number(r.total).toFixed(2)
        ]),
      });
    }

    currentItemIndex += pageData.length;

    // --- Summary Box (Only on Final Page) ---
    if (currentItemIndex >= totalItems) {
      const summaryBoxY = pageHeight - 45;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.4);
      doc.roundedRect(125, summaryBoxY, 70, 20, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Total Pieces:", 129, summaryBoxY + 7.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`${data.totalPieces}`, 190, summaryBoxY + 7.5, { align: "right" });

      doc.setTextColor(60, 60, 60);
      doc.text("Grand Total CFT:", 129, summaryBoxY + 14.5);
      doc.setTextColor(highlightColor[0], highlightColor[1], highlightColor[2]);
      doc.setFontSize(11);
      doc.text(`${Number(data.totalCft).toFixed(2)}`, 190, summaryBoxY + 14.5, { align: "right" });
    }
    
    pageNumber++;
  }

  window.open(URL.createObjectURL(doc.output("blob")));
};