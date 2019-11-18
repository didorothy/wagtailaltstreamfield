import { DecimalValidator } from './decimal';
import { ValidationError } from './interface';
import Decimal from 'decimal.js/decimal';

describe("DecimalValidator", () => {

    describe("DecimalValidator.constructor", () => {
        test("Should have default digit and decimal place values.", () => {
            let a = new DecimalValidator();
            expect(a.max_digits).toEqual(20);
            expect(a.decimal_places).toEqual(6);
        });
    });

    describe("DecimalValidator.isEqual", () => {
        test("should be equal to a similarly configured validator", () => {
            let a = new DecimalValidator();
            let b = new DecimalValidator(20, 6);
            expect(a.isEqual(b)).toBe(true);
        });

        test("should be not equal to a differently configured validator.", () => {
            let a = new DecimalValidator();
            let b = new DecimalValidator(21, 5);
            expect(a.isEqual(b)).toBe(false);
        });
    });

    describe("DecimalValidator.doValidate", () => {
        test("should validate several potential values.", () => {
            let v = new DecimalValidator(2, 2);
            expect(v.doValidate(new Decimal('0.99'))).toBeUndefined();

            v = new DecimalValidator(2, 1);
            expect(v.doValidate(new Decimal('0.99'))).toBeInstanceOf(ValidationError);

            v = new DecimalValidator(3, 1);
            expect(v.doValidate(new Decimal('999'))).toBeInstanceOf(ValidationError);

            v = new DecimalValidator(4, 1);
            expect(v.doValidate(new Decimal('999'))).toBeUndefined();

            v = new DecimalValidator(20, 2);
            expect(v.doValidate(new Decimal('742403889818000000'))).toBeUndefined();

            v = new DecimalValidator(20, 2);
            expect(v.doValidate(new Decimal('7.42403889818E+17'))).toBeUndefined();

            v = new DecimalValidator(20, 2);
            expect(v.doValidate(new Decimal('7424742403889818000000'))).toBeInstanceOf(ValidationError);

            v = new DecimalValidator(5, 2);
            expect(v.doValidate(new Decimal('7304E-1'))).toBeUndefined();

            v = new DecimalValidator(5, 2);
            expect(v.doValidate(new Decimal('7304E-3'))).toBeInstanceOf(ValidationError);

            v = new DecimalValidator(5, 5);
            expect(v.doValidate(new Decimal('70E-5'))).toBeUndefined();

            v = new DecimalValidator(5, 5);
            expect(v.doValidate(new Decimal('71E-6'))).toBeInstanceOf(ValidationError);

            v = new DecimalValidator(10, 5);
            expect(v.doValidate(new Decimal('NaN'))).toBeInstanceOf(ValidationError);
            expect(v.doValidate(new Decimal('-NaN'))).toBeInstanceOf(ValidationError);
            expect(v.doValidate(new Decimal('+NaN'))).toBeInstanceOf(ValidationError);
            expect(v.doValidate(new Decimal('Infinity'))).toBeInstanceOf(ValidationError);
            expect(v.doValidate(new Decimal('-Infinity'))).toBeInstanceOf(ValidationError);
            expect(v.doValidate(new Decimal('+Infinity'))).toBeInstanceOf(ValidationError);
        });
    });

});
