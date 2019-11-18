import { BaseLimitValidator, MaxValueValidator, MinValueValidator, MaxLengthValidator, MinLengthValidator } from "./limits";
import { ValidationError } from "./interface";

describe("BaseLimitValidator", () => {
    describe("BaseLimitValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new BaseLimitValidator(null);
            expect(validator.message).toEqual("Enter a valid value.");
            expect(validator.limit_value).toBeNull();
            expect(validator.code).toEqual('invalid');
        });

        test("should allow specifying a custom error message and code.", () => {
            let validator = new BaseLimitValidator(null, 'Value must be null.', 'invalid-null');
            expect(validator.message).toEqual("Value must be null.");
            expect(validator.limit_value).toBeNull();
            expect(validator.code).toEqual('invalid-null');
        });

        test("should allow specifying the error message as a template.", () => {
            let validator = new BaseLimitValidator(null, 'Value must be {{ limit_value }}.', 'invalid-null');
            expect(validator.message).toEqual("Value must be {{ limit_value }}.");
            let result = validator.doValidate(false);
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual('Value must be null.');
        });
    });

    describe("BaseLimitValidator.doValidation", () => {
        test("should validate different values", () => {
            let validator = new BaseLimitValidator(null);
            expect(validator.doValidate(null)).toBeUndefined();
            expect(validator.doValidate(1)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(undefined)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(false)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate('null')).toBeInstanceOf(ValidationError);
        });

        test("should allow limit_value to be a function.", () => {
            let cur_limit = 0;
            function moving_limit() {
                return cur_limit++;
            }
            let validator = new BaseLimitValidator(moving_limit, "Expected {{ limit_value }}.");
            expect(validator.doValidate(0)).toBeUndefined();
            let result = validator.doValidate(0);
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual("Expected 1.");

            result = validator.doValidate(0);
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual("Expected 2.");
        });
    });

    describe("BaseLimitValidator.isEqual", () => {
        test("should be equal to a similarly configured validator", () => {
            let a = new BaseLimitValidator(null);
            let b = new BaseLimitValidator(null);
            expect(a.isEqual(b)).toEqual(true);
        });

        test("should not be equal to differently configured validator", () => {
            let a = new BaseLimitValidator(null);
            let b = new BaseLimitValidator(1);
            expect(a.isEqual(b)).toEqual(false);

            let c = new BaseLimitValidator(null, 'Must be null.');
            expect(a.isEqual(c)).toEqual(false);
        });
    });
});

describe("MaxValueValidator", () => {
    describe("MaxValueValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new MaxValueValidator(100);
            expect(validator.message).toEqual("Ensure this value is less than or equal to {{ limit_value }}.");
            expect(validator.limit_value).toEqual(100);
            expect(validator.code).toEqual('invalid');

            let result = validator.doValidate(1000);
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual('Ensure this value is less than or equal to 100.');
        });

        test("should allow specifying error message", () => {
            let validator = new MaxValueValidator(100, 'Must be less than {{ limit_value }}.');
            expect(validator.message).toEqual("Must be less than {{ limit_value }}.");
        });
    });

    describe("MaxValueValidator.doValidation", () => {
        test("should validate different values", () => {
            let validator = new MaxValueValidator(100);
            expect(validator.doValidate(1)).toBeUndefined();
            expect(validator.doValidate(-10)).toBeUndefined();
            expect(validator.doValidate("15")).toBeUndefined();
            expect(validator.doValidate(undefined)).toBeUndefined();
            expect(validator.doValidate(false)).toBeUndefined();
            expect(validator.doValidate('null')).toBeUndefined();
            expect(validator.doValidate(101)).toBeInstanceOf(ValidationError);

            validator = new MaxValueValidator(new Date(2011, 10, 13));
            expect(validator.doValidate(new Date(2011, 10, 12))).toBeUndefined();
            expect(validator.doValidate(new Date(2011, 10, 14))).toBeInstanceOf(ValidationError);
        });
    });
});

describe("MinValueValidator", () => {
    describe("MinValueValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new MinValueValidator(100);
            expect(validator.message).toEqual("Ensure this value is greater than or equal to {{ limit_value }}.");
            expect(validator.limit_value).toEqual(100);
            expect(validator.code).toEqual('invalid');

            let result = validator.doValidate(1);
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual('Ensure this value is greater than or equal to 100.');
        });

        test("should allow specifying error message", () => {
            let validator = new MinValueValidator(100, 'Must be greater than {{ limit_value }}.');
            expect(validator.message).toEqual("Must be greater than {{ limit_value }}.");
        });
    });

    describe("MinValueValidator.doValidation", () => {
        test("should validate different values", () => {
            let validator = new MinValueValidator(100);
            expect(validator.doValidate(101)).toBeUndefined();
            expect(validator.doValidate("150")).toBeUndefined();
            expect(validator.doValidate(undefined)).toBeUndefined();
            expect(validator.doValidate('null')).toBeUndefined();
            expect(validator.doValidate(1)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(-10)).toBeInstanceOf(ValidationError);

            validator = new MinValueValidator(new Date(2011, 10, 13));
            expect(validator.doValidate(new Date(2011, 10, 14))).toBeUndefined();
            expect(validator.doValidate(new Date(2011, 10, 12))).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(false)).toBeInstanceOf(ValidationError);
        });
    });
});

describe("MaxLengthValidator", () => {
    describe("MaxLengthValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new MaxLengthValidator(2);
            expect(validator.message).toEqual("Ensure this value has at most {{ limit_value }} characters (it has {{ cleaned }}).");
            expect(validator.limit_value).toEqual(2);
            expect(validator.code).toEqual('invalid');

            let result = validator.doValidate("test");
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual('Ensure this value has at most 2 characters (it has 4).');
        });

        test("should allow specifying error message", () => {
            let validator = new MaxLengthValidator(100, 'Must be less than {{ limit_value }}.');
            expect(validator.message).toEqual("Must be less than {{ limit_value }}.");
        });
    });

    describe("MaxLengthValidator.doValidation", () => {
        test("should validate different values", () => {
            let validator = new MaxLengthValidator(10);
            expect(validator.doValidate(1)).toBeUndefined();
            expect(validator.doValidate(1.2)).toBeUndefined();
            expect(validator.doValidate([1,2,3])).toBeUndefined();
            expect(validator.doValidate("15")).toBeUndefined();
            expect(validator.doValidate(false)).toBeUndefined();
            expect(validator.doValidate(undefined)).toBeUndefined();
            expect(validator.doValidate('nothing I bring')).toBeInstanceOf(ValidationError);
            expect(validator.doValidate([1,2,3,4,5,6,7,8,9,0,1])).toBeInstanceOf(ValidationError);
        });
    });
});

describe("MinLengthValidator", () => {
    describe("MinLengthValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new MinLengthValidator(10);
            expect(validator.message).toEqual("Ensure this value has at least {{ limit_value }} characters (it has {{ cleaned }}).");
            expect(validator.limit_value).toEqual(10);
            expect(validator.code).toEqual('invalid');

            let result = validator.doValidate("one");
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toEqual('Ensure this value has at least 10 characters (it has 3).');
        });

        test("should allow specifying error message", () => {
            let validator = new MinLengthValidator(100, 'Must be greater than {{ limit_value }}.');
            expect(validator.message).toEqual("Must be greater than {{ limit_value }}.");
        });
    });

    describe("MinLengthValidator.doValidation", () => {
        test("should validate different values", () => {
            let validator = new MinLengthValidator(10);
            expect(validator.doValidate('nothing I bring')).toBeUndefined();
            expect(validator.doValidate([1,2,3,4,5,6,7,8,9,0,1])).toBeUndefined();
            expect(validator.doValidate(undefined)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(1)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(1.2)).toBeInstanceOf(ValidationError);
            expect(validator.doValidate([1,2,3])).toBeInstanceOf(ValidationError);
            expect(validator.doValidate("15")).toBeInstanceOf(ValidationError);
            expect(validator.doValidate(false)).toBeInstanceOf(ValidationError);

        });
    });
});