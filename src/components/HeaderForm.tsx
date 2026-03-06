import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import type { HeaderFormData } from "../types";

interface Props {
  form: HeaderFormData;
  setForm: React.Dispatch<React.SetStateAction<HeaderFormData>>;
}

export default function HeaderForm({ form, setForm }: Props) {
  const handleChange = (field: keyof HeaderFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Mill Information
      </Typography>

      <Grid container spacing={3}>

        {/* LEFT SIDE */}

        <Grid size={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <TextField
              fullWidth
              label="Mill Name"
              placeholder="Enter mill name"
              value={form.millName}
              onChange={(e) => handleChange("millName", e.target.value)}
            />

            <TextField
              fullWidth
              label="Mill Address"
              placeholder="Enter mill address"
              multiline
              rows={2}
              value={form.millAddress}
              onChange={(e) => handleChange("millAddress", e.target.value)}
            />

            <TextField
              fullWidth
              label="GST Number"
              placeholder="Enter GST number"
              value={form.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
            />

            <TextField
              fullWidth
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />

          </Box>
        </Grid>


        {/* RIGHT SIDE */}

        <Grid size={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <TextField
              fullWidth
              label="Owner Name"
              placeholder="Enter owner name"
              value={form.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
            />

            <TextField
              fullWidth
              label="Owner Address"
              placeholder="Enter owner address"
              multiline
              rows={2}
              value={form.ownerAddress}
              onChange={(e) => handleChange("ownerAddress", e.target.value)}
            />

            <TextField
              fullWidth
              label="Pickup Number"
              placeholder="Enter pickup number"
              value={form.pickupNumber}
              onChange={(e) => handleChange("pickupNumber", e.target.value)}
            />

          </Box>
        </Grid>

      </Grid>
    </Paper>
  );
}