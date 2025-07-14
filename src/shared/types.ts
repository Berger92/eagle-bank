import { Request } from "express";

export interface AuthenticatedUser {
  internalId: string; // Primary DB ID (UUID or numeric)
  externalId: string; // Public-facing ID (e.g. 'usr-abc123')
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
