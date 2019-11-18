import { ValidationError, Validator } from "./interface";

describe('ValidationError', () => {
    test("Should allow undefined codes.", () => {
        let err = new ValidationError("Test");
        expect(err.message).toEqual("Test");
        expect(err.code).toEqual("invalid");
    });

    test("Should allow special codes.", () => {
        let err = new ValidationError("Test", "bad_result");
        expect(err.message).toEqual("Test");
        expect(err.code).toEqual("bad_result");
    });

    test("Should allow for message templating", () => {
        let err = new ValidationError('There were too many {{ name }} for your {{ kind }}.', undefined, {name: 'people', kind: 'automobile'});
        expect(err.message).toEqual("There were too many people for your automobile.");
    })
})

describe('Validator', () => {
    test("doValidation raise not implemented", () => {
        let val = new Validator()
        expect(() => {
            val.doValidate('value');
        }).toThrow();
    });

    test("isEqual raise not implemented", () => {
        let val = new Validator()
        expect(() => {
            val.isEqual('value');
        }).toThrow();
    });
});