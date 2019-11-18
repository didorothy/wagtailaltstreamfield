import { ProhibitNullCharacterValidator } from './prohibitnullcharacter';
import { ValidationError } from './interface';

describe("ProhibitNullCharacterValidator", () => {
    describe("ProhibitNullCharacterValidator.constructor", () => {
        test("should allow for default message and code", () => {
            let validator = new ProhibitNullCharacterValidator();
            expect(validator.message).toEqual("Null characters are not allowed.");
            expect(validator.code).toEqual('null-characters-not-allowed');
        });

        test("should allow for custom message and code", () => {
            let validator = new ProhibitNullCharacterValidator('Test message.', 'invalid-char');
            expect(validator.message).toEqual("Test message.");
            expect(validator.code).toEqual('invalid-char');
        });
    });

    test("ProhibitNullCharacterValidator.doValidate", () => {
        let validator = new ProhibitNullCharacterValidator();
        expect(validator.doValidate('test \x00 string')).toBeInstanceOf(ValidationError);
        expect(validator.doValidate("test")).toBeUndefined();
        expect(validator.doValidate(1)).toBeUndefined();
        expect(validator.doValidate(undefined)).toBeUndefined();
    });

    test("ProhibitNullCharacterValidator.isEqual", () => {
        let a = new ProhibitNullCharacterValidator();
        let b = new ProhibitNullCharacterValidator();
        expect(a.isEqual(b)).toEqual(true);

        let c = new ProhibitNullCharacterValidator('bad');
        expect(a.isEqual(c)).toEqual(false);
    });
});