export type UserRole = "admin" | "customer";

export type RegisteredCustomer = {
  fullName: string;
  email: string;
  password: string;
  role: "customer";
};

export type SessionUser = {
  fullName: string;
  email: string;
  role: UserRole;
};

const REGISTERED_CUSTOMERS_KEY = "travelhub_registered_customers";
const SESSION_KEY = "travelhub_session";

const defaultAdminAccount = {
  fullName: "TravelHub Admin",
  email: "admin@travelhub.vn",
  password: "Admin@123",
  role: "admin" as const,
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getRegisteredCustomers(): RegisteredCustomer[] {
  if (!canUseStorage()) {
    return [];
  }

  const storedValue = window.localStorage.getItem(REGISTERED_CUSTOMERS_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as RegisteredCustomer[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function registerCustomer(account: Omit<RegisteredCustomer, "role">) {
  const normalizedEmail = account.email.trim().toLowerCase();
  const customers = getRegisteredCustomers();

  const emailExists =
    normalizedEmail === defaultAdminAccount.email ||
    customers.some((customer) => customer.email.toLowerCase() === normalizedEmail);

  if (emailExists) {
    return {
      ok: false as const,
      message: "Email nay da ton tai trong he thong.",
    };
  }

  const nextCustomer: RegisteredCustomer = {
    fullName: account.fullName.trim(),
    email: normalizedEmail,
    password: account.password,
    role: "customer",
  };

  if (canUseStorage()) {
    window.localStorage.setItem(
      REGISTERED_CUSTOMERS_KEY,
      JSON.stringify([...customers, nextCustomer]),
    );
  }

  return {
    ok: true as const,
    customer: nextCustomer,
  };
}

export function loginWithEmail(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (
    normalizedEmail === defaultAdminAccount.email &&
    normalizedPassword === defaultAdminAccount.password
  ) {
    const session: SessionUser = {
      fullName: defaultAdminAccount.fullName,
      email: defaultAdminAccount.email,
      role: "admin",
    };

    if (canUseStorage()) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return {
      ok: true as const,
      session,
    };
  }

  const matchedCustomer = getRegisteredCustomers().find(
    (customer) =>
      customer.email.toLowerCase() === normalizedEmail && customer.password === normalizedPassword,
  );

  if (matchedCustomer) {
    const session: SessionUser = {
      fullName: matchedCustomer.fullName,
      email: matchedCustomer.email,
      role: "customer",
    };

    if (canUseStorage()) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return {
      ok: true as const,
      session,
    };
  }

  return {
    ok: false as const,
    message:
      "Thong tin dang nhap khong dung. Admin dung tai khoan co san, con khach hang dang ky tai trang tao tai khoan.",
  };
}

export function getCurrentSession(): SessionUser | null {
  if (!canUseStorage()) {
    return null;
  }

  const storedValue = window.localStorage.getItem(SESSION_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as SessionUser;
  } catch {
    return null;
  }
}

export function clearCurrentSession() {
  if (canUseStorage()) {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function getDefaultAdminAccount() {
  return defaultAdminAccount;
}
