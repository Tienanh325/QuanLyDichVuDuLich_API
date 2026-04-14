export type HotelSearchState = {
  view: "landing" | "results";
  destination: string;
  destinationSubtitle: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
};

export type HotelSpecialRequestId = "nonSmoking" | "connectingRooms" | "highFloor";
export type HotelPaymentMethod =
  | "vietqr"
  | "bankTransfer"
  | "digitalWallet"
  | "mobileBanking"
  | "card"
  | "store"
  | "installment";

export type HotelSelectionState = HotelSearchState & {
  roomId: string;
};

export type HotelCheckoutState = HotelSelectionState & {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  guestName: string;
  specialRequests: HotelSpecialRequestId[];
  protection: boolean;
  paymentMethod: HotelPaymentMethod;
  couponCode: string;
};

export const defaultHotelSearchState: HotelSearchState = {
  view: "landing",
  destination: "Đà Lạt",
  destinationSubtitle: "Lâm Đồng, Việt Nam",
  checkInDate: "2026-04-14",
  checkOutDate: "2026-04-15",
  adults: 2,
  children: 0,
  rooms: 1,
};

export const defaultHotelCheckoutState: HotelCheckoutState = {
  ...defaultHotelSearchState,
  view: "results",
  roomId: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  guestName: "",
  specialRequests: [],
  protection: false,
  paymentMethod: "vietqr",
  couponCode: "",
};

const weekdayLabels = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"] as const;

function clampCount(value: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : minimum;
}

function isPaymentMethod(value: string | null): value is HotelPaymentMethod {
  return (
    value === "vietqr" ||
    value === "bankTransfer" ||
    value === "digitalWallet" ||
    value === "mobileBanking" ||
    value === "card" ||
    value === "store" ||
    value === "installment"
  );
}

function isSpecialRequest(value: string): value is HotelSpecialRequestId {
  return value === "nonSmoking" || value === "connectingRooms" || value === "highFloor";
}

function serializeRequests(requests: HotelSpecialRequestId[]) {
  return requests.join(",");
}

function parseRequests(value: string | null) {
  if (!value) {
    return [] as HotelSpecialRequestId[];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(isSpecialRequest);
}

export function toHotelDate(dateString: string) {
  const parsedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(`${defaultHotelSearchState.checkInDate}T00:00:00`);
  }

  return parsedDate;
}

export function toHotelQueryDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function hotelQueryDateToDate(dateString: string) {
  return toHotelDate(dateString);
}

export function formatHotelDateLabel(dateString: string) {
  const date = toHotelDate(dateString);

  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1} ${date.getFullYear()}`;
}

export function formatHotelDateChip(dateString: string) {
  const date = toHotelDate(dateString);

  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}`;
}

export function formatHotelDateWithWeekday(dateString: string) {
  const date = toHotelDate(dateString);

  return `${weekdayLabels[date.getDay()]}, ${formatHotelDateLabel(dateString)}`;
}

export function calculateHotelNights(checkInDate: string, checkOutDate: string) {
  const difference = toHotelDate(checkOutDate).getTime() - toHotelDate(checkInDate).getTime();

  return Math.max(1, Math.round(difference / (1000 * 60 * 60 * 24)));
}

export function formatHotelDateRange(checkInDate: string, checkOutDate: string) {
  const nights = calculateHotelNights(checkInDate, checkOutDate);

  return `${formatHotelDateChip(checkInDate)} - ${formatHotelDateChip(checkOutDate)}, ${nights} đêm`;
}

export function formatHotelGuestSummary(adults: number, children: number, rooms: number) {
  return `${adults} người lớn, ${children} trẻ em, ${rooms} phòng`;
}

export function parseHotelSearchParams(searchParams: URLSearchParams): HotelSearchState {
  const adults = clampCount(Number(searchParams.get("adults")), defaultHotelSearchState.adults);
  const children = clampCount(Number(searchParams.get("children")), 0);
  const rooms = clampCount(Number(searchParams.get("rooms")), defaultHotelSearchState.rooms);

  return {
    view: searchParams.get("view") === "results" ? "results" : "landing",
    destination: searchParams.get("destination") || defaultHotelSearchState.destination,
    destinationSubtitle: searchParams.get("destinationSub") || defaultHotelSearchState.destinationSubtitle,
    checkInDate: searchParams.get("checkIn") || defaultHotelSearchState.checkInDate,
    checkOutDate: searchParams.get("checkOut") || defaultHotelSearchState.checkOutDate,
    adults,
    children,
    rooms,
  };
}

export function buildHotelSearchQuery(overrides: Partial<HotelSearchState>) {
  const nextState = {
    ...defaultHotelSearchState,
    ...overrides,
  };
  const searchParams = new URLSearchParams();

  searchParams.set("view", nextState.view);
  searchParams.set("destination", nextState.destination);
  searchParams.set("destinationSub", nextState.destinationSubtitle);
  searchParams.set("checkIn", nextState.checkInDate);
  searchParams.set("checkOut", nextState.checkOutDate);
  searchParams.set("adults", String(nextState.adults));
  searchParams.set("children", String(nextState.children));
  searchParams.set("rooms", String(nextState.rooms));

  return searchParams.toString();
}

export function parseHotelSelectionParams(searchParams: URLSearchParams): HotelSelectionState {
  return {
    ...parseHotelSearchParams(searchParams),
    roomId: searchParams.get("roomId") || "",
  };
}

export function buildHotelSelectionQuery(overrides: Partial<HotelSelectionState>) {
  const nextState = {
    ...defaultHotelSearchState,
    roomId: "",
    ...overrides,
  };
  const searchParams = new URLSearchParams(buildHotelSearchQuery(nextState));

  searchParams.set("roomId", nextState.roomId);

  return searchParams.toString();
}

export function parseHotelCheckoutParams(searchParams: URLSearchParams): HotelCheckoutState {
  return {
    ...defaultHotelCheckoutState,
    ...parseHotelSelectionParams(searchParams),
    contactName: searchParams.get("contactName") || "",
    contactPhone: searchParams.get("contactPhone") || "",
    contactEmail: searchParams.get("contactEmail") || "",
    guestName: searchParams.get("guestName") || "",
    specialRequests: parseRequests(searchParams.get("requests")),
    protection: searchParams.get("protection") === "1",
    paymentMethod: isPaymentMethod(searchParams.get("paymentMethod"))
      ? (searchParams.get("paymentMethod") as HotelPaymentMethod)
      : defaultHotelCheckoutState.paymentMethod,
    couponCode: searchParams.get("coupon") || "",
  };
}

export function buildHotelCheckoutQuery(overrides: Partial<HotelCheckoutState>) {
  const nextState = {
    ...defaultHotelCheckoutState,
    ...overrides,
  };
  const searchParams = new URLSearchParams(buildHotelSelectionQuery(nextState));

  searchParams.set("contactName", nextState.contactName);
  searchParams.set("contactPhone", nextState.contactPhone);
  searchParams.set("contactEmail", nextState.contactEmail);
  searchParams.set("guestName", nextState.guestName);
  searchParams.set("requests", serializeRequests(nextState.specialRequests));
  searchParams.set("protection", nextState.protection ? "1" : "0");
  searchParams.set("paymentMethod", nextState.paymentMethod);
  searchParams.set("coupon", nextState.couponCode);

  return searchParams.toString();
}
