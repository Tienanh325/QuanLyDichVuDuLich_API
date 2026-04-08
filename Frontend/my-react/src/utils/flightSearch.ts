export type FlightTripType = "oneWay" | "roundTrip" | "multiCity";

export type FlightSearchState = {
  view: "landing" | "results";
  tripType: FlightTripType;
  fromTitle: string;
  fromSubtitle: string;
  toTitle: string;
  toSubtitle: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  cabinClass: string;
};

export const defaultFlightSearchState: FlightSearchState = {
  view: "landing",
  tripType: "roundTrip",
  fromTitle: "TP. HCM (SGN)",
  fromSubtitle: "Sân bay Tân Sơn Nhất",
  toTitle: "Singapore (SIN)",
  toSubtitle: "Sân bay Changi",
  departDate: "2026-04-30",
  returnDate: "2026-05-03",
  passengers: "1 hành khách",
  cabinClass: "Phổ thông",
};

const weekdayLabels = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"] as const;

function isTripType(value: string | null): value is FlightTripType {
  return value === "oneWay" || value === "roundTrip" || value === "multiCity";
}

function toDate(dateString: string) {
  const parsedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(`${defaultFlightSearchState.departDate}T00:00:00`);
  }

  return parsedDate;
}

export function parseFlightSearchParams(searchParams: URLSearchParams): FlightSearchState {
  const tripTypeParam = searchParams.get("trip");

  return {
    view: searchParams.get("view") === "results" ? "results" : "landing",
    tripType: isTripType(tripTypeParam) ? tripTypeParam : defaultFlightSearchState.tripType,
    fromTitle: searchParams.get("from") || defaultFlightSearchState.fromTitle,
    fromSubtitle: searchParams.get("fromSub") || defaultFlightSearchState.fromSubtitle,
    toTitle: searchParams.get("to") || defaultFlightSearchState.toTitle,
    toSubtitle: searchParams.get("toSub") || defaultFlightSearchState.toSubtitle,
    departDate: searchParams.get("depart") || defaultFlightSearchState.departDate,
    returnDate: searchParams.get("return") || defaultFlightSearchState.returnDate,
    passengers: searchParams.get("passengers") || defaultFlightSearchState.passengers,
    cabinClass: searchParams.get("cabin") || defaultFlightSearchState.cabinClass,
  };
}

export function buildFlightSearchQuery(overrides: Partial<FlightSearchState>) {
  const nextState = {
    ...defaultFlightSearchState,
    ...overrides,
  };
  const searchParams = new URLSearchParams();

  searchParams.set("view", nextState.view);
  searchParams.set("trip", nextState.tripType);
  searchParams.set("from", nextState.fromTitle);
  searchParams.set("fromSub", nextState.fromSubtitle);
  searchParams.set("to", nextState.toTitle);
  searchParams.set("toSub", nextState.toSubtitle);
  searchParams.set("depart", nextState.departDate);
  searchParams.set("return", nextState.returnDate);
  searchParams.set("passengers", nextState.passengers);
  searchParams.set("cabin", nextState.cabinClass);

  return searchParams.toString();
}

export function formatFlightDateLabel(dateString: string) {
  const date = toDate(dateString);

  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1} ${date.getFullYear()}`;
}

export function formatFlightDateMeta(dateString: string) {
  const date = toDate(dateString);

  return `${weekdayLabels[date.getDay()]}, ${formatFlightDateLabel(dateString)}`;
}

export function formatFlightDateChip(dateString: string) {
  const date = toDate(dateString);

  return `${weekdayLabels[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}`;
}

export function addFlightDays(dateString: string, amount: number) {
  const date = toDate(dateString);
  date.setDate(date.getDate() + amount);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatCurrencyVnd(value: number) {
  return `${value.toLocaleString("vi-VN")} VND`;
}

export function extractAirportCode(value: string) {
  const matchedCode = value.match(/\(([A-Z]{3,4})\)/)?.[1];

  if (matchedCode) {
    return matchedCode;
  }

  return value
    .split(" ")
    .map((item) => item.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean)
    .map((item) => item[0]?.toUpperCase())
    .join("")
    .slice(0, 4);
}
