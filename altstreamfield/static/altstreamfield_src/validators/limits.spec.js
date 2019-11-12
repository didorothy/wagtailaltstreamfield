import { assert } from 'chai';
import { BaseLimitValidator, MaxValueValidator, MinValueValidator, MaxLengthValidator, MinLengthValidator } from "./limits";
import { ValidationError } from "./interface";

describe("BaseLimitValidator", () => {
    describe("BaseLimitValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new BaseLimitValidator(null);
            assert.equal(validator.message, "Enter a valid value.");
            assert.isNull(validator.limit_value);
            assert.equal(validator.code, 'invalid');
        });

        it("should allow specifying a custom error message and code.", () => {
            let validator = new BaseLimitValidator(null, 'Value must be null.', 'invalid-null');
            assert.equal(validator.message, "Value must be null.");
            assert.isNull(validator.limit_value);
            assert.equal(validator.code, 'invalid-null');
        });

        it("should allow specifying the error message as a template.", () => {
            let validator = new BaseLimitValidator(null, 'Value must be {{ limit_value }}.', 'invalid-null');
            assert.equal(validator.message, "Value must be {{ limit_value }}.");
            let result = validator.doValidate(false);
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, 'Value must be null.');
        });
    });

    describe("BaseLimitValidator.doValidation", () => {
        it("should validate different values", () => {
            let validator = new BaseLimitValidator(null);
            assert.isUndefined(validator.doValidate(null));
            assert.instanceOf(validator.doValidate(1), ValidationError);
            assert.instanceOf(validator.doValidate(undefined), ValidationError);
            assert.instanceOf(validator.doValidate(false), ValidationError);
            assert.instanceOf(validator.doValidate('null'), ValidationError);
        });

        it("should allow limit_value to be a function.", () => {
            let cur_limit = 0;
            function moving_limit() {
                return cur_limit++;
            }
            let validator = new BaseLimitValidator(moving_limit, "Expected {{ limit_value }}.");
            assert.isUndefined(validator.doValidate(0));
            let result = validator.doValidate(0);
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, "Expected 1.");

            result = validator.doValidate(0);
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, "Expected 2.");
        });
    });

    describe("BaseLimitValidator.isEqual", () => {
        it("should be equal to a similarly configured validator", () => {
            let a = new BaseLimitValidator(null);
            let b = new BaseLimitValidator(null);
            assert.equal(a.isEqual(b), true);
        });

        it("should not be equal to differently configured validator", () => {
            let a = new BaseLimitValidator(null);
            let b = new BaseLimitValidator(1);
            assert.equal(a.isEqual(b), false);

            let c = new BaseLimitValidator(null, 'Must be null.');
            assert.equal(a.isEqual(c), false);
        });
    });
});

describe("MaxValueValidator", () => {
    describe("MaxValueValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new MaxValueValidator(100);
            assert.equal(validator.message, "Ensure this value is less than or equal to {{ limit_value }}.");
            assert.equal(validator.limit_value, 100);
            assert.equal(validator.code, 'invalid');

            let result = validator.doValidate(1000);
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, 'Ensure this value is less than or equal to 100.');
        });

        it("should allow specifying error message", () => {
            let validator = new MaxValueValidator(100, 'Must be less than {{ limit_value }}.');
            assert.equal(validator.message, "Must be less than {{ limit_value }}.");
        });
    });

    describe("MaxValueValidator.doValidation", () => {
        it("should validate different values", () => {
            let validator = new MaxValueValidator(100);
            assert.isUndefined(validator.doValidate(1));
            assert.isUndefined(validator.doValidate(-10));
            assert.isUndefined(validator.doValidate("15"));
            assert.isUndefined(validator.doValidate(undefined));
            assert.isUndefined(validator.doValidate(false));
            assert.isUndefined(validator.doValidate('null'));
            assert.instanceOf(validator.doValidate(101), ValidationError);

            validator = new MaxValueValidator(new Date(2011, 10, 13));
            assert.isUndefined(validator.doValidate(new Date(2011, 10, 12)));
            assert.instanceOf(validator.doValidate(new Date(2011, 10, 14)), ValidationError);
        });
    });
});

describe("MinValueValidator", () => {
    describe("MinValueValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new MinValueValidator(100);
            assert.equal(validator.message, "Ensure this value is greater than or equal to {{ limit_value }}.");
            assert.equal(validator.limit_value, 100);
            assert.equal(validator.code, 'invalid');

            let result = validator.doValidate(1);
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, 'Ensure this value is greater than or equal to 100.');
        });

        it("should allow specifying error message", () => {
            let validator = new MinValueValidator(100, 'Must be greater than {{ limit_value }}.');
            assert.equal(validator.message, "Must be greater than {{ limit_value }}.");
        });
    });

    describe("MinValueValidator.doValidation", () => {
        it("should validate different values", () => {
            let validator = new MinValueValidator(100);
            assert.isUndefined(validator.doValidate(101));
            assert.isUndefined(validator.doValidate("150"));
            assert.isUndefined(validator.doValidate(undefined));
            assert.isUndefined(validator.doValidate('null'));
            assert.instanceOf(validator.doValidate(1), ValidationError);
            assert.instanceOf(validator.doValidate(-10), ValidationError);

            validator = new MinValueValidator(new Date(2011, 10, 13));
            assert.isUndefined(validator.doValidate(new Date(2011, 10, 14)));
            assert.instanceOf(validator.doValidate(new Date(2011, 10, 12)), ValidationError);
            assert.instanceOf(validator.doValidate(false), ValidationError);
        });
    });
});

describe("MaxLengthValidator", () => {
    describe("MaxLengthValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new MaxLengthValidator(2);
            assert.equal(validator.message, "Ensure this value has at most {{ limit_value }} characters (it has {{ cleaned }}).");
            assert.equal(validator.limit_value, 2);
            assert.equal(validator.code, 'invalid');

            let result = validator.doValidate("test");
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, 'Ensure this value has at most 2 characters (it has 4).');
        });

        it("should allow specifying error message", () => {
            let validator = new MaxLengthValidator(100, 'Must be less than {{ limit_value }}.');
            assert.equal(validator.message, "Must be less than {{ limit_value }}.");
        });
    });

    describe("MaxLengthValidator.doValidation", () => {
        it("should validate different values", () => {
            let validator = new MaxLengthValidator(10);
            assert.isUndefined(validator.doValidate(1));
            assert.isUndefined(validator.doValidate(1.2));
            assert.isUndefined(validator.doValidate([1,2,3]));
            assert.isUndefined(validator.doValidate("15"));
            assert.isUndefined(validator.doValidate(false));
            assert.isUndefined(validator.doValidate(undefined));
            assert.instanceOf(validator.doValidate('nothing I bring'), ValidationError);
            assert.instanceOf(validator.doValidate([1,2,3,4,5,6,7,8,9,0,1]), ValidationError);
        });
    });
});

describe("MinLengthValidator", () => {
    describe("MinLengthValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new MinLengthValidator(10);
            assert.equal(validator.message, "Ensure this value has at least {{ limit_value }} characters (it has {{ cleaned }}).");
            assert.equal(validator.limit_value, 10);
            assert.equal(validator.code, 'invalid');

            let result = validator.doValidate("one");
            assert.instanceOf(result, ValidationError);
            assert.equal(result.message, 'Ensure this value has at least 10 characters (it has 3).');
        });

        it("should allow specifying error message", () => {
            let validator = new MinLengthValidator(100, 'Must be greater than {{ limit_value }}.');
            assert.equal(validator.message, "Must be greater than {{ limit_value }}.");
        });
    });

    describe("MinLengthValidator.doValidation", () => {
        it("should validate different values", () => {
            let validator = new MinLengthValidator(10);
            assert.isUndefined(validator.doValidate('nothing I bring'));
            assert.isUndefined(validator.doValidate([1,2,3,4,5,6,7,8,9,0,1]));
            assert.instanceOf(validator.doValidate(undefined), ValidationError);
            assert.instanceOf(validator.doValidate(1), ValidationError);
            assert.instanceOf(validator.doValidate(1.2), ValidationError);
            assert.instanceOf(validator.doValidate([1,2,3]), ValidationError);
            assert.instanceOf(validator.doValidate("15"), ValidationError);
            assert.instanceOf(validator.doValidate(false), ValidationError);

        });
    });
});