export function parseNumericInput(value: string): number {
  const normalized = value.replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Clamp a value to a reasonable range to prevent trillion-level overflow */
const MAX_VALUE = 999_999_999; // 999M cap
const MIN_VALUE = 0;

export function clampValue(value: number): number {
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, Math.round(value)));
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const clamped = Math.round(value);

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(clamped);
}

export function formatReadableNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
