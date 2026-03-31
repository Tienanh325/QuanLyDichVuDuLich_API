import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ShoppingBag } from "lucide-react";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import { getCurrentSession, getDefaultAdminAccount, loginWithEmail } from "../utils/auth";
import "../assets/css/DangNhap.css";

type RegisterState = {
  registeredEmail?: string;
  registeredMessage?: string;
};

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
  maxWidth: 470,
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
  const location = useLocation();
  const registerState = location.state as RegisterState | null;
  const defaultAdmin = getDefaultAdminAccount();
  const currentSession = getCurrentSession();
  const [email, setEmail] = useState(registerState?.registeredEmail ?? defaultAdmin.email);
  const [password, setPassword] = useState(defaultAdmin.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(registerState?.registeredMessage ?? "");

  useEffect(() => {
    if (currentSession?.role === "admin") {
      navigate("/ThongKe", { replace: true });
      return;
    }

    if (currentSession?.role === "customer") {
      navigate("/mua-sam", { replace: true });
    }
  }, [currentSession, navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const result = loginWithEmail(email, password);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    navigate(result.session.role === "admin" ? "/ThongKe" : "/mua-sam", { replace: true });
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
            Dang nhap cho admin va khach hang TravelHub
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
              Mot trang dang nhap, hai luong dieu huong rieng cho quan tri va mua sam khach hang.
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
            <div style={{ color: "#6c8196", fontSize: 13, marginBottom: 10 }}>Tai khoan admin mac dinh</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#10253b", wordBreak: "break-word" }}>
              {defaultAdmin.email}
            </div>
            <div style={{ color: "#16a34a", fontWeight: 700, marginTop: 8 }}>
              Mat khau demo: {defaultAdmin.password}
            </div>
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

            {successMessage ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: "12px 14px",
                  background: "#ecfdf3",
                  color: "#15803d",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {successMessage}
              </div>
            ) : null}

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
            </div>

            <button type="submit" style={primaryButtonStyle}>
              Dang nhap
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 20,
              borderTop: "1px solid #e7edf3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#64748b", lineHeight: 1.6 }}>
              Chua co tai khoan khach hang?
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                Link dang ky nay chi tao tai khoan user mua sam.
              </div>
            </div>

            <Link
              to="/dang-ky"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 16,
                background: "#eff6ff",
                color: "#2563eb",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              <ShoppingBag size={16} />
              Dang ky user
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
