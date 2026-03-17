import { useState } from "react";
import '../../assets/css/search.css';

export default function SearchForm({ onSearch }: any) {
  const [form, setForm] = useState({
    diemDen: "",
    loaiVe: ""
  });

  const submit = (e: any) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <div className="search-box">
      <form onSubmit={submit}>
        <input name="diemDen" placeholder="Điểm đến..." />
        <select name="loaiVe">
          <option>Máy bay</option>
          <option>Tàu</option>
        </select>
        <button>Tìm kiếm</button>
      </form>
    </div>
  );
}