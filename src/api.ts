/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data: any) => {
  // A4 size: 210mm x 297mm. Positions are converted from PDFKit points to mm.
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm

  // --- 1. Top Branding Header (#2c3e50) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80); // HEX #2c3e50
  doc.text("AKASHMONI SAWN TIMBER", pageWidth / 2, 20, { align: "center" });

  // Branding Line
  doc.setDrawColor(44, 62, 80);
  doc.setLineWidth(0.5);
  doc.line(15, 25, pageWidth - 15, 25);

  // --- 2. Info Section (Mill & Owner) ---
  const infoY = 35;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("MILL DETAILS:", 15, infoY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Name: ${data.millName.toUpperCase()}`, 15, infoY + 5);
  doc.text(`GSTIN: ${data.gst || "N/A"}`, 15, infoY + 10);
  doc.text(`Address: ${data.millAddress}`, 15, infoY + 15, { maxWidth: 80 });
  doc.text(`Date: ${data.date}`, 15, infoY + 25);

  // Owner Details (Right Side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("OWNER DETAILS:", 125, infoY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Name: ${data.ownerName}`, 125, infoY + 5);
  doc.text(`Address: ${data.ownerAddress}`, 125, infoY + 10, { maxWidth: 70 });
  doc.text(`Pickup No: ${data.pickupNumber}`, 125, infoY + 20);

  // --- 3. 2-Column Table Logic (Exact Colors & Centering) ---
  const maxRowsPerSide = 24;
  const leftRows = data.rows.slice(0, maxRowsPerSide);
  const rightRows = data.rows.slice(maxRowsPerSide);

  const tableCommonConfig: any = {
    theme: "grid",
    startY: 75,
    headStyles: { 
      fillColor: [242, 242, 242], // #f2f2f2 background
      textColor: [51, 51, 51],    // #333 text
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    bodyStyles: { 
      fontSize: 8, 
      halign: "center", 
      textColor: [68, 68, 68], // #444
      lineColor: [238, 238, 238], // #eeeeee
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [0, 0, 0], cellWidth: 10 }, // S.N Bold & Black
    },
  };

  // Left Table
  autoTable(doc, {
    ...tableCommonConfig,
    margin: { left: 15 },
    tableWidth: 88,
    head: [["S.N", "WIDTH", "THICK", "LENGTH", "PCS", "CFT"]],
    body: leftRows.map((r: any, i: number) => [
      i + 1, r.width, r.thick, r.length, r.piece, Number(r.total).toFixed(2)
    ]),
  });

  // Right Table
  if (rightRows.length > 0) {
    autoTable(doc, {
      ...tableCommonConfig,
      margin: { left: 108 },
      tableWidth: 88,
      head: [["S.N", "WIDTH", "THICK", "LENGTH", "PCS", "CFT"]],
      body: rightRows.map((r: any, i: number) => [
        maxRowsPerSide + i + 1, r.width, r.thick, r.length, r.piece, Number(r.total).toFixed(2)
      ]),
    });
  }

  // --- 4. Summary Section (#2c3e50 border) ---
  const summaryY = 250;
  doc.setDrawColor(44, 62, 80);
  doc.setLineWidth(0.3);
  doc.rect(125, summaryY, 70, 20); // Summary Box

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(44, 62, 80);
  doc.text("Total Pieces:", 128, summaryY + 7);
  doc.text(`${data.totalPieces}`, 192, summaryY + 7, { align: "right" });

  doc.text("Grand Total CFT:", 128, summaryY + 14);
  doc.setTextColor(211, 84, 0); // Orange color #d35400
  doc.text(`${Number(data.totalCft).toFixed(2)}`, 192, summaryY + 14, { align: "right" });

  // --- 5. Footer ---
  const footerY = 280;
  doc.setDrawColor(44, 62, 80);
  doc.setLineWidth(0.8);
  doc.line(15, footerY, pageWidth - 15, footerY);

  doc.setTextColor(44, 62, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("AKASHMONI SAWN TIMBER", 15, footerY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Authorized Signatory", pageWidth - 15, footerY + 6, { align: "right" });

  // Output
  window.open(URL.createObjectURL(doc.output("blob")));
};