export const formatExternalId = (internalId: string): string => {
  return `usr-${internalId}`;
};

export const parseInternalId = (externalId: string): string => {
  if (!externalId.startsWith("usr-")) {
    throw new Error(`Invalid external user ID: ${externalId}`);
  }

  return externalId.slice(4);
};
