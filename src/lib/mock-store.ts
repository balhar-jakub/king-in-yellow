// In-memory mock data store for Phase 2 — replaced by real DB in Phase 3

export interface MockProfile {
  name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  ticketType: "EARLY_BIRD" | "REGULAR" | "COUPLE";
  amount: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN";
  variableSymbol: string;
  guestName?: string;
  createdAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
}

// --- Mock storage ---

const profiles = new Map<string, MockProfile>();
const orders: MockOrder[] = [];

// Seed one mock admin order for UI testing
orders.push({
  id: "mock-order-001",
  userId: "admin-001",
  ticketType: "REGULAR",
  amount: 888,
  status: "PENDING",
  variableSymbol: "20260001",
  guestName: undefined,
  createdAt: new Date().toISOString(),
});

// --- Profile helpers ---

export function getMockProfile(userId: string): MockProfile | undefined {
  return profiles.get(userId);
}

export function saveMockProfile(userId: string, profile: MockProfile): void {
  profiles.set(userId, profile);
}

// --- Order helpers ---

export function getMockOrders(): MockOrder[] {
  return orders;
}

export function getMockOrderById(id: string): MockOrder | undefined {
  return orders.find((o) => o.id === id);
}

export function getMockOrderByUser(userId: string): MockOrder | undefined {
  return orders.find((o) => o.userId === userId);
}

export function createMockOrder(
  userId: string,
  ticketType: MockOrder["ticketType"],
  amount: number,
  guestName?: string
): MockOrder {
  const vs = String(20260000 + orders.length + 1);
  const order: MockOrder = {
    id: `mock-order-${String(orders.length + 1).padStart(3, "0")}`,
    userId,
    ticketType,
    amount,
    status: "PENDING",
    variableSymbol: vs,
    guestName,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

export function updateMockOrderStatus(
  id: string,
  status: MockOrder["status"]
): MockOrder | undefined {
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  if (status === "CONFIRMED") order.confirmedAt = new Date().toISOString();
  if (status === "CHECKED_IN") order.checkedInAt = new Date().toISOString();
  return order;
}

// --- Ticket verification (mock) ---

export function getMockTicketByToken(token: string): MockOrder | undefined {
  // In mock mode, any token starting with "ticket-" is valid
  if (!token.startsWith("ticket-")) return undefined;
  // Return a plausible order
  return orders.find((o) => o.status !== "PENDING") || orders[0];
}
