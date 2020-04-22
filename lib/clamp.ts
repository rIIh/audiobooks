export const clamp = (value: number, min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY) => Math.max(min, Math.min(value, max));
