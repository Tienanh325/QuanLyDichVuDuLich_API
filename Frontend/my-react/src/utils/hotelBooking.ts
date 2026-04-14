import baibienImage from "../assets/images/baibien.jpg";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";

export type HotelTagId = "sale" | "breakfast" | "family" | "freeCancel";
export type HotelAmenityId = "breakfast" | "airport" | "family" | "parking" | "mountain" | "balcony";
export type HotelTypeId = "hotel" | "apartment" | "villa";

export type HotelRoomRate = {
  id: string;
  label: string;
  mealPlan: string;
  bedInfo: string;
  occupancy: number;
  perks: string[];
  nightlyPrice: number;
  originalPrice?: number;
  roomsLeft: number;
  payAtHotel: boolean;
  freeCancellation: boolean;
  points: number;
};

export type HotelRoomGroup = {
  id: string;
  name: string;
  summary?: string;
  image: string;
  area: string;
  amenities: string[];
  rates: HotelRoomRate[];
};

export type HotelNearbyGroup = {
  title: string;
  items: Array<{
    name: string;
    distance: string;
  }>;
};

export type HotelFacilityGroup = {
  title: string;
  items: string[];
};

export type HotelPolicySection = {
  title: string;
  body: string[];
};

export type HotelFaqItem = {
  question: string;
  answer: string;
};

export type HotelScoreItem = {
  label: string;
  score: number;
};

export type HotelReview = {
  id: string;
  author: string;
  score: number;
  timeAgo: string;
  text: string;
  helpfulCount: number;
  tripType: string;
};

export type HotelProperty = {
  id: string;
  name: string;
  subtitle?: string;
  district: string;
  districtKey: string;
  rating: number;
  reviewCount: number;
  propertyType: string;
  propertyTypeKey: HotelTypeId;
  stars: number;
  nightlyPrice: number;
  totalPrice: number;
  originalPrice?: number;
  highlight: string;
  reward: string;
  amenities: string[];
  amenityIds: HotelAmenityId[];
  benefits: string[];
  promoTags: string[];
  tagIds: HotelTagId[];
  gallery: string[];
  address: string;
  locationTip: string;
  description: string;
  notice: string;
  guestLoveTags: string[];
  topAmenities: string[];
  roomGroups: HotelRoomGroup[];
  nearbyGroups: HotelNearbyGroup[];
  facilityGroups: HotelFacilityGroup[];
  policySections: HotelPolicySection[];
  faqItems: HotelFaqItem[];
  scoreBreakdown: HotelScoreItem[];
  reviews: HotelReview[];
  alternativeHotelIds: string[];
  checkInFrom: string;
  checkOutBefore: string;
};

type HotelSeed = Omit<
  HotelProperty,
  | "totalPrice"
  | "gallery"
  | "roomGroups"
  | "guestLoveTags"
  | "topAmenities"
  | "facilityGroups"
  | "policySections"
  | "faqItems"
  | "scoreBreakdown"
  | "reviews"
  | "alternativeHotelIds"
>;

const roomImages = [baibienImage, thuongHieuImage, baibienImage, thuongHieuImage, baibienImage] as const;

function roundCurrency(value: number) {
  return Math.round(value / 1000) * 1000;
}

function buildGallery() {
  return [baibienImage, thuongHieuImage, baibienImage, thuongHieuImage, baibienImage, thuongHieuImage];
}

function buildGuestLoveTags(rating: number) {
  if (rating >= 9) {
    return ["Dịch vụ xuất sắc", "Không gian sạch sẽ", "Vị trí thuận tiện"];
  }

  if (rating >= 8.5) {
    return ["Nhân viên thân thiện", "Không gian phòng", "Khu vực xung quanh"];
  }

  return ["Phù hợp nghỉ ngắn ngày", "Giá hợp lý", "Thuận tiện di chuyển"];
}

function buildTopAmenities(propertyTypeKey: HotelTypeId) {
  const base = ["Lễ tân 24h", "Wifi miễn phí", "Máy nước nóng"];

  if (propertyTypeKey !== "villa") {
    base.push("Thang máy");
  }

  if (propertyTypeKey === "apartment") {
    base.push("Bếp mini");
  } else {
    base.push("Chỗ đậu xe");
  }

  return base;
}

function buildFacilities(propertyTypeKey: HotelTypeId): HotelFacilityGroup[] {
  return [
    {
      title: "Các tiện ích lân cận",
      items: ["Máy ATM/Ngân hàng", "Cửa hàng quà tặng", "Siêu thị mini", "Giặt ủi", "Hiệu làm tóc"],
    },
    {
      title: "Tiện nghi phòng",
      items:
        propertyTypeKey === "apartment"
          ? ["TV", "Tủ lạnh", "Máy sấy tóc", "Bàn làm việc", "Bếp mini"]
          : ["TV", "Tủ lạnh", "Máy sấy tóc", "Bàn làm việc", "Phòng tắm vòi sen"],
    },
    {
      title: "Dịch vụ khách sạn",
      items: ["Quầy lễ tân", "Lễ tân 24h", "Dịch vụ giữ hành lý", "Đội ngũ nhân viên đa ngôn ngữ", "Hỗ trợ đặt tour"],
    },
    {
      title: "Tiện nghi công cộng",
      items: propertyTypeKey === "villa" ? ["Wifi tại khu vực chung", "Khu vườn", "Khu sinh hoạt chung"] : ["Thang máy", "Wifi tại khu vực chung"],
    },
    {
      title: "Vận chuyển",
      items: ["Bãi đậu xe", "Đưa đón theo yêu cầu"],
    },
    {
      title: "Kết nối mạng",
      items: ["Wifi (miễn phí)"],
    },
  ];
}

function buildPolicies(name: string): HotelPolicySection[] {
  return [
    {
      title: "Thời gian nhận phòng/trả phòng",
      body: ["Giờ nhận phòng: từ 14:00", "Giờ trả phòng: trước 12:00"],
    },
    {
      title: "Hướng dẫn nhận phòng chung",
      body: [
        `Trẻ em dưới 6 tuổi được ở miễn phí nếu dùng chung giường sẵn có tại ${name}.`,
        "Phí giường phụ có thể thay đổi theo từng loại phòng và thời gian lưu trú.",
        "Các yêu cầu đặc biệt sẽ phụ thuộc vào tình trạng phòng trống khi nhận phòng.",
      ],
    },
    {
      title: "Nhận phòng sớm",
      body: [
        "Bạn có thể yêu cầu nhận phòng sớm với phụ phí. Vui lòng liên hệ cơ sở lưu trú để xác nhận trước ngày đến.",
      ],
    },
  ];
}

function buildFaqItems(name: string, nightlyPrice: number): HotelFaqItem[] {
  return [
    {
      question: `Những tiện ích tại ${name} là gì?`,
      answer: "Wifi miễn phí, lễ tân 24h, chỗ đậu xe, máy nước nóng và các tiện nghi phòng cơ bản luôn sẵn sàng cho khách lưu trú.",
    },
    {
      question: `${name} có mức giá khoảng bao nhiêu?`,
      answer: `Các lựa chọn phòng hiện bắt đầu từ khoảng ${roundCurrency(nightlyPrice).toLocaleString("vi-VN")} VND mỗi đêm, chưa bao gồm thuế và phí.`,
    },
    {
      question: `Thời gian nhận phòng và trả phòng của ${name}?`,
      answer: "Nhận phòng từ 14:00 và trả phòng trước 12:00.",
    },
    {
      question: `${name} có phù hợp cho gia đình không?`,
      answer: "Có. Nhiều hạng phòng cho phép ở 2 đến 4 khách, phù hợp nhóm bạn và gia đình nhỏ.",
    },
  ];
}

function buildScoreBreakdown(rating: number): HotelScoreItem[] {
  return [
    { label: "Vệ sinh", score: Math.max(7.5, Math.min(9.8, rating)) },
    { label: "Tiện nghi phòng", score: Math.max(7.3, Math.min(9.8, rating - 0.1)) },
    { label: "Đồ ăn", score: Math.max(7.1, Math.min(9.4, rating - 0.5)) },
    { label: "Vị trí", score: Math.max(7.4, Math.min(9.9, rating + 0.2)) },
    { label: "Dịch vụ & tiện ích", score: Math.max(7.2, Math.min(9.7, rating - 0.1)) },
  ];
}

function buildReviews(name: string, district: string, rating: number): HotelReview[] {
  return [
    {
      id: `${name}-review-1`,
      author: "Khách đã xác minh",
      score: Math.max(7.8, rating + 0.4),
      timeAgo: "Đánh giá cách đây 5 tuần",
      text: `${name} sạch sẽ, gần khu trung tâm ${district.toLowerCase()} nên đi lại khá tiện. Nhân viên hỗ trợ nhanh khi cần thêm khăn và nước uống.`,
      helpfulCount: 3,
      tripType: "Giải trí",
    },
    {
      id: `${name}-review-2`,
      author: "Meo",
      score: Math.max(7.4, rating - 0.3),
      timeAgo: "Đánh giá cách đây 6 tuần",
      text: "Chỗ đậu xe ổn, phòng gọn gàng và đúng hình. Check-in nhanh, phù hợp cho chuyến đi ngắn ngày cùng gia đình.",
      helpfulCount: 3,
      tripType: "Gia đình",
    },
    {
      id: `${name}-review-3`,
      author: "N***n",
      score: Math.max(7.1, rating),
      timeAgo: "Đánh giá cách đây 7 tuần",
      text: "Nhân viên thân thiện, phòng sạch sẽ, tiện nghi vừa đủ. Tôi sẽ cân nhắc quay lại nếu có dịp đến Đà Lạt lần sau.",
      helpfulCount: 1,
      tripType: "Giải trí",
    },
    {
      id: `${name}-review-4`,
      author: "pham p. c.",
      score: Math.min(10, rating + 0.8),
      timeAgo: "Đánh giá cách đây 9 tuần",
      text: `Khách sạn gần trung tâm, phù hợp mức giá. Không gian tại ${name} khá yên tĩnh vào ban đêm.`,
      helpfulCount: 5,
      tripType: "Cặp đôi",
    },
  ];
}

function buildNearbyGroups(address: string): HotelNearbyGroup[] {
  return [
    {
      title: "Địa điểm lân cận",
      items: [
        { name: address.split(",")[0], distance: "187 m" },
        { name: "Chợ đêm Đà Lạt", distance: "334 m" },
        { name: "3D World Đà Lạt", distance: "351 m" },
        { name: "Hồ Xuân Hương", distance: "707 m" },
      ],
    },
    {
      title: "Trung tâm giao thông",
      items: [
        { name: "Ga Đà Lạt", distance: "2.09 km" },
        { name: "Nhà ga cáp treo Đà Lạt", distance: "2.15 km" },
      ],
    },
    {
      title: "Trung tâm giải trí",
      items: [
        { name: "Chợ Đà Lạt/ Chợ Đêm Đà Lạt", distance: "397 m" },
        { name: "Vườn hoa thành phố Đà Lạt", distance: "1.93 km" },
        { name: "Quảng trường Lâm Viên", distance: "1.10 km" },
      ],
    },
  ];
}

function createRate(
  roomGroupId: string,
  rateId: string,
  label: string,
  nightlyPrice: number,
  options: Partial<Omit<HotelRoomRate, "id" | "label" | "nightlyPrice">> = {},
): HotelRoomRate {
  return {
    id: `${roomGroupId}-${rateId}`,
    label,
    mealPlan: "Không gồm bữa sáng",
    bedInfo: "1 giường đôi",
    occupancy: 2,
    perks: [],
    nightlyPrice,
    originalPrice: roundCurrency(nightlyPrice * 1.24),
    roomsLeft: 3,
    payAtHotel: false,
    freeCancellation: false,
    points: Math.max(900, Math.round(nightlyPrice / 250)),
    ...options,
  };
}

function buildRoomGroups(basePrice: number): HotelRoomGroup[] {
  const superiorBase = roundCurrency(basePrice);
  const deluxeBase = roundCurrency(basePrice * 1.29);
  const suiteBase = roundCurrency(basePrice * 1.44);
  const familyBase = roundCurrency(basePrice * 1.62);
  const familySuiteBase = roundCurrency(basePrice * 1.78);

  return [
    {
      id: "superior-double",
      name: "Phòng Đôi Superior",
      image: roomImages[0],
      area: "18.0 m²",
      amenities: ["Vòi tắm đứng", "Nước nóng", "Wifi miễn phí"],
      rates: [
        createRate("superior-double", "standard", "Superior Double Room - Standard", superiorBase, {
          perks: [],
          roomsLeft: 1,
          points: 1074,
        }),
        createRate("superior-double", "flex", "Superior Double Room - Standard", roundCurrency(superiorBase * 1.06), {
          payAtHotel: true,
          freeCancellation: true,
          perks: ["Thanh toán tại khách sạn", "Thanh toán khi bạn nhận phòng tại nơi ở", "Áp dụng chính sách hủy phòng"],
          roomsLeft: 1,
          points: 1186,
        }),
      ],
    },
    {
      id: "deluxe-double",
      name: "Phòng Đôi Sang Trọng",
      image: roomImages[1],
      area: "26.0 m²",
      amenities: ["Vòi tắm đứng", "Nước nóng", "Wifi miễn phí"],
      rates: [
        createRate("deluxe-double", "flex", "Deluxe Double Room - Standard", deluxeBase, {
          payAtHotel: true,
          freeCancellation: true,
          perks: ["Thanh toán tại khách sạn", "Thanh toán khi bạn nhận phòng tại nơi ở", "Áp dụng chính sách hủy phòng"],
          roomsLeft: 3,
          points: 1459,
        }),
        createRate("deluxe-double", "nonref", "Deluxe Double Room - Standard", roundCurrency(deluxeBase * 1.05), {
          perks: [],
          roomsLeft: 3,
          points: 1502,
        }),
      ],
    },
    {
      id: "suite",
      name: "Suite",
      image: roomImages[2],
      area: "26.0 m²",
      amenities: ["Vòi tắm đứng", "Nước nóng", "Wifi miễn phí"],
      rates: [
        createRate("suite", "flex", "Suite - Standard", suiteBase, {
          payAtHotel: true,
          freeCancellation: true,
          perks: ["Thanh toán tại khách sạn", "Thanh toán khi bạn nhận phòng tại nơi ở", "Áp dụng chính sách hủy phòng"],
          roomsLeft: 3,
          points: 1625,
        }),
        createRate("suite", "nonref", "Suite - Standard", roundCurrency(suiteBase * 1.05), {
          points: 1712,
          roomsLeft: 3,
        }),
      ],
    },
    {
      id: "family-room",
      name: "Phòng Gia Đình",
      image: roomImages[3],
      area: "26.0 m²",
      amenities: ["Vòi tắm đứng", "Nước nóng", "Wifi miễn phí"],
      rates: [
        createRate("family-room", "flex", "Family Room - Standard", familyBase, {
          bedInfo: "2 giường đôi",
          occupancy: 4,
          payAtHotel: true,
          freeCancellation: true,
          perks: ["Thanh toán tại khách sạn", "Thanh toán khi bạn nhận phòng tại nơi ở", "Áp dụng chính sách hủy phòng"],
          roomsLeft: 2,
          points: 1824,
        }),
        createRate("family-room", "nonref", "Family Room - Standard", roundCurrency(familyBase * 1.05), {
          bedInfo: "2 giường đôi",
          occupancy: 4,
          roomsLeft: 2,
          points: 1890,
        }),
      ],
    },
    {
      id: "family-suite",
      name: "Family Suite",
      summary: "Phòng lớn hơn, ở thoải mái hơn",
      image: roomImages[4],
      area: "32.0 m²",
      amenities: ["Vòi tắm đứng", "Nước nóng", "Wifi miễn phí"],
      rates: [
        createRate("family-suite", "flex", "Family Suite - Standard", familySuiteBase, {
          bedInfo: "2 giường đôi",
          occupancy: 4,
          payAtHotel: true,
          freeCancellation: true,
          perks: ["Thanh toán tại khách sạn", "Thanh toán khi bạn nhận phòng tại nơi ở", "Áp dụng chính sách hủy phòng"],
          roomsLeft: 2,
          points: 1990,
        }),
        createRate("family-suite", "nonref", "Family Suite - Standard", roundCurrency(familySuiteBase * 1.05), {
          bedInfo: "2 giường đôi",
          occupancy: 4,
          roomsLeft: 2,
          points: 2075,
        }),
      ],
    },
  ];
}

const hotelSeeds: HotelSeed[] = [
  {
    id: "the-grace",
    name: "The Grace Hotel Dalat",
    district: "Phường 1",
    districtKey: "ward1",
    rating: 8.8,
    reviewCount: 1891,
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 3,
    nightlyPrice: 265711,
    originalPrice: 424242,
    highlight: "Giá phòng/đêm tốt",
    reward: "1.248 Xu",
    amenities: ["Nhà hàng", "Bữa sáng", "Khu trung tâm"],
    amenityIds: ["breakfast"],
    benefits: ["Miễn phí hủy phòng", "Thanh toán tại khách sạn"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Ưu đãi phòng cuối tuần"],
    tagIds: ["sale", "breakfast", "freeCancel"],
    address: "51 Nam Kỳ Khởi Nghĩa, Phường 1, Đà Lạt, Lâm Đồng, Việt Nam, 671552",
    locationTip: "Cách khu vui chơi giải trí, chợ đêm và trung tâm thành phố chỉ vài phút di chuyển.",
    description:
      "The Grace Hotel Dalat là lựa chọn lưu trú thuận tiện cho chuyến đi công tác hoặc nghỉ ngơi cuối tuần với vị trí gần chợ đêm, ga Đà Lạt và nhiều quán cà phê nổi tiếng.",
    notice:
      "Quầy lễ tân trực 24 giờ luôn sẵn sàng hỗ trợ khách trong suốt thời gian lưu trú. Sống Wifi phủ khắp cơ sở lưu trú.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
  {
    id: "nature",
    name: "Nature Hotel - Le Hong Phong",
    district: "Phường 4",
    districtKey: "ward4",
    rating: 8.7,
    reviewCount: 76,
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 342436,
    highlight: "View núi",
    reward: "1.365 Xu",
    amenities: ["Khu vui chơi trẻ em", "Cho thuê xe hơi", "Trung tâm thể dục"],
    amenityIds: ["family", "parking", "mountain"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["family", "freeCancel"],
    address: "55 Lê Hồng Phong, Phường 4, Đà Lạt, Lâm Đồng, Việt Nam",
    locationTip: "Khách sạn nằm trên tuyến đường yên tĩnh, phù hợp nghỉ ngơi và ngắm thành phố về đêm.",
    description:
      "Nature Hotel - Le Hong Phong có lợi thế về tầm nhìn đồi thông và không khí mát mẻ đặc trưng của Đà Lạt. Phù hợp cho các cặp đôi và gia đình nhỏ muốn ở khu vực yên tĩnh.",
    notice: "Một số hạng phòng có ban công riêng và hỗ trợ nhận phòng linh hoạt theo tình trạng trống.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
  {
    id: "lata",
    name: "LATA Hotel & Apartments",
    district: "Phường 6",
    districtKey: "ward6",
    rating: 9.6,
    reviewCount: 634,
    propertyType: "Căn hộ",
    propertyTypeKey: "apartment",
    stars: 4,
    nightlyPrice: 441558,
    highlight: "Vị trí tốt",
    reward: "1.640 Xu",
    amenities: ["Nhà bếp mini", "Sân hiên", "Khu vực ngoài trời"],
    amenityIds: ["balcony", "family"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Ưu đãi chốt sớm"],
    tagIds: ["freeCancel"],
    address: "12 Nguyễn Văn Trỗi, Phường 6, Đà Lạt, Lâm Đồng, Việt Nam",
    locationTip: "Thuận tiện cho khách lưu trú dài ngày nhờ có bếp mini và không gian sinh hoạt riêng.",
    description:
      "LATA Hotel & Apartments kết hợp cảm giác riêng tư của căn hộ với dịch vụ cơ bản của khách sạn. Không gian rộng rãi phù hợp nhóm bạn hoặc gia đình muốn ở trung tâm nhưng vẫn thoải mái.",
    notice: "Một số căn hộ có khu vực tiếp khách riêng, phù hợp cho lưu trú từ 2 đêm trở lên.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
  {
    id: "bazan",
    name: "Khách sạn Bazan Hotel",
    subtitle: "(Bazan Hotel)",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 9,
    reviewCount: 50,
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 234545,
    highlight: "Sale lễ",
    reward: "1.180 Xu",
    amenities: ["Đón khách tại ga tàu", "Giữ trẻ", "Cho thuê xe hơi"],
    amenityIds: ["parking", "family"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Một số phòng có Extra Benefit"],
    tagIds: ["sale", "family", "freeCancel"],
    address: "23 Phan Bội Châu, Phường 3, Đà Lạt, Lâm Đồng, Việt Nam",
    locationTip: "Dễ dàng kết nối chợ Đà Lạt, quảng trường và các quán ăn địa phương nổi tiếng.",
    description:
      "Bazan Hotel có mức giá cạnh tranh và vị trí tiện cho việc tham quan nội thành. Đây là lựa chọn hợp lý cho du khách muốn ưu tiên chi phí và sự tiện lợi.",
    notice: "Khách sạn hỗ trợ giữ hành lý trước giờ nhận phòng nếu còn chỗ.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
  {
    id: "luxe",
    name: "The Luxe Hotel Dalat",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 8.5,
    reviewCount: 1486,
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 405800,
    originalPrice: 541066,
    highlight: "View núi",
    reward: "1.640 Xu",
    amenities: ["Sân thượng", "Sân hiên", "Ban công"],
    amenityIds: ["mountain", "balcony"],
    benefits: ["Chỉ còn 5 phòng giá này"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["sale"],
    address: "17 Nguyễn Chí Thanh, Phường 3, Đà Lạt, Lâm Đồng, Việt Nam",
    locationTip: "Không gian hiện đại, phù hợp cho cặp đôi muốn lưu trú gần trung tâm nhưng vẫn riêng tư.",
    description:
      "The Luxe Hotel Dalat mang phong cách hiện đại với nhiều hạng phòng có cửa sổ lớn. Đây là lựa chọn phù hợp cho khách muốn cân bằng giữa thẩm mỹ, vị trí và tiện nghi.",
    notice: "Một số ưu đãi chỉ áp dụng khi đặt trực tuyến và không hoàn hủy.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
  {
    id: "lapaix",
    name: "La Paix Dalat",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 8.2,
    reviewCount: 167,
    propertyType: "Villa",
    propertyTypeKey: "villa",
    stars: 4,
    nightlyPrice: 749729,
    originalPrice: 999638,
    highlight: "Cho gia đình",
    reward: "2.975 Xu",
    amenities: ["Biệt thự riêng", "Bữa sáng", "Khu vườn"],
    amenityIds: ["family", "breakfast", "balcony"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["family", "breakfast", "freeCancel"],
    address: "9 An Sơn, Phường 3, Đà Lạt, Lâm Đồng, Việt Nam",
    locationTip: "Phù hợp nhóm bạn hoặc gia đình muốn không gian tách biệt và nhiều diện tích sinh hoạt.",
    description:
      "La Paix Dalat là lựa chọn villa riêng tư với không gian rộng, nhiều phòng ngủ và khu vực sinh hoạt chung. Đây là kiểu lưu trú phù hợp cho nhóm đông và kỳ nghỉ dài ngày.",
    notice: "Villa yêu cầu đặt trước để chuẩn bị khu vực bếp và dịch vụ quản gia cơ bản.",
    checkInFrom: "14:00",
    checkOutBefore: "12:00",
  },
];

export const hotelProperties: HotelProperty[] = hotelSeeds.map((item) => {
  const roomGroups = buildRoomGroups(item.nightlyPrice);
  const cheapestRate = roomGroups.flatMap((room) => room.rates).sort((left, right) => left.nightlyPrice - right.nightlyPrice)[0];
  const totalPrice = roundCurrency(cheapestRate.nightlyPrice * 1.18);

  return {
    ...item,
    nightlyPrice: cheapestRate.nightlyPrice,
    totalPrice,
    gallery: buildGallery(),
    roomGroups,
    guestLoveTags: buildGuestLoveTags(item.rating),
    topAmenities: buildTopAmenities(item.propertyTypeKey),
    facilityGroups: buildFacilities(item.propertyTypeKey),
    policySections: buildPolicies(item.name),
    faqItems: buildFaqItems(item.name, cheapestRate.nightlyPrice),
    scoreBreakdown: buildScoreBreakdown(item.rating),
    reviews: buildReviews(item.name, item.district, item.rating),
    nearbyGroups: buildNearbyGroups(item.address),
    alternativeHotelIds: hotelSeeds.filter((seed) => seed.id !== item.id).slice(0, 4).map((seed) => seed.id),
  };
});

export function getHotelPropertyById(hotelId: string | undefined) {
  if (!hotelId) {
    return undefined;
  }

  return hotelProperties.find((item) => item.id === hotelId);
}

export function getHotelRoomRateById(hotel: HotelProperty, roomId: string | undefined) {
  if (!roomId) {
    return undefined;
  }

  for (const roomGroup of hotel.roomGroups) {
    const rate = roomGroup.rates.find((item) => item.id === roomId);

    if (rate) {
      return {
        roomGroup,
        rate,
      };
    }
  }

  return undefined;
}

export function getDefaultHotelRoomSelection(hotel: HotelProperty) {
  const firstGroup = hotel.roomGroups[0];
  const firstRate = firstGroup?.rates[0];

  if (!firstGroup || !firstRate) {
    return undefined;
  }

  return {
    roomGroup: firstGroup,
    rate: firstRate,
  };
}

export function calculateRoomBookingBreakdown(nightlyPrice: number, nights: number, protection = false) {
  const roomCharge = nightlyPrice * nights;
  const taxesAndFees = roundCurrency(roomCharge * 0.155);
  const protectionFee = protection ? 43500 : 0;

  return {
    roomCharge,
    taxesAndFees,
    protectionFee,
    total: roomCharge + taxesAndFees + protectionFee,
  };
}
