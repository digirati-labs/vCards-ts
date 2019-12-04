import {vCardAddress, vCardAddressType} from "./types";
import {vCard} from "./vCard"

export class vCardFormatter {
  private static e(value: any) : string {
    if (value) {
      if (typeof(value) !== 'string') {
        value = '' + value;
      }
      return value.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    }
    return '';
  }

  private static nl():String{
    return '\r\n';
  }

  private static getFormattedPhoto(photoType: string, url: string, majorVersion: number, base64: boolean, mediaType?: string) : string {
    let params;

    if (majorVersion >= 4) {
      params = base64 ? ';ENCODING=b;MEDIATYPE=image/' : ';MEDIATYPE=image/';
    } else if (majorVersion === 3) {
      params = base64 ? ';ENCODING=b;TYPE=' : ';TYPE=';
    } else {
      params = base64 ? ';ENCODING=BASE64;' : ';';
    }

    return photoType + params + mediaType + ':' + vCardFormatter.e(url) + vCardFormatter.nl();
  }

  private static getFormattedAddress(encodingPrefix: string, address: vCardAddress, majorVersion: number) : string {
    if(!address.details) return '';

    let formattedAddress = '';

    if (address.details.label ||
      address.details.street ||
      address.details.city ||
      address.details.stateProvince ||
      address.details.postalCode ||
      address.details.countryRegion) {

      if (majorVersion >= 4) {
        formattedAddress = 'ADR' + encodingPrefix + ';TYPE=' + address.type +
          (address.details.label ? ';LABEL="' + vCardFormatter.e(address.details.label) + '"' : '') + ':' +
          vCardFormatter.e(address.details.poBox) + ';' +
          vCardFormatter.e(address.details.extendedAddress) + ';' +
          vCardFormatter.e(address.details.street) + ';' +
          vCardFormatter.e(address.details.city) + ';' +
          vCardFormatter.e(address.details.stateProvince) + ';' +
          vCardFormatter.e(address.details.postalCode) + ';' +
          vCardFormatter.e(address.details.countryRegion) + vCardFormatter.nl();
      } else {
        if (address.details.label) {
          formattedAddress = 'LABEL' + encodingPrefix + ';TYPE=' + address.type + ':' + vCardFormatter.e(address.details.label) + vCardFormatter.nl();
        }
        formattedAddress += 'ADR' + encodingPrefix + ';TYPE=' + address.type + ':;;' +
          vCardFormatter.e(address.details.street) + ';' +
          vCardFormatter.e(address.details.city) + ';' +
          vCardFormatter.e(address.details.stateProvince) + ';' +
          vCardFormatter.e(address.details.postalCode) + ';' +
          vCardFormatter.e(address.details.countryRegion) + vCardFormatter.nl();
      }
    }

    return formattedAddress;
  }

  private static getFormattedDate(date : Date) : string {
    return date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
  }

  public static getFormattedString(vCard: vCard) : string {
    const majorVersion = vCard.getMajorVersion();

    let formattedVCardString = '';
    formattedVCardString += 'BEGIN:VCARD' +vCardFormatter.nl();
    formattedVCardString += 'VERSION:' + vCard.version +vCardFormatter.nl();

    const encodingPrefix = majorVersion >= 4 ? '' : ';CHARSET=UTF-8';
    let formattedName = vCard.formattedName || '';

    if (!formattedName) {

      [vCard.firstName, vCard.middleName, vCard.lastName]
        .map(n=>n || '')
        .forEach(function(name: string) {
          if (name) {
            if (formattedName) {
              formattedName += ' ';
            }
          }
          formattedName += name;
        });
    }

    formattedVCardString += 'FN' + encodingPrefix + ':' +vCardFormatter.e(formattedName) +vCardFormatter.nl();
    formattedVCardString += 'N' + encodingPrefix + ':' +
     vCardFormatter.e(vCard.lastName) + ';' +
     vCardFormatter.e(vCard.firstName) + ';' +
     vCardFormatter.e(vCard.middleName) + ';' +
     vCardFormatter.e(vCard.namePrefix) + ';' +
     vCardFormatter.e(vCard.nameSuffix) +vCardFormatter.nl();

    if (vCard.nickname && majorVersion >= 3) {
      formattedVCardString += 'NICKNAME' + encodingPrefix + ':' +vCardFormatter.e(vCard.nickname) +vCardFormatter.nl();
    }

    if (vCard.gender) {
      formattedVCardString += 'GENDER:' +vCardFormatter.e(vCard.gender) +vCardFormatter.nl();
    }

    if (vCard.uid) {
      formattedVCardString += 'UID' + encodingPrefix + ':' +vCardFormatter.e(vCard.uid) +vCardFormatter.nl();
    }

    if (vCard.birthday) {
      formattedVCardString += 'BDAY:' +vCardFormatter.getFormattedDate(vCard.birthday) +vCardFormatter.nl();
    }

    if (vCard.anniversary) {
      formattedVCardString += 'ANNIVERSARY:' +vCardFormatter.getFormattedDate(vCard.anniversary) +vCardFormatter.nl();
    }

    if (vCard.email) {
     if(!Array.isArray(vCard.email)){
        vCard.email = [vCard.email];
      }
      vCard.email.forEach(
       function(address) {
          if (majorVersion >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else if (majorVersion >= 3 && majorVersion < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME,INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';HOME;INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.workEmail) {
     if(!Array.isArray(vCard.workEmail)){
        vCard.workEmail = [vCard.workEmail];
      }
      vCard.workEmail.forEach(
       function(address) {
          if (majorVersion >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else if (majorVersion >= 3 && majorVersion < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK,INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';WORK;INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.otherEmail) {
     if(!Array.isArray(vCard.otherEmail)){
        vCard.otherEmail = [vCard.otherEmail];
      }
      vCard.otherEmail.forEach(
       function(address) {
          if (majorVersion >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else if (majorVersion >= 3 && majorVersion < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER,INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';OTHER;INTERNET:' +vCardFormatter.e(address) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.logo && vCard.logo.url) {
      formattedVCardString +=vCardFormatter.getFormattedPhoto('LOGO', vCard.logo.url, majorVersion, vCard.logo.base64, vCard.logo.mediaType);
    }

    if (vCard.photo && vCard.photo.url) {
      formattedVCardString +=vCardFormatter.getFormattedPhoto('PHOTO', vCard.photo.url, majorVersion, vCard.photo.base64, vCard.photo.mediaType);
    }

    if (vCard.cellPhone) {
     if(!Array.isArray(vCard.cellPhone)){
        vCard.cellPhone = [vCard.cellPhone];
      }
      vCard.cellPhone.forEach(
       function(number){
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,cell":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'TEL;TYPE=CELL:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.pagerPhone) {
     if(!Array.isArray(vCard.pagerPhone)){
        vCard.pagerPhone = [vCard.pagerPhone];
      }
      vCard.pagerPhone.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="pager,cell":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'TEL;TYPE=PAGER:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.homePhone) {
     if(!Array.isArray(vCard.homePhone)){
        vCard.homePhone = [vCard.homePhone];
      }
      vCard.homePhone.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,home":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();
          } else {
            formattedVCardString += 'TEL;TYPE=HOME,VOICE:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.workPhone) {
     if(!Array.isArray(vCard.workPhone)){
        vCard.workPhone = [vCard.workPhone];
      }
      vCard.workPhone.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,work":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();

          } else {
            formattedVCardString += 'TEL;TYPE=WORK,VOICE:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.homeFax) {
     if(!Array.isArray(vCard.homeFax)){
        vCard.homeFax = [vCard.homeFax];
      }
      vCard.homeFax.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,home":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();

          } else {
            formattedVCardString += 'TEL;TYPE=HOME,FAX:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.workFax) {
     if(!Array.isArray(vCard.workFax)){
        vCard.workFax = [vCard.workFax];
      }
      vCard.workFax.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,work":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();

          } else {
            formattedVCardString += 'TEL;TYPE=WORK,FAX:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    if (vCard.otherPhone) {
     if(!Array.isArray(vCard.otherPhone)){
        vCard.otherPhone = [vCard.otherPhone];
      }
      vCard.otherPhone.forEach(
       function(number) {
          if (majorVersion >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,other":tel:' +vCardFormatter.e(number) +vCardFormatter.nl();

          } else {
            formattedVCardString += 'TEL;TYPE=OTHER:' +vCardFormatter.e(number) +vCardFormatter.nl();
          }
        }
      );
    }

    [{
      details: vCard.homeAddress,
      type: vCardAddressType.HOME
    }, {
      details: vCard.workAddress,
      type: vCardAddressType.WORK
    }]
      .filter(a=>a.details)
      .forEach(
     function(address) {
        formattedVCardString += vCardFormatter.getFormattedAddress(encodingPrefix, address, majorVersion);
      }
    );

    if (vCard.title) {
      formattedVCardString += 'TITLE' + encodingPrefix + ':' +vCardFormatter.e(vCard.title) +vCardFormatter.nl();
    }

    if (vCard.role) {
      formattedVCardString += 'ROLE' + encodingPrefix + ':' +vCardFormatter.e(vCard.role) +vCardFormatter.nl();
    }

    if (vCard.organization) {
      formattedVCardString += 'ORG' + encodingPrefix + ':' +vCardFormatter.e(vCard.organization) +vCardFormatter.nl();
    }

    if (vCard.url) {
      formattedVCardString += 'URL' + encodingPrefix + ':' +vCardFormatter.e(vCard.url) +vCardFormatter.nl();
    }

    if (vCard.workUrl) {
      formattedVCardString += 'URL;type=WORK' + encodingPrefix + ':' +vCardFormatter.e(vCard.workUrl) +vCardFormatter.nl();
    }

    if (vCard.note) {
      formattedVCardString += 'NOTE' + encodingPrefix + ':' +vCardFormatter.e(vCard.note) +vCardFormatter.nl();
    }

    if (vCard.socialUrls) {
      for (let key in vCard.socialUrls.keys()) {
        if (vCard.socialUrls.has(key)) {
          formattedVCardString += 'X-SOCIALPROFILE;TYPE=' + key + ':' +vCardFormatter.e(vCard.socialUrls.get(key)) +vCardFormatter.nl();
        }
      }
    }

    if (vCard.source) {
      formattedVCardString += 'SOURCE' + encodingPrefix + ':' +vCardFormatter.e(vCard.source) +vCardFormatter.nl();
    }

    formattedVCardString += 'REV:' + (new Date()).toISOString() +vCardFormatter.nl();

    if (vCard.organization) {
      formattedVCardString += 'X-ABShowAs:COMPANY' +vCardFormatter.nl();
    }

    formattedVCardString += 'END:VCARD' +vCardFormatter.nl();
    return formattedVCardString;
  }
}