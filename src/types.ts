export type vCardPhoto = {
  url?: string;
  mediaType?: string;
  base64: boolean;

  attachFromUrl?: (url: String, mediaType: String) => void;
  embedFromFile?: (fileLocation: String) => void;
  embedFromString?: (base64String: String, mediaType: String) => void;
}

export type vCardMailingAddress = {
  label?: string;
  poBox?: string;
  extendedAddress?: string;
  street?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  countryRegion?: string;
}

export type vCardAddress = {
  type: vCardAddressType;
  details?: vCardMailingAddress;
}

export enum vCardAddressType {
  HOME = 'HOME',
  WORK = 'WORK'
}

export type vCardFormattingOptions ={
  skipCharset: boolean;
  skipShowAs: boolean;
  skipRevision: boolean;
}