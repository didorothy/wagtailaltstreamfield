import { Validator, ValidationError } from "./interface";

const user_regex = new RegExp(
    "(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*$" +  // dot-atom
    String.raw`|^"([\x01-\x09\x0B\x0C\x0E-\x1F!#-\[\]-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x1F])*"$)`,  // quoted-string
    "i");

// max length for domain name labels is 63 characters per RFC 1034
const domain_regex = new RegExp(
    String.raw`^((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$`, "i");

// literal form, ipv4 or ipv6 address (SMTP 4.1.3)
const literal_regex = new RegExp(String.raw`\[([A-f0-9:\.]+)\]$`,"i");

const ipv4_regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const ipv6_regex = new RegExp(String.raw`^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|` +          // 1:2:3:4:5:6:7:8
    String.raw`([0-9a-fA-F]{1,4}:){1,7}:|` +                         // 1::                              1:2:3:4:5:6:7::
    String.raw`([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|` +         // 1::8             1:2:3:4:5:6::8  1:2:3:4:5:6::8
    String.raw`([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|` +  // 1::7:8           1:2:3:4:5::7:8  1:2:3:4:5::8
    String.raw`([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|` +  // 1::6:7:8         1:2:3:4::6:7:8  1:2:3:4::8
    String.raw`([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|` +  // 1::5:6:7:8       1:2:3::5:6:7:8  1:2:3::8
    String.raw`([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|` +  // 1::4:5:6:7:8     1:2::4:5:6:7:8  1:2::8
    String.raw`[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|` +       // 1::3:4:5:6:7:8   1::3:4:5:6:7:8  1::8
    String.raw`:((:[0-9a-fA-F]{1,4}){1,7}|:)|` +                     // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8 ::8       ::
    String.raw`fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|` +     // fe80::7:8%eth0   fe80::7:8%1     (link-local IPv6 addresses with zone index)
    String.raw`::(ffff(:0{1,4}){0,1}:){0,1}` +
    String.raw`((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}` +
    String.raw`(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|` +          // ::255.255.255.255   ::ffff:255.255.255.255  ::ffff:0:255.255.255.255  (IPv4-mapped IPv6 addresses and IPv4-translated addresses)
    String.raw`([0-9a-fA-F]{1,4}:){1,4}:` +
    String.raw`((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}` +
    String.raw`(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$`, 'i');            // 2001:db8:3:4::192.0.2.33  64:ff9b::192.0.2.33 (IPv4-Embedded IPv6 Address)


export class EmailValidator extends Validator {

    /**
     * The message to display if the result is invalid.
     */
    message = '';

    /**
     * The code
     */
    code = '';

    /**
     * A list of domains to whitelist.
     */
    whitelist = [];

    constructor(message, code, whitelist) {
        super();

        if(message !== undefined) {
            this.message = message;
        } else {
            this.message = 'Enter a valid email address.'
        }

        if(code !== undefined) {
            this.code = code;
        } else {
            this.code = 'invalid';
        }

        if(whitelist !== undefined) {
            this.whitelist = whitelist;
        } else {
            this.whitelist = ['localhost'];
        }
    }

    doValidate(value) {
        if(!value || value.indexOf('@') === -1) {
            return new ValidationError(this.message, this.code);
        }

        let at_index = value.lastIndexOf('@');
        let user_part = value.substr(0, at_index);
        let domain_part = value.substr(at_index + 1);

        if(!user_regex.test(user_part)) {
            return new ValidationError(this.message, this.code);
        }

        if(this.whitelist.indexOf(domain_part) === -1 && !this._validateDomainPart(domain_part)) {
            return new ValidationError(this.message, this.code);
        }
    }

    _validateDomainPart(domain_part) {
        if(domain_regex.test(domain_part)) {
            return true;
        }
        let literal_match = literal_regex.exec(domain_part);
        if(literal_match && literal_match.length > 0) {
            if(ipv4_regex.test(literal_match[1])) {
                return true;
            }

            if(ipv6_regex.test(literal_match[1])) {
                return true;
            }

            return false;
        }

        return false;
    }

    isEqual(value) {
        if(value instanceof this.constructor &&
            this.message === value.message &&
            this.code === value.code) {

            if(this.whitelist.length !== value.whitelist.length) {
                return false;
            } else {
                for(let i = 0; i < this.whitelist.length; ++i) {
                    if(value.whitelist.indexOf(this.whitelist[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }
    }

}
