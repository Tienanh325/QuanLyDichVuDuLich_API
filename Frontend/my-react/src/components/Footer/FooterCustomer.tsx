
import {
  Facebook,
  Instagram,
  Music2,
  Send,
  Youtube,
} from "lucide-react";
import "../../assets/css/CustomerFooter.css";

const aboutLinks = [
  "Cách đặt chỗ",
  "Liên hệ chúng tôi",
  "Trợ giúp",
  "Tuyển dụng",
  "Về chúng tôi",
];

const productLinks = [
  "Khách sạn",
  "Vé máy bay",
  "Vé tàu",
  "Tour & Hoạt động",
  "Du thuyền",
  "Biệt thự",
  "Căn hộ",
];

const otherLinks = [
  "Traveloka Affiliate",
  "Giới thiệu bạn bè",
  "Traveloka Blog",
  "Chính Sách Quyền Riêng",
  "Điều khoản & Điều kiện",
  "Đăng ký nơi nghỉ của bạn",
  "Đăng ký doanh nghiệp hoạt động du lịch của bạn",
  "Khu vực báo chí",
  "Quy chế hoạt động",
  "Vulnerability Disclosure Program",
  "APAC Travel Insights",
];

const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "Instagram", icon: Instagram },
  { label: "TikTok", icon: Music2 },
  { label: "Youtube", icon: Youtube },
  { label: "Telegram", icon: Send },
] as const;

const paymentPartners = [
  "Visa",
  "Mastercard",
  "JCB",
  "Amex",
  "MoMo",
  "ZaloPay",
  "VNPAY",
  "ShopeePay",
  "ATM",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "BIDV",
  "Vietcombank",
  "Techcombank",
  "MB Bank",
  "ACB",
  "VPBank",
  "Sacombank",
  "TPBank",
];

export default function FooterCustomer() {
 

  return (
    <footer className="customer-footer"> 
      <section className="customer-footer__main">
        <div className="customer-shell__container customer-footer__grid">
          <div className="customer-footer__column customer-footer__column--support">
            <div className="customer-footer__payments">
              <h3>Đối tác thanh toán</h3>
              <div className="customer-footer__payment-grid">
                {paymentPartners.map((item) => (
                  <div key={item} className="customer-footer__payment-card">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="customer-footer__column">
            <h3>Về Traveloka</h3>
            <ul className="customer-footer__links">
              {aboutLinks.map((item) => (
                <li key={item}>
                  <a href="#uu-dai">{item}</a>
                </li>
              ))}
            </ul>

            <div className="customer-footer__social">
              <h3>Theo dõi chúng tôi trên</h3>
              <ul className="customer-footer__social-list">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label}>
                      <a href="#uu-dai">
                        <Icon size={15} />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="customer-footer__column">
            <h3>Sản phẩm</h3>
            <ul className="customer-footer__links">
              {productLinks.map((item) => (
                <li key={item}>
                  <a href="#uu-dai">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="customer-footer__column customer-footer__column--misc">
            <h3>Khác</h3>
            <ul className="customer-footer__links">
              {otherLinks.map((item) => (
                <li key={item}>
                  <a href="#uu-dai">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="customer-footer__legal">
          <div className="customer-shell__container">
            <p>
              Công ty TNHH Traveloka Việt Nam. Mã số doanh nghiệp 0313581779 cấp ngày 18/12/2015 |
              Địa chỉ: Tòa nhà An Phú, 117 Lý Chính Thắng, Phường Xuân Hòa, TP HCM | Đại diện pháp
              luật: Lê Minh Tự | Email: cs@traveloka.com | Tel: +84 28 3861 4699
            </p>
            <p>Copyright © 2026 Traveloka. All rights reserved</p>
          </div>
        </div>
      </section>
    </footer>
  );
}
