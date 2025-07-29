declare global {
  var verificationCodes:
    | Map<
        string,
        {
          code: string;
          createdAt: number;
          attempts: number;
        }
      >
    | undefined;

  var authenticatedUsers:
    | Map<
        string,
        {
          phoneNumber: string;
          authenticatedAt: number;
        }
      >
    | undefined;
}

export {};
