import { IPV4Validator, IPV6Validator } from "./ip";
import { ValidationError } from "./interface";

let valid_ipv4s = [
    '1.1.1.1',
    '255.0.0.0',
    '0.0.0.0',
];

let invalid_ipv4s = [
    '256.1.1.1',
    '25.1.1.',
    '25,1,1,1',
    '25.1 .1.1',
    '1.1.1.1\n',
    '٧.2٥.3٣.243',
];

let valid_ipv6s = [
    'fe80::1',
    '::1',
    '1:2:3:4:5:6:7:8',
];

let invalid_ipv6s = [
    '1:2',
    '::zzz',
    '12345::',
]

describe("IPV4Validator", () => {
    describe("IPV4Validator.doValidate", () => {
        test("should validate various values", () => {
            let validator = new IPV4Validator();
            for(let i = 0; i < valid_ipv4s.length; ++i) {
                expect(validator.doValidate(valid_ipv4s[i])).toBeUndefined();
            }

            for(let i = 0; i < invalid_ipv4s.length; ++i) {
                expect(validator.doValidate(invalid_ipv4s[i])).toBeInstanceOf(ValidationError);
            }
        });
    });
});

describe("IPV6Validator", () => {
    describe("IPV6Validator.doValidate", () => {
        test("should validate various values", () => {
            let validator = new IPV6Validator();
            for(let i = 0; i < valid_ipv6s.length; ++i) {
                expect(validator.doValidate(valid_ipv6s[i])).toBeUndefined();
            }

            for(let i = 0; i < invalid_ipv6s.length; ++i) {
                expect(validator.doValidate(invalid_ipv6s[i])).toBeInstanceOf(ValidationError);
            }
        });
    });
});