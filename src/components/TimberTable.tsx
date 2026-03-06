/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from "react";
import { 
  Button, TextField, Dialog, DialogTitle, DialogContent, 
  Typography, Box, IconButton, Divider, TableRow, TableHead, 
  Table, Paper, TableCell, TableBody, TableContainer 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import type { TimberRow } from "../types";

interface Props {
  rows: TimberRow[];
  setRows: React.Dispatch<React.SetStateAction<TimberRow[]>>;
}

export default function TimberTable({ rows, setRows }: Props) {
  const [open, setOpen] = useState(false);

  const calculateTotal = (w: any, t: any, l: any, p: any): number => {
    const width = parseFloat(w) || 0;
    const thick = parseFloat(t) || 0;
    const length = parseFloat(l) || 0;
    const piece = parseFloat(p) || 0;
    if (!width || !thick || !length || !piece) return 0;
    return Number(((width * thick * length * piece) / 144).toFixed(2));
  };

  const handleChange = (index: number, field: keyof TimberRow, value: string) => {
    const updated = [...rows];
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    updated[index] = { ...updated[index], [field]: value };
    updated[index].total = calculateTotal(
      field === "width" ? value : updated[index].width,
      field === "thick" ? value : updated[index].thick,
      field === "length" ? value : updated[index].length,
      field === "piece" ? value : updated[index].piece
    );
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { width: "", thick: "", length: "", piece: "", total: 0 }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);

      const importedRows: TimberRow[] = json.map((item) => {
        const w = item.Width || item.width || "";
        const t = item.Thick || item.thick || "";
        const l = item.Length || item.length || "";
        const p = item.Piece || item.piece || "";
        return {
          width: w.toString(),
          thick: t.toString(),
          length: l.toString(),
          piece: p.toString(),
          total: calculateTotal(w, t, l, p),
        };
      });

      setRows([...rows, ...importedRows]);
      setOpen(false);
    };
    reader.readAsBinaryString(file);
  };

  const downloadSample = () => {
    const sample = [{ Width: 10, Thick: 2, Length: 12, Piece: 5 }];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "timber_sample.xlsx");
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      
      {/* Header Action Bar - Responsive Stack */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Mobile: Column, Desktop: Row
          gap: 2,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          borderRadius: 3
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ textAlign: { xs: "center", sm: "left" } }}>
          Calculation Sheet
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "row", sm: "row" } }}>
          <Button fullWidth variant="contained" onClick={addRow} sx={{ whiteSpace: "nowrap" }}>
            + Add Row
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setOpen(true)}
            sx={{ whiteSpace: "nowrap" }}
          >
            Import
          </Button>
        </Box>
      </Paper>

      {/* Table Container with Horizontal Scroll */}
      <TableContainer 
        component={Paper} 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          maxHeight: "70vh", // Vertical scroll support
          overflowX: "auto", // Horizontal scroll enabled
          '&::-webkit-scrollbar': { height: '8px' }, // Custom scrollbar for better UI
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}> {/* Ensures table doesn't squeeze too much */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>Width</TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>Thick</TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>Length</TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>Piece</TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700 }}>Total CFT</TableCell>
              <TableCell sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 700, textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row: any, i: number) => (
              <TableRow key={i} hover>
                <TableCell>
                  <TextField
                    size="small"
                    sx={{ minWidth: '80px' }}
                    value={row.width}
                    onChange={(e) => handleChange(i, "width", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    sx={{ minWidth: '80px' }}
                    value={row.thick}
                    onChange={(e) => handleChange(i, "thick", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    sx={{ minWidth: '80px' }}
                    value={row.length}
                    onChange={(e) => handleChange(i, "length", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    sx={{ minWidth: '80px' }}
                    value={row.piece}
                    onChange={(e) => handleChange(i, "piece", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={row.total}
                    InputProps={{ readOnly: true }}
                    sx={{
                      bgcolor: "#f0f7ff",
                      minWidth: '100px'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <IconButton color="error" onClick={() => removeRow(i)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Import Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Import Data
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" fontWeight={700}>Excel Requirements:</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Headers must be: <b>Width, Thick, Length, Piece</b>.
          </Typography>
          <Button size="small" variant="text" onClick={downloadSample} sx={{ mb: 2 }}>
            Download Template
          </Button>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ textAlign: "center", p: 4, border: "2px dashed #90caf9", borderRadius: 2, bgcolor: "#f9fbff" }}>
            <input accept=".xlsx,.xls" style={{ display: "none" }} id="excel-upload" type="file" onChange={handleFileUpload} />
            <label htmlFor="excel-upload">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                Upload Excel
              </Button>
            </label>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}