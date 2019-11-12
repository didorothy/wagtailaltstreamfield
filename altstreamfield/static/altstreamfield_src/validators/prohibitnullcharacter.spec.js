import { assert } from 'chai';
import { ProhibitNullCharacterValidator } from './prohibitnullcharacter';
import { ValidationError } from './interface';

describe("ProhibitNullCharacterValidator", () => {
    describe("ProhibitNullCharacterValidator.constructor", () => {
        it("should allow for default message and code", () => {
            let validator = new ProhibitNullCharacterValidator();
            assert.equal(validator.message, "Null characters are not allowed.");
            assert.equal(validator.code, 'null-characters-not-allowed');
        });

        it("should allow for custom message and code", () => {
            let validator = new ProhibitNullCharacterValidator('Test message.', 'invalid-char');
            assert.equal(validator.message, "Test message.");
            assert.equal(validator.code, 'invalid-char');
        });
    });

    describe("ProhibitNullCharacterValidator.doValidate", () => {
        let validator = new ProhibitNullCharacterValidator();
        assert.instanceOf(validator.doValidate('test \x00 string'), ValidationError);
        assert.isUndefined(validator.doValidate("test"));
        assert.isUndefined(validator.doValidate(1))
        assert.isUndefined(validator.doValidate(undefined))
    });

    describe("ProhibitNullCharacterValidator.isEqual", () => {
        let a = new ProhibitNullCharacterValidator();
        let b = new ProhibitNullCharacterValidator();
        assert.isTrue(a.isEqual(b));

        let c = new ProhibitNullCharacterValidator('bad');
        assert.isFalse(a.isEqual(c));
    });
});