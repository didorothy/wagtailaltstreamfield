import { Validator, ValidationError } from './interface';

export class DecimalValidator extends Validator {
    /**
     * The message to display if the result is invalid.
     */
    messages = {
        invalid: 'Enter a number.',
        max_digits: 'Ensure that there are no more than {{max}} digits in total.',
        max_decimal_places: 'Ensure that there are no more than {{max}} decimal places.',
        max_whole_digits: 'Ensure that ther are no more than {{max}} digits before the decimal point.'
    };

    max_digits = 0;
    decimal_places = 0;

    constructor(max_digits=20, decimal_places=6) {
        super();
        this.max_digits = max_digits;
        this.decimal_places = decimal_places;
    }

    doValidate(value) {
        if(value.isNaN() || !value.isFinite()) {
            return new ValidationError(
                this.messages.invalid,
                'invalid'
            );
        }

        // first figure out how many digits we have in the value.
        let digits = value.precision(true);
        let decimal_places = value.decimalPlaces();

        // we don't count the digit if the digit is 0.
        if(digits === 1 && value.lessThan(1) && value.greaterThan(-1)) {
            digits = decimal_places;
        }

        console.log(value.toString())
        console.log(digits)
        console.log(decimal_places)
        if(digits > this.max_digits) {
            return new ValidationError(
                this.messages.max_digits,
                'max_digits',
                {max: this.max_digits}
            );
        }

        if(decimal_places > this.decimal_places) {
            return new ValidationError(
                this.messages.max_decimal_places,
                'max_decimal_places',
                {max: this.decimal_places}
            );
        }

        if(digits - decimal_places > this.max_digits - this.decimal_places) {
            return new ValidationError(
                this.messages.max_whole_digits,
                'max_whole_digits',
                {max: this.max_digits - this.decimal_places}
            )
        }
    }

    isEqual(value) {
        return value instanceof this.constructor &&
            value.max_digits === this.max_digits &&
            value.decimal_places === this.decimal_places;
    }
}