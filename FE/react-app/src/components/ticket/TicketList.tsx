import { useState, useEffect } from "react";
import { Ve } from "../../types/Ve";

const TicketList = () => {
  const [list, setList] = useState<Ve[]>([]);

  useEffect(() => {
    // giả lập data
    const data: Ve[] = [
      { id: 1, tenVe: "Vé Đà Nẵng", gia: 1000000, diemDen: "Đà Nẵng", loaiVe: "Thường", ngayKhoiHanh: "2024-01-15", hinhAnh: "" }
    ];
    setList(data);
  }, []);

  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>{item.tenVe}</div>
      ))}
    </div>
  );
};

export default TicketList;