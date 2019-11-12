import { assert } from 'chai';
import { RegexValidator } from "./regex";
import { ValidationError } from "./interface";

describe("RegexValidator", () => {
    describe("RegexValidator.constructor", () => {
        it("Should only require the regex to create.", () => {
            let validator = new RegexValidator(/testing/i);
            assert.instanceOf(validator, RegexValidator);
            assert.equal(validator.message, "Enter a valid value.");
            assert.equal(validator.code, "invalid");
        });

        it("Should allow specifying a special message and code.", () => {
            let validator = new RegexValidator(/testing/i, "Special message about error.", "special-error-code");
            assert.instanceOf(validator, RegexValidator);
            assert.equal(validator.message, "Special message about error.");
            assert.equal(validator.code, "special-error-code");
        });
    });

    describe("RegexValidator.doValidate", () => {
        it("Should perform validation with regex", () => {
            let validator = new RegexValidator(/^green$/i, "Not green.");
            let error = validator.doValidate('green');
            assert.isUndefined(error);

            error = validator.doValidate("GreEn");
            assert.isUndefined(error);

            error = validator.doValidate("Red");
            assert.instanceOf(error, ValidationError);
            assert.equal(error.message, "Not green.");
            assert.equal(error.code, "invalid")
        });

        it("should perform validation with regex but inverse match", () => {
            let validator = new RegexValidator(/^red$/i, "Is red.", undefined, true);
            let error = validator.doValidate('red');
            assert.instanceOf(error, ValidationError);
            assert.equal(error.message, 'Is red.');
            assert.equal(error.code, 'invalid');

            error = validator.doValidate('green');
            assert.isUndefined(error);
        });
    });

    describe("RegexValidator.isEqual", () => {
        it("should be equal to a similarly configured validator.", () => {
            let a = new RegexValidator(/^foobar$/i, 'Not foobar.');
            let b = new RegexValidator(/^foobar$/i, 'Not foobar.');
            assert.isTrue(a.isEqual(b));
        });

        it("should not be equal to a differently configured validator", () => {
            let a = new RegexValidator(/^foobar$/i, 'Not foobar.');
            let b = new RegexValidator(/^foobar$/i, 'Not foobar.', undefined, true);
            assert.isFalse(a.isEqual(b));
        });
    });
});