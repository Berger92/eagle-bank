export const formatExternalId = (internalId: string): string => {
  return `tan-${internalId}`;
};

export const parseInternalId = (externalId: string): string => {
  if (!externalId.startsWith("tan-")) {
    throw new Error(`Invalid external transaction ID: ${externalId}`);
  }

  return externalId.slice(4);
};
