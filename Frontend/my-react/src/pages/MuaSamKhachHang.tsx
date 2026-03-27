import type { CSSProperties } from "react";
import { Compass, Hotel, ShoppingBag, TicketPercent, PlaneTakeoff } from "lucide-react";
import { getCurrentSession } from "../utils/auth";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "32px clamp(20px, 4vw, 48px)",
  background: "linear-gradient(180deg, #fff9f1 0%, #eef7ff 100%)",
};

const cardStyle: CSSProperties = {
  background: "#fff",
  borderRadius: 26,
  border: "1px solid #e8eef5",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
};

const quickLinks = [
  { title: "Dat tour", detail: "Khuyen mai trong tuan cho Da Lat, Phu Quoc va Nha Trang.", icon: Compass, accent: "#2563eb" },
  { title: "San khach san", detail: "Lua chon resort, homestay va combo nghi duong.", icon: Hotel, accent: "#16a34a" },
  { title: "San ve may bay", detail: "So sanh chang bay pho bien va uu dai linh hoat.", icon: PlaneTakeoff, accent: "#ea580c" },
  { title: "Deal uu dai", detail: "Voucher va ma giam gia danh cho thanh vien moi.", icon: TicketPercent, accent: "#7c3aed" },
];

export default function MuaSamKhachHang() {
  const session = getCurrentSession();

  return (
    <div style={pageStyle}>
      <section
        style={{
          ...cardStyle,
          padding: "28px clamp(20px, 4vw, 40px)",
          background:
            "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(37,99,235,0.08) 56%, #ffffff 100%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "#fff",
                color: "#ea580c",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              <ShoppingBag size={15} />
              Khong gian mua sam cho khach hang
            </div>
            <h1 style={{ margin: "16px 0 10px", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.06, color: "#12263f", fontWeight: 900 }}>
              Xin chao {session?.fullName ?? "ban"}, bat dau chon tour, khach san va ve du lich phu hop voi lich trinh cua ban.
            </h1>
            <p style={{ margin: 0, color: "#5f7389", fontSize: 17, lineHeight: 1.75 }}>
              Day la diem den sau khi khach hang dang nhap. Ban co the thay bang trang mua sam that cua du an sau nay ma khong can doi lai luong role.
            </p>
          </div>

          <div
            style={{
              minWidth: 250,
              maxWidth: 300,
              width: "100%",
              padding: 20,
              borderRadius: 24,
              background: "#fff",
              border: "1px solid #e8eef5",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 13 }}>Role dang nhap</div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900, color: "#12263f" }}>
              {session?.role ?? "customer"}
            </div>
            <div style={{ marginTop: 10, color: "#16a34a", fontWeight: 700 }}>
              Dieu huong thanh cong sang khu mua sam
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
          marginTop: 24,
        }}
      >
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} style={{ ...cardStyle, padding: 22 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: `${item.accent}14`,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon size={22} color={item.accent} />
              </div>
              <div style={{ marginTop: 16, fontSize: 21, fontWeight: 800, color: "#12263f" }}>{item.title}</div>
              <div style={{ marginTop: 8, color: "#64748b", lineHeight: 1.7 }}>{item.detail}</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
