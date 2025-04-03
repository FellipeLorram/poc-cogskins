export class BadgeGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadgeGenerationError";
  }
}
