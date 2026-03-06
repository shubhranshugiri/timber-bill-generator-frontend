import { Box, Grid, Paper, TextField, Typography, Divider } from "@mui/material";
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
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 }, // Mobile par padding thodi kam
        mb: 3,
        borderRadius: 3,
        overflow: "hidden"
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        color="primary"
        sx={{
          mb: 2,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          textAlign: { xs: "center", sm: "left" }
        }}
      >
        Mill & Owner Information
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }}>

        {/* LEFT SIDE: Mill Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary", fontWeight: 600 }}>
            MILL DETAILS
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Mill Name"
              placeholder="Enter mill name"
              value={form.millName}
              onChange={(e) => handleChange("millName", e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              label="Mill Address"
              placeholder="Enter mill address"
              multiline
              rows={2}
              value={form.millAddress}
              onChange={(e) => handleChange("millAddress", e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>                <TextField
                fullWidth
                size="small"
                label="GST Number"
                value={form.gst}
                onChange={(e) => handleChange("gst", e.target.value)}
              />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Mobile Divider (Visible only on small screens) */}
        <Grid size={{ xs: 12 }} sx={{ display: { xs: "block", md: "none" } }}>           <Divider />
        </Grid>

        {/* RIGHT SIDE: Owner Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary", fontWeight: 600 }}>
            OWNER / CONSIGNEE DETAILS
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Owner Name"
              placeholder="Enter owner name"
              value={form.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              label="Owner Address"
              placeholder="Enter owner address"
              multiline
              rows={2}
              value={form.ownerAddress}
              onChange={(e) => handleChange("ownerAddress", e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              label="Pickup Number"
              placeholder="Enter vehicle or pickup no."
              value={form.pickupNumber}
              onChange={(e) => handleChange("pickupNumber", e.target.value)}
            />
          </Box>
        </Grid>

      </Grid>
    </Paper>
  );
}