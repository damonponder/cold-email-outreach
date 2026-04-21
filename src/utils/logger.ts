export function logStep(message: string): void {
  console.log(`[Rank Missile] ${message}`);
}

export function logWarn(message: string): void {
  console.warn(`[Rank Missile Warning] ${message}`);
}

export function logError(message: string, error?: unknown): void {
  console.error(`[Rank Missile Error] ${message}`);
  if (error) {
    console.error(error);
  }
}