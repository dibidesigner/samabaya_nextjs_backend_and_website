import { v4 as uuidv4 } from "uuid";

export function generateOrderId(): string {
  return `ORD-${uuidv4().split("-")[0].toUpperCase()}`;
}
