import axios from "axios";
import { Ve } from "../types/Ve";

const API_URL = "https://localhost:5001/api";

export const searchVe = async (params: {
  diemDen?: string;
  loaiVe?: string;
  ngayKhoiHanh?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Ve[]> => {

  const response = await axios.get(`${API_URL}/Ve_Search`, {
    params: params
  });

  return response.data;
};