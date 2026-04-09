import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Copy,
  Gift,
  Grid2x2,
  Landmark,
  MapPin,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerActivity.css";

type ShortcutId = "kham-pha" | "diem-tham-quan" | "tour-hoat-dong" | "can-thiet" | "tat-ca-hoat-dong";
type SortId = "popular" | "price-low" | "rating-high";

type DestinationOption = {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  count: string;
  image: string;
  description: string;
  rating?: string;
  reviews?: string;
  bestMonths?: string;
  duration?: string;
  mustVisit?: string;
};

type PromoItem = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
};

type CouponItem = {
  title: string;
  description: string;
  code: string;
  badge: string;
};

type ActivityItem = {
  title: string;
  location: string;
  destinationId: string;
  destinationLabel: string;
  priceValue: number;
  image: string;
  rating: number;
  reviews: string;
  badge?: string;
  oldPriceValue?: number;
  shortcuts: ShortcutId[];
  filters: string[];
  perks: string[];
};

type FilterGroup = {
  title: string;
  options: string[];
};

const images = {
  sea: baibienImage,
  city: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  japan: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
  disney: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
  aquarium: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=1200&q=80",
  transit: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  show: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  themePark: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1200&q=80",
} as const;

const destinations: DestinationOption[] = [
  {
    id: "any",
    name: "Chọn một điểm đến",
    subtitle: "Khám phá activity trong nước và quốc tế",
    type: "Xu hướng",
    count: "32.000+ hoạt động",
    image: baibienImage,
    description: "Khám phá vé tham quan, tour, show diễn và tiện ích du lịch trong cùng một nơi.",
  },
  {
    id: "japan",
    name: "Nhật Bản",
    subtitle: "Xứ sở hoa anh đào",
    type: "Quốc tế",
    count: "4.820 hoạt động",
    image: images.japan,
    description: "Từ công viên chủ đề, bảo tàng số cho tới JR Pass và eSIM, bạn có thể gom toàn bộ trải nghiệm Nhật Bản trên cùng một trang.",
    rating: "8.9",
    reviews: "1219.6K",
    bestMonths: "Tháng 3 - 5, 10 - 11",
    duration: "5 ngày",
    mustVisit: "Núi Phú Sĩ\nChùa Kinkaku-ji",
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    subtitle: "Thủ đô nghìn năm văn hiến",
    type: "Việt Nam",
    count: "680 hoạt động",
    image: images.aquarium,
    description: "Lọc nhanh vé thủy cung, show diễn, city tour và các hoạt động gia đình ngay tại Hà Nội.",
    rating: "8.8",
    reviews: "154.2K",
    bestMonths: "Tháng 9 - 11",
    duration: "3 ngày",
    mustVisit: "Phố cổ\nLăng Bác",
  },
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    subtitle: "Biển đảo và vui chơi giải trí",
    type: "Việt Nam",
    count: "530 hoạt động",
    image: images.sea,
    description: "Một nơi cho vé vui chơi biển, cáp treo, tour 3 đảo và combo trải nghiệm dành cho gia đình.",
    rating: "9.1",
    reviews: "91.4K",
    bestMonths: "Tháng 11 - 4",
    duration: "3 ngày",
    mustVisit: "Hòn Thơm\nSunset Town",
  },
  {
    id: "singapore",
    name: "Singapore",
    subtitle: "City break gọn gàng, hiện đại",
    type: "Quốc tế",
    count: "1.420 hoạt động",
    image: images.city,
    description: "Bạn có thể tìm nhanh công viên chủ đề, city pass, eSIM và attraction nổi bật cho hành trình Singapore.",
    rating: "9.2",
    reviews: "310.8K",
    bestMonths: "Quanh năm",
    duration: "4 ngày",
    mustVisit: "Sentosa\nGardens by the Bay",
  },
];

const quickLinks: Array<{ id: ShortcutId; label: string; icon: typeof Sparkles }> = [
  { id: "kham-pha", label: "Khám phá", icon: Sparkles },
  { id: "diem-tham-quan", label: "Điểm tham quan", icon: Landmark },
  { id: "tour-hoat-dong", label: "Tour & Hoạt động", icon: Waves },
  { id: "can-thiet", label: "Cần thiết cho du lịch", icon: ShieldCheck },
  { id: "tat-ca-hoat-dong", label: "Tất cả các hoạt động", icon: Grid2x2 },
];

const sortOptions: Array<{ id: SortId; label: string }> = [
  { id: "popular", label: "Phổ biến nhất" },
  { id: "price-low", label: "Giá thấp nhất" },
  { id: "rating-high", label: "Đánh giá cao nhất" },
];

const couponTabs = ["Mã nội địa", "Mã quốc tế", "Du thuyền", "Thanh toán"];

const promoCards: PromoItem[] = [
  {
    title: "Mừng đại lễ, sale mê say",
    subtitle: "Ưu đãi tới 50% cho vé tham quan, show diễn và combo vui chơi gia đình.",
    badge: "Ưu đãi khủng tới 50%",
    image: images.sea,
  },
  {
    title: "Du lịch Hàn Quốc",
    subtitle: "Săn deal city pass, vé tham quan và thẻ SIM cho chuyến đi đầu mùa.",
    badge: "Traveloka Exclusive",
    image: images.city,
  },
  {
    title: "Du lịch Malaysia",
    subtitle: "Khóa deal quốc tế giảm sâu cho các lịch trình cao điểm tháng này.",
    badge: "Đặt sớm lợi hơn",
    image: images.japan,
  },
];

const couponCards: CouponItem[] = [
  {
    title: "[VINWONDERS] Giảm đến 2 triệu",
    description: "Giảm thêm đến 500K khi mua từ 2 triệu cho hoạt động nội địa.",
    code: "VINWONDERS26",
    badge: "Sắp hết mã",
  },
  {
    title: "Giảm đến 300K | Vé vui chơi nội địa",
    description: "Đặt tối thiểu 2 triệu hoặc từ 6 vé để nhận mức giảm tốt hơn.",
    code: "VUILENVN",
    badge: "Sắp hết mã",
  },
  {
    title: "Giảm đến 2 triệu | Sun World",
    description: "Ưu đãi cho nhóm bạn và gia đình vào dịp lễ, áp dụng toàn quốc.",
    code: "SUNWORLD",
    badge: "Sắp hết mã",
  },
];

const activityItems: ActivityItem[] = [
  {
    title: "Universal Studios Japan",
    location: "Konohana, Osaka",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 165944,
    image: images.themePark,
    rating: 9,
    reviews: "153.4K đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Công viên giải trí", "Vé tham quan", "Gia đình"],
    perks: ["Vé điện tử", "Xác nhận ngay"],
  },
  {
    title: "Vé vào Cửa Tokyo Disney Resort",
    location: "Tokyo Disney Resort",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 1559874,
    image: images.disney,
    rating: 9.1,
    reviews: "127.4K đánh giá",
    badge: "Easy Refund",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Công viên giải trí", "Vé tham quan", "Easy Refund"],
    perks: ["Easy Refund", "Gia đình"],
  },
  {
    title: "teamLab Planets TOKYO",
    location: "Odaiba, Tokyo",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 723995,
    oldPriceValue: 763343,
    image: images.show,
    rating: 9,
    reviews: "49.7K đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Bảo tàng & Phòng trưng bày", "Điểm mốc", "Vé tham quan"],
    perks: ["Được yêu thích", "Vé điện tử"],
  },
  {
    title: "Scenic Spots of Mt Fuji & Lake Kawaguchi",
    location: "Narusawa, Minamitsuru",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 1294363,
    image: images.mountain,
    rating: 8.8,
    reviews: "10.1K đánh giá",
    badge: "Easy Refund",
    shortcuts: ["tour-hoat-dong", "tat-ca-hoat-dong"],
    filters: ["Tour trong ngày", "Thiên nhiên & động vật", "Easy Refund"],
    perks: ["Tour trong ngày", "Easy Refund"],
  },
  {
    title: "eSIM cho Nhật Bản của Billion Connect",
    location: "Tokyo",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 39948,
    image: images.mobile,
    rating: 9.6,
    reviews: "36 đánh giá",
    shortcuts: ["can-thiet", "tat-ca-hoat-dong"],
    filters: ["Kết nối", "eSIM", "Xác nhận ngay"],
    perks: ["eSIM", "Xác nhận ngay"],
  },
  {
    title: "Vé JR Kansai WIDE Area",
    location: "Tajiri, Sennan",
    destinationId: "japan",
    destinationLabel: "Nhật Bản",
    priceValue: 1988322,
    image: images.transit,
    rating: 8.8,
    reviews: "91.6K đánh giá",
    badge: "Easy Refund",
    shortcuts: ["can-thiet", "tat-ca-hoat-dong"],
    filters: ["Phương tiện vận chuyển", "Easy Refund", "Rail pass"],
    perks: ["Rail pass", "Easy Refund"],
  },
  {
    title: "Lotte World Aquarium | Hà Nội",
    location: "Phú Thượng, Hà Nội",
    destinationId: "ha-noi",
    destinationLabel: "Việt Nam",
    priceValue: 153061,
    oldPriceValue: 190180,
    image: images.aquarium,
    rating: 8.6,
    reviews: "17.2K đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Thiên nhiên & động vật", "Vé tham quan", "Gia đình"],
    perks: ["Gia đình", "Vé điện tử"],
  },
  {
    title: "Vé show múa rối nước Thăng Long",
    location: "Hàng Bạc, Hà Nội",
    destinationId: "ha-noi",
    destinationLabel: "Việt Nam",
    priceValue: 124041,
    image: images.show,
    rating: 8.6,
    reviews: "22.3K đánh giá",
    badge: "Easy Refund",
    shortcuts: ["diem-tham-quan", "tour-hoat-dong", "tat-ca-hoat-dong"],
    filters: ["Sự kiện & Buổi diễn", "Easy Refund", "Vé tham quan"],
    perks: ["Show diễn", "Easy Refund"],
  },
  {
    title: "Tour 3 đảo Phú Quốc bằng cano - 1 ngày",
    location: "Dương Đông, Phú Quốc",
    destinationId: "phu-quoc",
    destinationLabel: "Việt Nam",
    priceValue: 722222,
    image: images.sea,
    rating: 9.2,
    reviews: "28 đánh giá",
    shortcuts: ["tour-hoat-dong", "tat-ca-hoat-dong"],
    filters: ["Tour trong ngày", "Thiên nhiên & động vật", "Easy Access"],
    perks: ["Biển đảo", "Tour trong ngày"],
  },
  {
    title: "Cáp treo Hòn Thơm & công viên nước Aquatopia",
    location: "Hòn Thơm, Phú Quốc",
    destinationId: "phu-quoc",
    destinationLabel: "Việt Nam",
    priceValue: 1314286,
    image: images.sea,
    rating: 8.8,
    reviews: "42 đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Công viên giải trí", "Vé tham quan", "Special Promo"],
    perks: ["Gia đình", "Ưu đãi"],
  },
  {
    title: "Universal Studios Singapore",
    location: "Sentosa, Singapore",
    destinationId: "singapore",
    destinationLabel: "Singapore",
    priceValue: 512691,
    image: images.themePark,
    rating: 9.1,
    reviews: "124.9K đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Công viên giải trí", "Vé tham quan", "Gia đình"],
    perks: ["Được yêu thích", "Vé điện tử"],
  },
  {
    title: "Gardens by the Bay",
    location: "Vịnh Marina, Singapore",
    destinationId: "singapore",
    destinationLabel: "Singapore",
    priceValue: 205076,
    image: images.city,
    rating: 9.3,
    reviews: "160.6K đánh giá",
    shortcuts: ["diem-tham-quan", "tat-ca-hoat-dong"],
    filters: ["Điểm mốc", "Vé tham quan", "Mới trên Traveloka"],
    perks: ["Điểm mốc", "Xác nhận ngay"],
  },
  {
    title: "Fast-track sân bay kèm ưu tiên đưa đón",
    location: "Tân Sơn Nhất, TP.HCM",
    destinationId: "any",
    destinationLabel: "Việt Nam",
    priceValue: 833762,
    image: images.transit,
    rating: 8.6,
    reviews: "3 đánh giá",
    shortcuts: ["can-thiet", "tat-ca-hoat-dong"],
    filters: ["Dịch vụ trong sân bay", "Đưa đón sân bay", "Easy Access"],
    perks: ["Ưu tiên sân bay", "Easy Access"],
  },
];

const filterGroupsByShortcut: Record<Exclude<ShortcutId, "kham-pha">, FilterGroup[]> = {
  "diem-tham-quan": [
    {
      title: "Điểm tham quan",
      options: [
        "Công viên giải trí",
        "Thiên nhiên & động vật",
        "Bảo tàng & Phòng trưng bày",
        "Điểm mốc",
        "Sự kiện & Buổi diễn",
        "Vé tham quan",
      ],
    },
    { title: "Thêm bộ lọc", options: ["Easy Refund", "Gia đình", "Special Promo", "Mới trên Traveloka"] },
  ],
  "tour-hoat-dong": [
    { title: "Tour & Hoạt động", options: ["Tour trong ngày", "Thiên nhiên & động vật", "Easy Access", "Easy Refund"] },
    { title: "Thêm bộ lọc", options: ["Show diễn", "Biển đảo", "Gia đình", "Ưu đãi"] },
  ],
  "can-thiet": [
    { title: "Cần thiết cho du lịch", options: ["Kết nối", "eSIM", "Phương tiện vận chuyển", "Dịch vụ trong sân bay", "Đưa đón sân bay"] },
    { title: "Thêm bộ lọc", options: ["Easy Access", "Easy Refund", "Rail pass", "Xác nhận ngay"] },
  ],
  "tat-ca-hoat-dong": [
    { title: "Danh mục phổ biến", options: ["Công viên giải trí", "Điểm mốc", "Tour trong ngày", "Kết nối", "Phương tiện vận chuyển"] },
    { title: "Thêm bộ lọc", options: ["Easy Refund", "Gia đình", "Special Promo", "Xác nhận ngay"] },
  ],
};

function coverStyle(
  image: string,
  overlay = "linear-gradient(180deg, rgba(10, 25, 42, 0.06) 0%, rgba(10, 25, 42, 0.72) 100%)",
): CSSProperties {
  return { backgroundImage: `${overlay}, url(${image})` };
}

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="activity-customer__section-head">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <span className="activity-customer__section-arrow" aria-hidden="true">
        <ChevronRight size={18} />
      </span>
    </div>
  );
}

function PromoCardView({ item }: { item: PromoItem }) {
  return (
    <article className="activity-customer__promo-card" style={coverStyle(item.image, "linear-gradient(180deg, rgba(18, 42, 80, 0.08) 0%, rgba(18, 42, 80, 0.58) 100%)")}>
      <span>{item.badge}</span>
      <strong>{item.title}</strong>
      <p>{item.subtitle}</p>
    </article>
  );
}

function ActivityCard({ item }: { item: ActivityItem }) {
  return (
    <article className="activity-customer__listing-card">
      <div className="activity-customer__listing-media" style={coverStyle(item.image)}>
        {item.badge ? <span className="activity-customer__listing-badge">{item.badge}</span> : null}
        <button type="button" className="activity-customer__listing-bookmark" aria-label={`Lưu ${item.title}`}>
          <Bookmark size={16} />
        </button>
      </div>
      <div className="activity-customer__listing-body">
        <div className="activity-customer__listing-category">{item.destinationLabel}</div>
        <h3>{item.title}</h3>
        <div className="activity-customer__listing-location">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>
        <div className="activity-customer__listing-rating">
          <span className="activity-customer__listing-rating-score">
            <Star size={14} />
            {item.rating.toFixed(1)}
          </span>
          <span>{item.reviews}</span>
        </div>
        <div className="activity-customer__listing-chips">
          {item.perks.slice(0, 2).map((perk) => (
            <span key={perk} className="activity-customer__listing-chip">
              {perk}
            </span>
          ))}
        </div>
        <div className="activity-customer__listing-price">
          {item.oldPriceValue ? <small>{formatVnd(item.oldPriceValue)}</small> : null}
          <strong>{formatVnd(item.priceValue)}</strong>
        </div>
      </div>
    </article>
  );
}

export default function CustomerActivity() {
  const destinationMenuRef = useRef<HTMLDivElement | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState(destinations[0].id);
  const [isDestinationMenuOpen, setIsDestinationMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeShortcut, setActiveShortcut] = useState<ShortcutId>("kham-pha");
  const [selectedCouponTab, setSelectedCouponTab] = useState(couponTabs[0]);
  const [sortBy, setSortBy] = useState<SortId>("popular");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState(4000000);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const selectedDestination = destinations.find((item) => item.id === selectedDestinationId) ?? destinations[0];
  const isDestinationSelected = selectedDestination.id !== "any";
  const activeShortcutMeta = quickLinks.find((item) => item.id === activeShortcut) ?? quickLinks[0];
  const searchTerm = searchValue.trim().toLowerCase();
  const currentFilterGroups =
    activeShortcut === "kham-pha" ? filterGroupsByShortcut["tat-ca-hoat-dong"] : filterGroupsByShortcut[activeShortcut];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destinationMenuRef.current && !destinationMenuRef.current.contains(event.target as Node)) {
        setIsDestinationMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedFilters([]);
  }, [activeShortcut, selectedDestinationId]);

  function handleShortcutClick(shortcutId: ShortcutId) {
    setActiveShortcut(shortcutId);
    setIsDestinationMenuOpen(false);
  }

  function handleSearch() {
    setIsDestinationMenuOpen(false);
    setActiveShortcut("tat-ca-hoat-dong");
  }

  function handleDestinationSelect(destinationId: string) {
    setSelectedDestinationId(destinationId);
    setIsDestinationMenuOpen(false);
  }

  function handleToggleFilter(filterValue: string) {
    setSelectedFilters((currentValue) =>
      currentValue.includes(filterValue)
        ? currentValue.filter((item) => item !== filterValue)
        : [...currentValue, filterValue],
    );
  }

  function handleCopy(code: string) {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code);
    }

    setCopiedCode(code);
    window.setTimeout(() => {
      setCopiedCode((currentValue) => (currentValue === code ? null : currentValue));
    }, 1600);
  }

  const heroTitle = isDestinationSelected ? selectedDestination.name : "Du lịch";
  const heroCrumb = isDestinationSelected ? selectedDestination.name : activeShortcutMeta.label;
  const heroDescription = isDestinationSelected
    ? `Khám phá ${activeShortcutMeta.label.toLowerCase()} tại ${selectedDestination.name}, lọc theo giá, loại hình và tiện ích trước khi đặt.`
    : selectedDestination.description;

  const featuredActivities = activityItems
    .filter((item) => !isDestinationSelected || item.destinationId === selectedDestination.id || item.destinationId === "any")
    .filter((item) => item.shortcuts.includes("diem-tham-quan") || item.shortcuts.includes("tour-hoat-dong"))
    .slice(0, 6);

  const scopedResults = activityItems
    .filter((item) => !isDestinationSelected || item.destinationId === selectedDestination.id || item.destinationId === "any")
    .filter((item) => activeShortcut === "kham-pha" || activeShortcut === "tat-ca-hoat-dong" || item.shortcuts.includes(activeShortcut))
    .filter((item) => item.priceValue <= maxBudget)
    .filter((item) => {
      if (!searchTerm) {
        return true;
      }

      return [item.title, item.location, item.destinationLabel, item.filters.join(" "), item.perks.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);
    })
    .filter((item) => {
      if (!selectedFilters.length) {
        return true;
      }

      return selectedFilters.every(
        (filterValue) => item.filters.includes(filterValue) || item.perks.includes(filterValue),
      );
    });

  const sortedResults = [...scopedResults].sort((leftItem, rightItem) => {
    if (sortBy === "price-low") {
      return leftItem.priceValue - rightItem.priceValue;
    }

    if (sortBy === "rating-high") {
      return rightItem.rating - leftItem.rating;
    }

    return (
      rightItem.rating * 100 - rightItem.priceValue / 2500 - (leftItem.rating * 100 - leftItem.priceValue / 2500)
    );
  });

  return (
    <main className="activity-customer">
      <section
        className="activity-customer__hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.34) 0%, rgba(8, 18, 31, 0.24) 24%, rgba(8, 18, 31, 0.86) 100%), linear-gradient(90deg, rgba(8, 18, 31, 0.42) 0%, rgba(8, 18, 31, 0.08) 100%), url(${selectedDestination.image})`,
        }}
      >
        <div className="customer-shell__container">
          <div className="activity-customer__hero-copy">
            <div className="activity-customer__hero-path">
              <span>Xperience</span>
              <small>/ {heroCrumb}</small>
            </div>

            <div className="activity-customer__hero-heading">
              <h1>{heroTitle}</h1>
              {selectedDestination.rating && selectedDestination.reviews ? (
                <div className="activity-customer__hero-rating">
                  <Star size={14} />
                  <strong>{selectedDestination.rating}</strong>
                  <span>{selectedDestination.reviews} của khách hàng Traveloka</span>
                </div>
              ) : null}
            </div>

            <p className="activity-customer__hero-description">{heroDescription}</p>

            <div
              className={
                isDestinationSelected
                  ? "activity-customer__hero-search activity-customer__hero-search--destination"
                  : "activity-customer__hero-search"
              }
            >
              <div className="activity-customer__hero-controls" ref={destinationMenuRef}>
                <div className="activity-customer__hero-row">
                  <button
                    type="button"
                    className="activity-customer__destination-field"
                    onClick={() => setIsDestinationMenuOpen((currentValue) => !currentValue)}
                    aria-expanded={isDestinationMenuOpen}
                  >
                    <MapPinned size={18} />
                    <span className="activity-customer__field-copy">
                      <small>{isDestinationSelected ? "Đang xem" : "Điểm đến"}</small>
                      <strong>{isDestinationSelected ? selectedDestination.name : "Chọn một điểm đến"}</strong>
                    </span>
                    <ChevronDown size={18} />
                  </button>

                  <label className="activity-customer__search-input">
                    <Search size={18} />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder="Tìm kiếm địa điểm hoặc hoạt động"
                    />
                  </label>

                  <button type="button" className="activity-customer__search-button" onClick={handleSearch}>
                    Tìm kiếm
                  </button>
                </div>

                {isDestinationMenuOpen ? (
                  <div className="activity-customer__destination-panel">
                    <div className="activity-customer__destination-panel-title">Điểm đến phổ biến</div>
                    <div className="activity-customer__destination-list">
                      {destinations.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={
                            item.id === selectedDestinationId
                              ? "activity-customer__destination-card is-active"
                              : "activity-customer__destination-card"
                          }
                          onClick={() => handleDestinationSelect(item.id)}
                        >
                          <span className="activity-customer__destination-copy">
                            <strong>{item.name}</strong>
                            <small>{item.subtitle}</small>
                          </span>
                          <span className="activity-customer__destination-meta">
                            <span className="activity-customer__destination-tag">{item.type}</span>
                            <span className="activity-customer__destination-count">{item.count}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {isDestinationSelected ? (
                <aside className="activity-customer__hero-insights">
                  <article className="activity-customer__hero-insight">
                    <small>Thời gian tốt nhất</small>
                    <strong>{selectedDestination.bestMonths}</strong>
                    <p>Lý tưởng cho lịch trình linh hoạt</p>
                  </article>
                  <article className="activity-customer__hero-insight">
                    <small>Thời lượng đề xuất</small>
                    <strong>{selectedDestination.duration}</strong>
                    <p>Dễ kết hợp tham quan và vui chơi</p>
                  </article>
                  <article className="activity-customer__hero-insight">
                    <small>Phải ghé thăm</small>
                    <strong>{selectedDestination.mustVisit}</strong>
                    <p>Gợi ý mở đầu chuyến đi</p>
                  </article>
                </aside>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="customer-shell__container">
        <nav className="activity-customer__shortcut-bar">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeShortcut;

            return (
              <button
                key={item.id}
                type="button"
                className={isActive ? "activity-customer__shortcut is-active" : "activity-customer__shortcut"}
                onClick={() => handleShortcutClick(item.id)}
              >
                <span className="activity-customer__shortcut-icon">
                  <Icon size={18} />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeShortcut === "kham-pha" ? (
        <>
          <section className="activity-customer__section" id="activity-overview">
            <div className="customer-shell__container">
              <SectionHeader
                title={isDestinationSelected ? `Khuyến mãi Xperience tại ${selectedDestination.name}` : "Khuyến mãi Xperience hiện hành"}
                subtitle="Giữ nguyên phần overview để người dùng có thể xem deal trước khi lọc sâu hơn"
              />
              <div className="activity-customer__promo-grid">
                {promoCards.map((item) => (
                  <PromoCardView key={item.title} item={item} />
                ))}
              </div>
            </div>
          </section>

          <section className="activity-customer__section">
            <div className="customer-shell__container">
              <SectionHeader
                title="Thu thập mã ưu đãi Xperience"
                subtitle="Các chip vẫn giữ cảm giác landing page giống mockup"
              />
              <div className="activity-customer__tab-row">
                {couponTabs.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={item === selectedCouponTab ? "activity-customer__chip is-active" : "activity-customer__chip"}
                    onClick={() => setSelectedCouponTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="activity-customer__coupon-grid">
                {couponCards.map((item) => (
                  <article key={item.code} className="activity-customer__coupon-card">
                    <span className="activity-customer__coupon-badge">{item.badge}</span>
                    <div className="activity-customer__coupon-top">
                      <div className="activity-customer__coupon-icon">
                        <Gift size={18} />
                      </div>
                      <div className="activity-customer__coupon-copy">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                    <div className="activity-customer__coupon-footer">
                      <div>
                        <small>Mã ưu đãi</small>
                        <strong>{item.code}</strong>
                      </div>
                      <button type="button" onClick={() => handleCopy(item.code)}>
                        <Copy size={14} />
                        {copiedCode === item.code ? "Đã chép" : "Copy"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="activity-customer__section">
            <div className="customer-shell__container">
              <SectionHeader
                title={isDestinationSelected ? `Hoạt động nổi bật ở ${selectedDestination.name}` : "Hoạt động nổi bật"}
                subtitle="Các thẻ preview trước khi người dùng bấm sang shortcut lọc"
              />
              <div className="activity-customer__listing-grid">
                {featuredActivities.map((item) => (
                  <ActivityCard key={`${item.destinationId}-${item.title}`} item={item} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      <section className="activity-customer__section" id="activity-results">
        <div className="customer-shell__container">
          <SectionHeader
            title={
              activeShortcut === "kham-pha"
                ? "Tiếp tục lọc hoạt động"
                : isDestinationSelected
                  ? `${activeShortcutMeta.label} tại ${selectedDestination.name}`
                  : `Khám phá ${activeShortcutMeta.label.toLowerCase()}`
            }
            subtitle="Khi bấm shortcut bar hoặc tìm kiếm, khu này hoạt động như search results riêng"
          />

          <div className="activity-customer__results-shell">
            <aside className="activity-customer__filters">
              <article className="activity-customer__filter-card">
                <div className="activity-customer__filter-head">
                  <strong>Giá</strong>
                  <span>Tối đa {formatVnd(maxBudget)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4000000}
                  step={50000}
                  value={maxBudget}
                  onChange={(event) => setMaxBudget(Number(event.target.value))}
                  className="activity-customer__price-range"
                />
                <div className="activity-customer__price-scale">
                  <span>0 VND</span>
                  <span>4.000.000 VND+</span>
                </div>
              </article>

              {currentFilterGroups.map((group) => (
                <article key={group.title} className="activity-customer__filter-card">
                  <div className="activity-customer__filter-group-head">
                    <strong>{group.title}</strong>
                    <ChevronDown size={16} />
                  </div>
                  <div className="activity-customer__filter-options">
                    {group.options.map((option) => (
                      <label key={option} className="activity-customer__filter-option">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(option)}
                          onChange={() => handleToggleFilter(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </aside>

            <div className="activity-customer__results-content">
              <div className="activity-customer__results-toolbar">
                <div className="activity-customer__results-summary">
                  <strong>{sortedResults.length} kết quả</strong>
                  <p>
                    {isDestinationSelected
                      ? `Gợi ý đã lọc cho ${selectedDestination.name}`
                      : "Bạn có thể tiếp tục tinh chỉnh theo giá và loại hoạt động"}
                  </p>
                </div>

                <label className="activity-customer__sort-box">
                  <span>Xếp theo:</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortId)}>
                    {sortOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {sortedResults.length ? (
                <div className="activity-customer__results-grid">
                  {sortedResults.map((item) => (
                    <ActivityCard key={`${item.destinationId}-${item.title}`} item={item} />
                  ))}
                </div>
              ) : (
                <div className="activity-customer__empty">
                  <strong>Chưa có kết quả khớp bộ lọc hiện tại.</strong>
                  <p>Thử tăng mức giá, bỏ bớt bộ lọc hoặc chọn điểm đến khác.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
