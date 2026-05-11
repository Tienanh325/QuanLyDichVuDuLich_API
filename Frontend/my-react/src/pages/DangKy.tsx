import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, LockKeyhole, Mail, Phone, User } from "lucide-react";
import thuongHieuImage from "../assets/images/baibien.jpg";
import { registerWithAPI } from "../utils/auth";
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
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ tên đăng nhập, họ tên, email và mật khẩu.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    const result = await registerWithAPI({
      username: username.trim(),
      password,
      ten: fullName.trim(),
      email: email.trim(),
      sdt: sdt.trim() || undefined,
    });
    setIsLoading(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/dang-nhap", {
      replace: true,
      state: { registeredMessage: result.message },
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
              Đăng ký tài khoản khách hàng
            </div>
            <h1 style={{ fontSize: 34, margin: "16px 0 8px", color: "#10253b", fontWeight: 900 }}>
              Tạo tài khoản mua sắm
            </h1>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
              Trang này chỉ dành cho khách hàng. Tài khoản admin sẽ được thêm thủ công bởi hệ thống.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Tên đăng nhập</span>
              <div style={inputWrapStyle}>
                <User size={18} color="#64748b" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="vd: nguyenvana123"
                  style={inputStyle}
                  autoComplete="username"
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Họ và tên</span>
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
              <span style={{ fontWeight: 700, color: "#23374d" }}>Số điện thoại (tùy chọn)</span>
              <div style={inputWrapStyle}>
                <Phone size={18} color="#64748b" />
                <input
                  type="tel"
                  value={sdt}
                  onChange={(event) => setSdt(event.target.value)}
                  placeholder="09xxxxxxxx"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Mật khẩu</span>
              <div style={inputWrapStyle}>
                <LockKeyhole size={18} color="#64748b" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhập mật khẩu"
                  style={inputStyle}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#23374d" }}>Xác nhận mật khẩu</span>
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

            <button type="submit" style={{ ...primaryButtonStyle, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
              {isLoading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
            </button>
          </form>

          <div style={{ marginTop: 18, color: "#64748b", lineHeight: 1.7 }}>
            Đã có tài khoản?
            <Link to="/dang-nhap" style={{ marginLeft: 6, color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Quay lại đăng nhập
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
            Mua tour, khách sạn và vé du lịch bằng tài khoản cá nhân của bạn.
          </h2>
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
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 240,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "rgba(255,255,255,0.72)",
            }}
          >
            <img
              src={thuongHieuImage}
              alt="Du lịch TravelHub"
              style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
