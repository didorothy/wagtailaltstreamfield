import { Validator, ValidationError } from "./interface";

export class BaseLimitValidator extends Validator {
    constructor(limit_value, message, code) {
        super();
        this.limit_value = limit_value;
        if(message !== undefined) {
            this.message = message;
        } else {
            this.message = `Enter a valid value.`;
        }

        if(code !== undefined) {
            this.code = code;
        } else {
            this.code = 'invalid';
        }
    }

    doValidate(value) {
        let cleaned = this.clean(value);
        let limit_value = (this.limit_value instanceof Function ? this.limit_value() : this.limit_value);
        if(this.compare(cleaned, limit_value)) {
            return new ValidationError(this.message, this.code, {limit_value: limit_value, value: value, cleaned: cleaned});
        }
    }

    isEqual(value) {
        return value instanceof this.constructor &&
            value.message === this.message &&
            value.code === this.code &&
            value.limit_value === this.limit_value;
    }

    compare(a, b) {
        return a !== b;
    }

    clean(value) {
        return value;
    }
}

export class MaxValueValidator extends BaseLimitValidator {
    constructor(limit_value, message, code) {
        super();
        if(message === undefined) {
            message = "Ensure this value is less than or equal to {{ limit_value }}.";
        }
        super(limit_value, message, code);
    }

    compare(a, b) {
        return a > b;
    }
}

export class MinValueValidator extends BaseLimitValidator {
    constructor(limit_value, message, code) {
        super();
        if(message === undefined) {
            message = "Ensure this value is greater than or equal to {{ limit_value }}.";
        }
        super(limit_value, message, code);
    }

    compare(a, b) {
        return a < b;
    }
}

export class MaxLengthValidator extends BaseLimitValidator {
    constructor(limit_value, message, code) {
        super();
        if(message === undefined) {
            message = "Ensure this value has at most {{ limit_value }} characters (it has {{ cleaned }}).";
        }
        super(limit_value, message, code);
    }

    compare(a, b) {
        return a > b;
    }

    clean(value) {
        try {
            if(value.length !== undefined) {
                return value.length;
            } else {
                return ('' + value).length;
            }
        } catch {
            try {
                return ('' + value).length;
            } catch {
                return 0;
            }
        }
    }
}

export class MinLengthValidator extends BaseLimitValidator {
    constructor(limit_value, message, code) {
        super();
        if(message === undefined) {
            message = "Ensure this value has at least {{ limit_value }} characters (it has {{ cleaned }}).";
        }
        super(limit_value, message, code);
    }

    doValidate(value) {
        return super.doValidate(value);
    }

    compare(a, b) {
        return a < b;
    }

    clean(value) {
        try {
            if(value.length !== undefined) {
                return value.length;
            } else {
                return ('' + value).length;
            }
        } catch {
            try {
                return ('' + value).length;
            } catch {
                return 0;
            }
        }
    }
}
