import { assert } from 'chai';
import { DecimalValidator } from './decimal';
import { ValidationError } from './interface';
import Decimal from '../../node_modules/decimal.js/decimal';

describe("DecimalValidator", () => {

    describe("DecimalValidator.constructor", () => {
        it("Should have default digit and decimal place values.", () => {
            let a = new DecimalValidator();
            assert.equal(a.max_digits, 20);
            assert.equal(a.decimal_places, 6);
        });
    });

    describe("DecimalValidator.isEqual", () => {
        it("should be equal to a similarly configured validator", () => {
            let a = new DecimalValidator();
            let b = new DecimalValidator(20, 6);
            assert.isTrue(a.isEqual(b));
        });

        it("should be not equal to a differently configured validator.", () => {
            let a = new DecimalValidator();
            let b = new DecimalValidator(21, 5);
        });
    });

    describe("DecimalValidator.doValidate", () => {
        it("should validate several potential values.", () => {
            let v = new DecimalValidator(2, 2);
            assert.isUndefined(v.doValidate(new Decimal('0.99')));

            v = new DecimalValidator(2, 1);
            assert.instanceOf(v.doValidate(new Decimal('0.99')), ValidationError);

            v = new DecimalValidator(3, 1);
            assert.instanceOf(v.doValidate(new Decimal('999')), ValidationError);

            v = new DecimalValidator(4, 1);
            assert.isUndefined(v.doValidate(new Decimal('999')));

            v = new DecimalValidator(20, 2);
            assert.isUndefined(v.doValidate(new Decimal('742403889818000000')));

            v = new DecimalValidator(20, 2);
            assert.isUndefined(v.doValidate(new Decimal('7.42403889818E+17')));

            v = new DecimalValidator(20, 2);
            assert.instanceOf(v.doValidate(new Decimal('7424742403889818000000')), ValidationError);

            v = new DecimalValidator(5, 2);
            assert.isUndefined(v.doValidate(new Decimal('7304E-1')));

            v = new DecimalValidator(5, 2);
            assert.instanceOf(v.doValidate(new Decimal('7304E-3')), ValidationError);

            v = new DecimalValidator(5, 5);
            assert.isUndefined(v.doValidate(new Decimal('70E-5')));

            v = new DecimalValidator(5, 5);
            assert.instanceOf(v.doValidate(new Decimal('71E-6')), ValidationError);

            v = new DecimalValidator(10, 5);
            assert.instanceOf(v.doValidate(new Decimal('NaN')), ValidationError);
            assert.instanceOf(v.doValidate(new Decimal('-NaN')), ValidationError);
            assert.instanceOf(v.doValidate(new Decimal('+NaN')), ValidationError);
            assert.instanceOf(v.doValidate(new Decimal('Infinity')), ValidationError);
            assert.instanceOf(v.doValidate(new Decimal('-Infinity')), ValidationError);
            assert.instanceOf(v.doValidate(new Decimal('+Infinity')), ValidationError);
        });
    });

});
