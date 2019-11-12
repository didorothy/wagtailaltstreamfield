import { assert } from 'chai';
import { EmailValidator } from "./email";
import { ValidationError } from "./interface";

function repeatChar(character, count) {
    let result = '';
    for(let i = 0; i < count; ++i) {
        result += character;
    }
    return result;
}

let valid_emails = [
    'email@here.com',
    'weirder-email@here.and.there.com',
    'email@[127.0.0.1]',
    'email@[2001:dB8::1]',
    'email@[2001:dB8:0:0:0:0:0:1]',
    'email@[::fffF:127.0.0.1]',
    'example@valid-----hyphens.com',
    'example@valid-with-hyphens.com',
    //'test@domain.with.idn.tld.उदाहरण.परीक्षा',
    'email@localhost',
    '"test@test"@example.com',
    'example@atm.' + repeatChar('a', 63),
    'example@' + repeatChar('a', 63) + '.atm',
    'example@' + repeatChar('a', 63) + '.' + repeatChar('b', 10) + '.atm',

    '"\\\x09"@here.com',
    'a@' + repeatChar('a', 63) + '.us',
]

let invalid_emails = [
    'example@atm.' + repeatChar('a', 64),
    'example@' + repeatChar('b', 64) + '.atm.' + repeatChar('a', 63),
    null,
    '',
    'abc',
    'abc@',
    'abc@bar',
    'a @x.cz',
    'abc@.com',
    'something@@somewhere.com',
    'email@127.0.0.1',
    'email@[127.0.0.256]',
    'email@[2001:db8::12345]',
    'email@[2001:db8:0:0:0:0:1]',
    'email@[::ffff:127.0.0.256]',
    'example@invalid-.com',
    'example@-invalid.com',
    'example@invalid.com-',
    'example@inv-.alid-.com',
    'example@inv-.-alid.com',
    'test@example.com\n\n<script src="x.js">',
    // Quoted-string format (CR not allowed)
    '"\\\x0A"@here.com',
    'trailingdot@shouldfail.com.',
    // Max length of domain name labels is 63 characters per RFC 1034.
    'a@' + repeatChar('a', 64) + '.us',
    // Trailing newlines in username or domain not allowed
    'a@b.com\n',
    'a\n@b.com',
    '"test@test"\n@example.com',
    'a@[127.0.0.1]\n',
]



describe("EmailValidator", () => {
    describe("EmailValidator.constructor", () => {
        it("Should not require parameters.", () => {
            let validator = new EmailValidator();
            assert.instanceOf(validator, EmailValidator);
            assert.equal(validator.message, "Enter a valid email address.");
            assert.equal(validator.code, "invalid");
            assert.equal(validator.whitelist.length, 1);
            assert.equal(validator.whitelist[0], 'localhost');
        });

        it("Should allow specifying a special message, code, and whitelist.", () => {
            let validator = new EmailValidator("Special message about error.", "special-error-code", ['localhost', 'google.com']);
            assert.instanceOf(validator, EmailValidator);
            assert.equal(validator.message, "Special message about error.");
            assert.equal(validator.code, "special-error-code");
            assert.equal(validator.whitelist.length, 2);
        });
    });

    describe("EmailValidator.doValidate", () => {
        it("Should perform validation of various emails", () => {
            let validator = new EmailValidator();
            for(let i = 0; i < valid_emails.length; ++i) {
                let error = validator.doValidate(valid_emails[i]);
                assert.isUndefined(error);
            }

            for(let i = 0; i < invalid_emails.length; ++i) {
                let error = validator.doValidate(invalid_emails[i]);
                assert.instanceOf(error, ValidationError);
            }

            validator = new EmailValidator(undefined, undefined, ['localdomain'])
            let error = validator.doValidate('email@localdomain');
            assert.isUndefined(error);
        });
    });

    describe("EmailValidator.isEqual", () => {
        it("should be equal to a similarly configured validator.", () => {
            let a = new EmailValidator('Not foobar.');
            let b = new EmailValidator('Not foobar.');
            assert.isTrue(a.isEqual(b));
        });

        it("should not be equal to a differently configured validator", () => {
            let a = new EmailValidator('Not foobar.');
            let b = new EmailValidator('Not foobar.', 'different-invalid');
            assert.isFalse(a.isEqual(b));

            let c = new EmailValidator('Not foobar.', undefined, ['foobar']);
            assert.isFalse(a.isEqual(c));

            let d = new EmailValidator('Not foobar.', undefined, ['foobar', 'localhost']);
            assert.isFalse(a.isEqual(d));
        });
    });
});