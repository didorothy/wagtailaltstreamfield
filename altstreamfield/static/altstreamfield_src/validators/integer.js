import { RegexValidator } from "./regex";

export class IntegerValidator extends RegexValidator {
    constructor(message, code) {
        super();
        if(message === undefined) {
            message = 'Enter a valid integer.';
        }
        super(/^-?\d+$/, message, code);
    }
}

export class CommaSeparatedIntegerListValidator extends RegexValidator {
    constructor(message, code) {
        super();

        if(message === undefined) {
            message = 'Enter only digits separated by commas.';
        }
        super(/^(-)?\d+(?:,(-)?\d+)*$/, message, code);
    }
}