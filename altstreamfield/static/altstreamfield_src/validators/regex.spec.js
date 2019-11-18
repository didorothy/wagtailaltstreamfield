import { RegexValidator } from "./regex";
import { ValidationError } from "./interface";

describe("RegexValidator", () => {
    describe("RegexValidator.constructor", () => {
        test("Should only require the regex to create.", () => {
            let validator = new RegexValidator(/testing/i);
            expect(validator).toBeInstanceOf(RegexValidator);
            expect(validator.message).toEqual("Enter a valid value.");
            expect(validator.code).toEqual("invalid");
        });

        test("Should allow specifying a special message and code.", () => {
            let validator = new RegexValidator(/testing/i, "Special message about error.", "special-error-code");
            expect(validator).toBeInstanceOf(RegexValidator);
            expect(validator.message).toEqual("Special message about error.");
            expect(validator.code).toEqual("special-error-code");
        });
    });

    describe("RegexValidator.doValidate", () => {
        test("Should perform validation with regex", () => {
            let validator = new RegexValidator(/^green$/i, "Not green.");
            let error = validator.doValidate('green');
            expect(error).toBeUndefined();

            error = validator.doValidate("GreEn");
            expect(error).toBeUndefined();

            error = validator.doValidate("Red");
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual("Not green.");
            expect(error.code).toEqual("invalid");
        });

        test("should perform validation with regex but inverse match", () => {
            let validator = new RegexValidator(/^red$/i, "Is red.", undefined, true);
            let error = validator.doValidate('red');
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual('Is red.');
            expect(error.code).toEqual('invalid');

            error = validator.doValidate('green');
            expect(error).toBeUndefined();
        });
    });

    describe("RegexValidator.isEqual", () => {
        test("should be equal to a similarly configured validator.", () => {
            let a = new RegexValidator(/^foobar$/i, 'Not foobar.');
            let b = new RegexValidator(/^foobar$/i, 'Not foobar.');
            expect(a.isEqual(b)).toEqual(true);
        });

        test("should not be equal to a differently configured validator", () => {
            let a = new RegexValidator(/^foobar$/i, 'Not foobar.');
            let b = new RegexValidator(/^foobar$/i, 'Not foobar.', undefined, true);
            expect(a.isEqual(b)).toEqual(false);
        });
    });
});