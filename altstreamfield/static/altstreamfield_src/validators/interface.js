import { template } from "../utils/template";

export class ValidationError {
    constructor(message, code, params) {
        this.message = message;
        if(params !== undefined) {
            this.message = template(this.message, params);
        }
        if(code !== undefined) {
            this.code = code;
        } else {
            this.code = 'invalid';
        }
    }
}

/**
 * Interface that all Validators should implement.
 */
export class Validator {
    /**
     * Runs the validation algorithm and returns true if the value is valid otherwise false.
     * @param value The value to validate.
     */
    doValidate(value) {
        throw new Error('Not implemented.');
    }

    /**
     * Compares validators to know if they are equal or not.
     * @param value The validator to compare with this.
     */
    isEqual(value) {
        throw new Error('Not implemented');
    }
}
