import { Validator, ValidationError } from "./interface";
import { RegexValidator } from "./regex";

const ul = String.raw`\u00a1-\uffff`;

const ipv4_re = String.raw`(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}`;

const ipv6_parts =
    String.raw`([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|` +          // 1:2:3:4:5:6:7:8
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
    String.raw`(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])`;            // 2001:db8:3:4::192.0.2.33  64:ff9b::192.0.2.33 (IPv4-Embedded IPv6 Address)
const ipv6_re = String.raw`\[(${ipv6_parts})\]`; // String.raw`\[[0-9a-f:\.]+\]`;

const hostname_re = String.raw`[a-z${ ul }0-9](?:[a-z${ ul }0-9-]{0,61}[a-z${ ul }0-9])?`;
const domain_re = String.raw`(?:\.(?!-)[a-z${ ul }0-9-]{1,63}(?<!-))*`;

const tld_re = String.raw`\.` +              // dot
    String.raw`(?!-)` +                      // can't start with a dash
    String.raw`(?:[a-z${ ul }-]{2,63}` +     // domain label
    String.raw`|xn--[a-z0-9]{1,59})` +       // or punycode label
    String.raw`(?<!-)` +                     // can't end with a dash
    String.raw`\.?`;                         // may have a trailing dot

const host_re = String.raw`(${ hostname_re }${ domain_re }${ tld_re }|localhost)`

const url_regex = String.raw`^(?:[a-z0-9\.\-\+]*)://` + // scheme is validated separately
    String.raw`(?:[^\s:@/]+(?::[^\s:@/]*)?@)?` +        // user:pass authentication
    String.raw`(?:${ ipv4_re }|${ ipv6_re }|${ host_re })` +
    String.raw`(?::\d{2,5})?` +                         // port
    String.raw`(?:[/?#][^\s]*)?` +                      // resource path
    String.raw`$`;

/**
 * Validates URLs.
 */
export class URLValidator extends RegexValidator {

    constructor(schemes, message, code) {
        super();
        let regex = new RegExp(url_regex, "i");
        if(message === undefined) {
            message = 'Enter a valid URL.';
        }
        super(regex, message, code);

        /**
         * The supported schemes for the url.
         */
        if(schemes !== undefined) {
            this.schemes = schemes;
        } else {
            this.schemes = ['http', 'https', 'ftp', 'ftps'];
        }
    }

    doValidate(value) {
        let scheme = value.split("://")[0].toLowerCase();
        if(this.schemes.indexOf(scheme) === -1) {
            return new ValidationError(this.message, this.code);
        } else {
            return super.doValidate(value);
        }
    }

    isEqual(value) {
        if(value instanceof URLValidator &&
                this.regex.toString() === value.regex.toString() &&
                this.message === value.message &&
                this.code === value.code &&
                this.inverse_match == value.inverse_match) {

            if(this.schemes.length !== value.schemes.length) {
                return false;
            } else {
                for(let i = 0; i < this.schemes.length; ++i) {
                    if(value.schemes.indexOf(this.schemes[i]) === -1) {
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