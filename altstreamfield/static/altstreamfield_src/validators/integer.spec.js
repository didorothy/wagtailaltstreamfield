import { IntegerValidator, CommaSeparatedIntegerListValidator } from "./integer";
import { RegexValidator } from "./regex";
import { ValidationError } from "./interface";

describe("IntegerValidator", () => {

    describe("IntegerValidator.constructor", () => {
        test("should have standard message", () => {
            let a = new IntegerValidator();
            expect(a.message).toEqual("Enter a valid integer.");
        });
    });

    describe("IntegerValidator.isEqual", () => {
        test("should be equal to a similarly configured validator.", () => {
            let a = new IntegerValidator('Not foobar.');
            let b = new IntegerValidator('Not foobar.');
            expect(a.isEqual(b)).toEqual(true);
        });

        test("should not be equal to a differently configured validator", () => {
            let a = new IntegerValidator('Not foobar.');
            let b = new IntegerValidator('Not foobar.', 'super-invalid');
            expect(a.isEqual(b)).toEqual(false);

            let c = new RegexValidator(/^-?\d+$/, 'Not foobar.');
            expect(a.isEqual(c)).toEqual(false);
        });
    });

    describe("IntegerValidator.doValidate", () => {
        test("Should validate several potential values.", () => {
            let validator = new IntegerValidator();
            expect(validator.doValidate(1)).toBeUndefined();
            expect(validator.doValidate('123')).toBeUndefined();
            expect(validator.doValidate('-10')).toBeUndefined();
            expect(validator.doValidate(-31)).toBeUndefined();
            expect(validator.doValidate('abc')).toBeInstanceOf(ValidationError);
            expect(validator.doValidate('1.2')).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(1.223)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(false)).toBeInstanceOf(ValidationError);
        });
    });
});

describe("CommaSeparatedIntegerListValidator", () => {
    describe("CommaSeparatedIntegerListValidator.constructor", () => {
        test('Should have a standard message', () => {
            let a = new CommaSeparatedIntegerListValidator('Special message about integer list.');
            expect(a.message).toEqual('Special message about integer list.');
        });
    });

    describe("CommaSeparatedIntegerListValidator.doValidate", () => {
        test("should validate various values", () => {
            let validator = new CommaSeparatedIntegerListValidator();
            expect(validator.doValidate(10)).toBeUndefined();
            expect(validator.doValidate('1,2,3,4,5')).toBeUndefined();
            expect(validator.doValidate('1,2,3,4,5,')).toBeInstanceOf(ValidationError);
            expect(validator.doValidate('1,2,3.3,4,5,')).toBeInstanceOf(ValidationError);
            expect(validator.doValidate('ad,vd,ed,ee,ae,')).toBeInstanceOf(ValidationError);
        });
    });
});