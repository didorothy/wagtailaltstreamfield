import { Validator, ValidationError } from "./interface";

/**
 * RegExp based validator.
 */
export class RegexValidator extends Validator {
    constructor(regex, message, code, inverse_match) {
        super();
        this.regex = regex;

        if(message !== undefined) {
            this.message = message;
        } else {
            this.message = 'Enter a valid value.'
        }

        if(code !== undefined) {
            this.code = code;
        } else {
            this.code = 'invalid';
        }

        if(inverse_match !== undefined) {
            this.inverse_match = inverse_match;
        } else {
            this.inverse_match = false;
        }
    }

    doValidate(value) {
        if(this.inverse_match) {
            if(this.regex.test(value)) {
                return new ValidationError(this.message, this.code);
            }
        } else {
            if(!this.regex.test(value)) {
                return new ValidationError(this.message, this.code);
            };
        }
    }

    isEqual(value) {
        return value instanceof this.constructor &&
            this.regex.toString() === value.regex.toString() &&
            this.message === value.message &&
            this.code === value.code &&
            this.inverse_match == value.inverse_match;
    }
}
