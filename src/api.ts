/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data: any) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Wood-Themed Professional Colors ---
  // Ye colors color print mein 'Timber' feel denge aur B&W print mein clear rahenge.
  const primaryColor = [60, 42, 33];    // Deep Walnut Brown (Main branding)
  const accentColor = [120, 75, 40];     // Golden Oak (Headers/Highlights)
  const lightBgColor = [248, 245, 240];  // Paper/Wood Cream (Backgrounds)
  const tableHeaderColor = [78, 52, 46]; // Darker Wood for Tables

  const margin = 15;
  const rowsPerPageFirst = 24; 
  const rowsPerPageSubsequent = 32; 
  
  const totalItems = data.rows.length;

  const drawPageFrame = (pdf: jsPDF, pageNum: number, totalP: number) => {
    // Header Line (Thin & Professional)
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 22, pageWidth - margin, 22);

    // Fixed Bottom Footer Section
    const footerLineY = pageHeight - 20;
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerLineY, pageWidth - margin, footerLineY);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text(`${data.millName}`, margin, footerLineY + 8);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80); // Neutral grey for B&W compatibility
    pdf.text("Authorized Signature", pageWidth - margin, footerLineY + 8, { align: "right" });
    
    pdf.setFontSize(8);
    pdf.text(`Page ${pageNum} of ${totalP}`, pageWidth / 2, pageHeight - 5, { align: "center" });
  };

  let currentItemIndex = 0;
  let pageNumber = 1;

  const totalPages = Math.ceil(totalItems <= 48 ? 1 : 1 + (totalItems - 48) / 64);

  while (currentItemIndex < totalItems) {
    if (pageNumber > 1) doc.addPage();
    
    drawPageFrame(doc, pageNumber, totalPages);

    let startY = 28; 

    if (pageNumber === 1) {
      // --- Page 1 ONLY: Mill & Owner Details ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${data.millName.toUpperCase()}`, pageWidth / 2, 18, { align: "center" });

      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
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

      // --- Tree Name Bar ---
      doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
      doc.rect(margin, startY - 10, pageWidth - (margin * 2), 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14); // Slightly reduced for elegance
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(`${data.treeName.toUpperCase()}`, pageWidth / 2, startY - 4.5, { align: "center" });
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${data.millName.toUpperCase()}`, pageWidth / 2, 15, { align: "center" });
    }

    const rowsThisPageCount = pageNumber === 1 ? rowsPerPageFirst : rowsPerPageSubsequent;
    const pageData = data.rows.slice(currentItemIndex, currentItemIndex + rowsThisPageCount * 2);
    
    const mid = Math.ceil(pageData.length / 2);
    const leftRows = pageData.slice(0, mid);
    const rightRows = pageData.slice(mid);

    const tableConfig: any = {
      theme: "grid",
      startY: startY,
      headStyles: { 
        fillColor: tableHeaderColor, 
        textColor: 255, 
        fontSize: 8.5, 
        halign: "center",
        lineWidth: 0.1 
      },
      bodyStyles: { 
        fontSize: 8.5, 
        halign: "center", 
        textColor: [20, 20, 20],
        lineColor: [200, 200, 200] 
      },
      columnStyles: { 0: { fontStyle: "bold", fillColor: [250, 248, 245], cellWidth: 10 } },
    };

    // Left Table
    autoTable(doc, {
      ...tableConfig,
      margin: { left: margin },
      tableWidth: 88,
      head: [["S.N", "W", "T", "L", "PCS", "CFT"]],
      body: leftRows.map((r: any, idx: number) => [
        currentItemIndex + idx + 1, r.width, r.thick, r.length, r.piece, Number(r.total).toFixed(2)
      ]),
    });

    // Right Table
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

    // --- Summary Box ---
    if (currentItemIndex >= totalItems) {
      const summaryBoxY = pageHeight - 45;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.roundedRect(125, summaryBoxY, 70, 20, 1, 1, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Total Pieces:", 129, summaryBoxY + 7.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`${data.totalPieces}`, 190, summaryBoxY + 7.5, { align: "right" });

      doc.setTextColor(60, 60, 60);
      doc.text("Grand Total CFT:", 129, summaryBoxY + 14.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Using Primary Brown instead of Orange
      doc.setFontSize(11);
      doc.text(`${Number(data.totalCft).toFixed(2)}`, 190, summaryBoxY + 14.5, { align: "right" });
    }
    
    pageNumber++;
  }

  window.open(URL.createObjectURL(doc.output("blob")));
};