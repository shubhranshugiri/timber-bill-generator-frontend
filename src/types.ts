export interface TimberRow {
  width: number | "";
  thick: number | "";
  length: number | "";
  piece: number | "";
  total: number;
}

export interface HeaderFormData {
  millName: string;
  millAddress: string;
  gst: string;
  date: string;
  ownerName: string;
  ownerAddress: string;
  pickupNumber: string;
  treeName: string;
}