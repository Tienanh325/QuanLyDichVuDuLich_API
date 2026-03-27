import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import "../assets/css/DangNhap.css";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(320px, 1.1fr) minmax(340px, 0.9fr)",
  background:
    "linear-gradient(135deg, #fff8ef 0%, #ffe3c7 30%, #d9ecff 68%, #f5f9ff 100%)",
};

const heroStyle: CSSProperties = {
  position: "relative",
  padding: "48px clamp(24px, 4vw, 56px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 28,
  color: "#11324d",
  overflow: "hidden",
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 16px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(17, 50, 77, 0.08)",
  width: "fit-content",
  backdropFilter: "blur(10px)",
  fontWeight: 700,
};

const panelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 20px",
};

const formCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 460,
  background: "rgba(255,255,255,0.94)",
  border: "1px solid rgba(17, 50, 77, 0.08)",
  borderRadius: 32,
  boxShadow: "0 26px 80px rgba(17, 50, 77, 0.16)",
  padding: "32px clamp(22px, 4vw, 38px)",
  backdropFilter: "blur(18px)",
};

const inputWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  border: "1px solid #d8e1ea",
  borderRadius: 18,
  padding: "0 16px",
  background: "#fdfefe",
  minHeight: 58,
};

const inputStyle: CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontSize: 15,
  color: "#10253b",
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "16px 20px",
  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 18px 32px rgba(234, 88, 12, 0.24)",
};

const secondaryStatStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(17, 50, 77, 0.08)",
  backdropFilter: "blur(14px)",
};

export default function DangNhap() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@travelhub.vn");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/ThongKe");
  }

  return (
    <div className="login-page" style={pageStyle}>
      <section style={heroStyle}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(249,115,22,0.24), transparent 34%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={badgeStyle}>
            <ShieldCheck size={18} color="#ea580c" />
            He thong quan tri du lich TravelHub
          </div>

          <div style={{ marginTop: 28, maxWidth: 620 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.05,
                color: "#10253b",
                fontWeight: 900,
              }}
            >
              Dang nhap de quan ly don hang, tour va hieu suat kinh doanh tren cung mot man hinh.
            </h1>
            <p
              style={{
                marginTop: 18,
                fontSize: 17,
                lineHeight: 1.75,
                color: "#3f5870",
                maxWidth: 560,
              }}
            >
              Giao dien nay phu hop cho admin hoac nhan vien van hanh, nhan manh vao truy cap
              nhanh, de nhin va san sang mo rong sang xac thuc that sau nay.
            </p>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            alignItems: "end",
          }}
        >
          <div style={secondaryStatStyle}>
            <div style={{ color: "#6c8196", fontSize: 13, marginBottom: 10 }}>Tai khoan dang hoat dong</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#10253b" }}>1,284</div>
            <div style={{ color: "#16a34a", fontWeight: 700, marginTop: 8 }}>+12% trong 30 ngay</div>
          </div>

          <div
            style={{
              ...secondaryStatStyle,
              padding: 0,
              overflow: "hidden",
              minHeight: 220,
            }}
          >
            <img
              src={thuongHieuImage}
              alt="Thuong hieu du lich"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={formCardStyle}>
          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "#fff1e8",
                color: "#c2410c",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Dang nhap he thong
            </div>
            <h2 style={{ fontSize: 34, margin: "16px 0 8px", color: "#10253b", fontWeight: 900 }}>
              Chao mung quay lai
            </h2>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
              Nhap thong tin tai khoan de vao trang quan tri. Ban co the doi sang API dang nhap that bat cu luc nao.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Email</span>
              <div style={inputWrapStyle}>
                <Mail size={18} color="#64748b" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@travelhub.vn"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Mat khau</span>
              <div style={inputWrapStyle}>
                <LockKeyhole size={18} color="#64748b" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhap mat khau"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    display: "grid",
                    placeItems: "center",
                  }}
                  aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
                >
                  {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                </button>
              </div>
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                fontSize: 14,
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#475569" }}>
                <input type="checkbox" defaultChecked />
                Ghi nho dang nhap
              </label>
              <Link to="/" style={{ color: "#ea580c", fontWeight: 700, textDecoration: "none" }}>
                Quen mat khau?
              </Link>
            </div>

            <button type="submit" style={primaryButtonStyle}>
              Dang nhap 
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 22,
              borderTop: "1px solid #e7edf3",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ padding: 14, borderRadius: 18, background: "#f8fafc" }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Vai tro goi y</div>
              <div style={{ marginTop: 6, color: "#10253b", fontWeight: 800 }}>Admin tong</div>
            </div>
            <div style={{ padding: 14, borderRadius: 18, background: "#f8fafc" }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Xac thuc</div>
              <div style={{ marginTop: 6, color: "#10253b", fontWeight: 800 }}>Email + password</div>
            </div>
            <div style={{ padding: 14, borderRadius: 18, background: "#f8fafc" }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Trang dich sau dang nhap</div>
              <div style={{ marginTop: 6, color: "#10253b", fontWeight: 800 }}>/ThongKe</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
