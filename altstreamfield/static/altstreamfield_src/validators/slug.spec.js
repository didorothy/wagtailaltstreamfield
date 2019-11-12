import { assert } from 'chai';
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
        it("should have default error message and code", () => {
            let validator = new SlugValidator();
            assert.equal(validator.message, 'Enter a valid "slug" consisting of letters, numbers, underscores, or hyphens.');
            assert.equal(validator.code, 'invalid');
        });

        it("should allow specifying error message", () => {
            let validator = new SlugValidator('Enter a valid URL slug.');
            assert.equal(validator.message, "Enter a valid URL slug.");
        });
    });

    describe("SlugValidator.doValidate", () => {
        it("should validate various values", () => {
            let validator = new SlugValidator();
            for(let i = 0; i < valid_slugs.length; ++i) {
                assert.isUndefined(validator.doValidate(valid_slugs[i]));
            }

            for(let i = 0; i < invalid_slugs.length; ++i) {
                assert.instanceOf(validator.doValidate(invalid_slugs[i]), ValidationError);
            }
        });
    });
});

describe("UnicodeSlugValidator", () => {
    describe("UnicodeSlugValidator.constructor", () => {
        it("should have default error message and code", () => {
            let validator = new UnicodeSlugValidator();
            assert.equal(validator.message, 'Enter a valid "slug" consisting of Unicode letters, numbers, underscores, or hyphens.');
            assert.equal(validator.code, 'invalid');
        });

        it("should allow specifying error message", () => {
            let validator = new UnicodeSlugValidator('Enter a valid URL slug.');
            assert.equal(validator.message, "Enter a valid URL slug.");
        });
    });

    describe("UnicodeSlugValidator.doValidate", () => {
        it("should validate various values", () => {
            let validator = new UnicodeSlugValidator();
            for(let i = 0; i < valid_unicode_slugs.length; ++i) {
                assert.isUndefined(validator.doValidate(valid_unicode_slugs[i]));
            }

            for(let i = 0; i < invalid_unicode_slugs.length; ++i) {
                assert.instanceOf(validator.doValidate(invalid_unicode_slugs[i]), ValidationError);
            }
        });
    });
})