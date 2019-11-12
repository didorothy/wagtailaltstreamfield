import { assert } from 'chai';
import { IntegerValidator, CommaSeparatedIntegerListValidator } from "./integer";
import { RegexValidator } from "./regex";
import { ValidationError } from "./interface";

describe("IntegerValidator", () => {

    describe("IntegerValidator.constructor", () => {
        it("should have standard message", () => {
            let a = new IntegerValidator();
            assert.equal(a.message, "Enter a valid integer.");
        });
    });

    describe("IntegerValidator.isEqual", () => {
        it("should be equal to a similarly configured validator.", () => {
            let a = new IntegerValidator('Not foobar.');
            let b = new IntegerValidator('Not foobar.');
            assert.isTrue(a.isEqual(b));
        });

        it("should not be equal to a differently configured validator", () => {
            let a = new IntegerValidator('Not foobar.');
            let b = new IntegerValidator('Not foobar.', 'super-invalid');
            assert.isFalse(a.isEqual(b));

            let c = new RegexValidator(/^-?\d+$/, 'Not foobar.');
            assert.isFalse(a.isEqual(c));
        });
    });

    describe("IntegerValidator.doValidate", () => {
        it("Should validate several potential values.", () => {
            let validator = new IntegerValidator();
            assert.isUndefined(validator.doValidate(1));
            assert.isUndefined(validator.doValidate('123'));
            assert.isUndefined(validator.doValidate('-10'));
            assert.isUndefined(validator.doValidate(-31));
            assert.instanceOf(validator.doValidate('abc'), ValidationError);
            assert.instanceOf(validator.doValidate('1.2'), ValidationError);
            assert.instanceOf(validator.doValidate(1.223), ValidationError);
            assert.instanceOf(validator.doValidate(false), ValidationError);
        });
    });
});

describe("CommaSeparatedIntegerListValidator", () => {
    describe("CommaSeparatedIntegerListValidator.constructor", () => {
        it('Should have a standard message', () => {
            let a = new CommaSeparatedIntegerListValidator('Special message about integer list.');
            assert.equal(a.message, 'Special message about integer list.');
        });
    });

    describe("CommaSeparatedIntegerListValidator.doValidate", () => {
        it("should validate various values", () => {
            let validator = new CommaSeparatedIntegerListValidator();
            assert.isUndefined(validator.doValidate(10));
            assert.isUndefined(validator.doValidate('1,2,3,4,5'));
            assert.instanceOf(validator.doValidate('1,2,3,4,5,'), ValidationError);
            assert.instanceOf(validator.doValidate('1,2,3.3,4,5,'), ValidationError);
            assert.instanceOf(validator.doValidate('ad,vd,ed,ee,ae,'), ValidationError);
        });
    });
});