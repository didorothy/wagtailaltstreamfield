import { RegexValidator } from "./regex";

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


export class IPV4Validator extends RegexValidator {
    constructor(message, code) {
        super(ipv4_regex, message, code);
    }
}

export class IPV6Validator extends RegexValidator {
    constructor(message, code) {
        super(ipv6_regex, message, code);
    }
}