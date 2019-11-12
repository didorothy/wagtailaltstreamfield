import { Validator, ValidationError } from "./interface";

export class ProhibitNullCharacterValidator extends Validator {
    //message = '';
    //code = '';

    constructor(message='Null characters are not allowed.', code='null-characters-not-allowed') {
        super();

        this.message = message;
        this.code = code;
    }

    doValidate(value) {
        value = '' + value;
        if(value.toString().indexOf('\x00') !== -1) {
            return new ValidationError(this.message, this.code);
        }
    }

    isEqual(value) {
        return value instanceof this.constructor &&
            value.message === this.message &&
            value.code === this.code;
    }


}