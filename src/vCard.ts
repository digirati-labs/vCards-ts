import {vCardMailingAddress, vCardPhoto} from "./types";
import {vCardFormatter} from "./vCardFormatter";
import {vCardFormattingOptions} from "../lib";

export class vCard {
  constructor(){

  }

  public uid?: string;
  public anniversary?: Date;
  public birthday?: Date;
  public cellPhone?: string | string[];
  public pagerPhone?: string | string[];
  public email?: string | string[];
  public workEmail?: string | string[];
  public firstName?: string;
  public formattedName?: string;
  public gender?: string;
  public homeAddress?: vCardMailingAddress;
  public homePhone?: string | string[];
  public homeFax?: string | string[];
  public lastName?: string;
  public logo?: vCardPhoto;
  public middleName?: string;
  public namePrefix?: string;
  public nameSuffix?: string;
  public nickname?: string;
  public note?: string;
  public organization?: string;
  public otherEmail?: string | string[];
  public otherPhone?: string | string[];
  public photo?: vCardPhoto;
  public role?: string;
  public socialUrls?: Map<string, string>;
  public source?: string;
  public title?: string;
  public url?: string;
  public workUrl?: string;
  public workAddress?: vCardMailingAddress;
  public workPhone?: string | string[];
  public workFax?: string | string[];
  public version?: string = '3';

  public getMajorVersion() :number  {
    const majorVersionString = this.version ? this.version.split('.')[0] : '4';

    if (!isNaN(Number(majorVersionString))) {
      return Number(majorVersionString);
    }
    return 4;
  }

  public getFormattedString(options? : vCardFormattingOptions): string {
    return vCardFormatter.getFormattedString(this, options);
  };
}