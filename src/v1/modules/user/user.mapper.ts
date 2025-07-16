import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper {
  formatExternalId(internalId: string): string {
    return `usr-${internalId}`;
  }

  parseInternalId(externalId: string): string {
    if (!externalId.startsWith("usr-")) {
      throw new Error(`Invalid external user ID: ${externalId}`);
    }
    return externalId.slice(4);
  }

  // TODO - more mapping methods needed
}
