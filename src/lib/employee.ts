import { computeWormBalances } from "./wermTypes";
import type { Employee } from "@/features/employees";

export function getWermCountByEmail(employees: Employee[], email: string) {
  const employee = employees.find(emp => emp.email === email);
  if (!employee) return null;

  // Compute and mutate the existing fields
  const enriched_werm = computeWormBalances(employee.werm_balances);
  const enriched_lifetime = computeWormBalances(employee.lifetime_earned);

  return {
    ...employee,
    werm_balances: enriched_werm,
    lifetime_earned: enriched_lifetime,
  };
}