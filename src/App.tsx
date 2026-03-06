import { useState } from "react";
import HeaderForm from "./components/HeaderForm";
import TimberTable from "./components/TimberTable";
import { generatePDF } from "./api";
import {
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
  Box
} from "@mui/material";

import type { HeaderFormData, TimberRow } from "./types";

export default function App() {
  const [form, setForm] = useState<HeaderFormData>({
    millName: "",
    millAddress: "",
    gst: "",
    date: "",
    ownerName: "",
    ownerAddress: "",
    pickupNumber: "",
  });

  const [rows, setRows] = useState<TimberRow[]>([
    { width: "", thick: "", length: "", piece: "", total: 0 },
  ]);

  const totalPieces = rows.reduce((sum, r) => sum + Number(r.piece || 0), 0);

  const totalCft = rows.reduce((sum, r) => sum + Number(r.total || 0), 0);

  const handlePDF = async () => {
    const payload = {
      ...form,
      rows,
      totalPieces,
      totalCft,
    };

    const res = await generatePDF(payload);

    const url = window.URL.createObjectURL(res.data);

    window.open(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 3,
        }}
      >
        <Stack spacing={4}>

          {/* Header */}
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Timber Slip Generator
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Fill the details below to generate the timber slip
            </Typography>
          </Box>

          <Divider />

          {/* Header Form */}
          <HeaderForm form={form} setForm={setForm} />

          <Divider />

          {/* Timber Table */}
          <TimberTable rows={rows} setRows={setRows} />

          {/* Totals */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Stack direction="row" spacing={6}>
              <Typography variant="h6">
                Total Pieces: <strong>{totalPieces}</strong>
              </Typography>

              <Typography variant="h6">
                Total CFT: <strong>{totalCft.toFixed(2)}</strong>
              </Typography>
            </Stack>
          </Paper>

          {/* Button */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={handlePDF}
            >
              Download PDF
            </Button>
          </Box>

        </Stack>
      </Paper>
    </Container>
  );
}