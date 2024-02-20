export class LateCheckInValidationError extends Error {
  constructor() {
    super("The Check-In can only be validated until 20 minutes");
  }
}
