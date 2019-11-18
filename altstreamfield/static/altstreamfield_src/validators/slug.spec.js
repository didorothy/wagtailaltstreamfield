import { SlugValidator, UnicodeSlugValidator } from "./slug";
import { ValidationError } from "./interface";

let valid_slugs = [
    'slug-ok',
    'longer-slug-still-ok',
    '--------',
    'nohyphensoranything',
    'a',
    '1',
    'a1',
];

let invalid_slugs = [
    '',
    ' text ',
    ' ',
    'some@mail.com',
    '你好',
    '你 好',
    '\n',
    'trailing-newline\n',
];

let valid_unicode_slugs = [
    'slug-ok',
    'longer-slug-still-ok',
    '--------',
    'nohyphensoranything',
    'a',
    '1',
    'a1',
    '\u4F60\u597D',
];

let invalid_unicode_slugs = [
    '',
    ' text ',
    ' ',
    'some@mail.com',
    '\n',
    '\u4F60 \u597D',
    'trailing-newline\n',
];

describe("SlugValidator", () => {
    describe("SlugValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new SlugValidator();
            expect(validator.message).toEqual('Enter a valid "slug" consisting of letters, numbers, underscores, or hyphens.');
            expect(validator.code).toEqual('invalid');
        });

        test("should allow specifying error message", () => {
            let validator = new SlugValidator('Enter a valid URL slug.');
            expect(validator.message).toEqual("Enter a valid URL slug.");
        });
    });

    describe("SlugValidator.doValidate", () => {
        test("should validate various values", () => {
            let validator = new SlugValidator();
            for(let i = 0; i < valid_slugs.length; ++i) {
                expect(validator.doValidate(valid_slugs[i])).toBeUndefined();
            }

            for(let i = 0; i < invalid_slugs.length; ++i) {
                expect(validator.doValidate(invalid_slugs[i])).toBeInstanceOf(ValidationError);
            }
        });
    });
});

describe("UnicodeSlugValidator", () => {
    describe("UnicodeSlugValidator.constructor", () => {
        test("should have default error message and code", () => {
            let validator = new UnicodeSlugValidator();
            expect(validator.message).toEqual('Enter a valid "slug" consisting of Unicode letters, numbers, underscores, or hyphens.');
            expect(validator.code).toEqual('invalid');
        });

        test("should allow specifying error message", () => {
            let validator = new UnicodeSlugValidator('Enter a valid URL slug.');
            expect(validator.message).toEqual("Enter a valid URL slug.");
        });
    });

    describe("UnicodeSlugValidator.doValidate", () => {
        test("should validate various values", () => {
            let validator = new UnicodeSlugValidator();
            for(let i = 0; i < valid_unicode_slugs.length; ++i) {
                expect(validator.doValidate(valid_unicode_slugs[i])).toBeUndefined();
            }

            for(let i = 0; i < invalid_unicode_slugs.length; ++i) {
                expect(validator.doValidate(invalid_unicode_slugs[i])).toBeInstanceOf(ValidationError);
            }
        });
    });
})