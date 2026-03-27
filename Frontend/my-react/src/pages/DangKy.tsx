import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, LockKeyhole, Mail, ShieldAlert } from "lucide-react";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import { registerCustomer } from "../utils/auth";
import "../assets/css/DangNhap.css";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(340px, 0.9fr) minmax(320px, 1.1fr)",
  background:
    "linear-gradient(145deg, #eef8ff 0%, #d9ecff 28%, #fff3e4 72%, #fffaf5 100%)",
};

const leftPanelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 20px",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 480,
  background: "rgba(255,255,255,0.94)",
  borderRadius: 30,
  padding: "34px clamp(22px, 4vw, 38px)",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.14)",
  backdropFilter: "blur(18px)",
};

const infoPanelStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  padding: "48px clamp(24px, 4vw, 56px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 24,
  color: "#15314b",
};

const inputWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  border: "1px solid #d8e1ea",
  borderRadius: 18,
  padding: "0 16px",
  background: "#fff",
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
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 18px 32px rgba(37, 99, 235, 0.24)",
};

export default function DangKy() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Vui long nhap day du ho ten, email va mat khau.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mat khau xac nhan khong khop.");
      return;
    }

    const result = registerCustomer({ fullName, email, password });

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/dang-nhap", {
      replace: true,
      state: {
        registeredEmail: result.customer.email,
        registeredMessage: "Dang ky thanh cong. Ban co the dang nhap voi tai khoan khach hang vua tao.",
      },
    });
  }

  return (
    <div className="login-page" style={pageStyle}>
      <section style={leftPanelStyle}>
        <div style={cardStyle}>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "#eaf2ff",
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Dang ky tai khoan khach hang
            </div>
            <h1 style={{ fontSize: 34, margin: "16px 0 8px", color: "#10253b", fontWeight: 900 }}>
              Tao tai khoan mua sam
            </h1>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
              Trang nay chi danh cho khach hang. Tai khoan admin se duoc them thu cong boi he thong.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Ho va ten</span>
              <div style={inputWrapStyle}>
                <CircleUserRound size={18} color="#64748b" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyen Van A"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Email</span>
              <div style={inputWrapStyle}>
                <Mail size={18} color="#64748b" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="khachhang@email.com"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Mat khau</span>
              <div style={inputWrapStyle}>
                <LockKeyhole size={18} color="#64748b" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhap mat khau"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Xac nhan mat khau</span>
              <div style={inputWrapStyle}>
                <LockKeyhole size={18} color="#64748b" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhap lai mat khau"
                  style={inputStyle}
                />
              </div>
            </label>

            {errorMessage ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: "12px 14px",
                  background: "#fff1f2",
                  color: "#be123c",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {errorMessage}
              </div>
            ) : null}

            <button type="submit" style={primaryButtonStyle}>
              Tao tai khoan khach hang
            </button>
          </form>

          <div style={{ marginTop: 18, color: "#64748b", lineHeight: 1.7 }}>
            Da co tai khoan?
            <Link to="/dang-nhap" style={{ marginLeft: 6, color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Quay lai dang nhap
            </Link>
          </div>
        </div>
      </section>

      <section style={infoPanelStyle}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(37,99,235,0.20), transparent 30%), radial-gradient(circle at bottom left, rgba(249,115,22,0.18), transparent 36%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.74)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              fontWeight: 700,
            }}
          >
            TravelHub Membership
          </div>

          <h2 style={{ margin: "22px 0 12px", fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.06, color: "#10253b", fontWeight: 900 }}>
            Mua tour, khach san va ve du lich bang tai khoan ca nhan cua ban.
          </h2>
          <p style={{ maxWidth: 560, margin: 0, color: "#486079", lineHeight: 1.8, fontSize: 17 }}>
            Sau khi dang ky, nguoi dung se dang nhap vao khu mua sam rieng. He thong quan tri admin khong dang ky tai day de tranh mo rong quyen sai doi tuong.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 24,
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <ShieldAlert size={20} color="#ea580c" />
            <div style={{ marginTop: 12, fontWeight: 800, color: "#10253b" }}>Admin duoc cap thu cong</div>
            <div style={{ marginTop: 8, color: "#597189", lineHeight: 1.7 }}>
              Neu can them tai khoan quan tri, he thong se tao boi bo phan van hanh thay vi dang ky tu do.
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 240,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "rgba(255,255,255,0.72)",
            }}
          >
            <img
              src={thuongHieuImage}
              alt="Du lich TravelHub"
              style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
