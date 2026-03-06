/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Divider, TableRow, TableHead, Table, Paper, TableCell, TableBody } from "@mui/material";
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

  // --- Calculation Logic ---
  const calculateTotal = (w: any, t: any, l: any, p: any): number => {
    const width = parseFloat(w) || 0;
    const thick = parseFloat(t) || 0;
    const length = parseFloat(l) || 0;
    const piece = parseFloat(p) || 0;
    if (!width || !thick || !length || !piece) return 0;
    return Number(((width * thick * length * piece) / 144).toFixed(2));
  };

  // --- 1. Decimal Fix: Value ko state mein string rakhna zaroori hai ---
  const handleChange = (index: number, field: keyof TimberRow, value: string) => {
    const updated = [...rows];
    // Numeric check but allow empty and dot
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    updated[index] = { ...updated[index], [field]: value };

    // Calculation hamesha latest values par base hogi
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

  // --- 2. Excel Import Logic ---
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
      setOpen(false); // Close modal after import
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
    <Box sx={{ p: 3 }}>

      {/* Header Action Bar */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 3
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Timber Calculation Sheet
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={addRow}>
            Add Row
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => setOpen(true)}
          >
            Import Excel
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden"
        }}
      >
        <Table>

          <TableHead
            sx={{
              bgcolor: "#1976d2"
            }}
          >
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Width</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Thickness</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Length</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Piece</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Total CFT</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {rows.map((row: any, i: number) => (
              <TableRow
                key={i}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#f5f5f5"
                  }
                }}
              >
                <TableCell>
                  <TextField
                    size="small"
                    value={row.width}
                    onChange={(e) =>
                      handleChange(i, "width", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.thick}
                    onChange={(e) =>
                      handleChange(i, "thick", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.length}
                    onChange={(e) =>
                      handleChange(i, "length", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.piece}
                    onChange={(e) =>
                      handleChange(i, "piece", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.total}
                    InputProps={{ readOnly: true }}
                    sx={{
                      bgcolor: "#f0f7ff",
                      width: 120
                    }}
                  />
                </TableCell>

                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => removeRow(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>
        </Table>
      </Paper>

      {/* Import Modal */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          Import Timber Data
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>

          <Typography variant="subtitle1" fontWeight={600}>
            Steps
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            1. Download sample sheet<br />
            2. Fill Width, Thick, Length, Piece<br />
            3. Upload Excel file
          </Typography>

          <Button
            size="small"
            variant="text"
            onClick={downloadSample}
            sx={{ mb: 3 }}
          >
            Download Sample Excel
          </Button>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              textAlign: "center",
              p: 4,
              border: "2px dashed #90caf9",
              borderRadius: 2,
              bgcolor: "#f9fbff"
            }}
          >

            <input
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              id="excel-upload"
              type="file"
              onChange={handleFileUpload}
            />

            <label htmlFor="excel-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload Excel
              </Button>
            </label>

            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 2 }}
            >
              Supported formats: .xlsx / .xls
            </Typography>

          </Box>

        </DialogContent>
      </Dialog>

    </Box>
  );
}