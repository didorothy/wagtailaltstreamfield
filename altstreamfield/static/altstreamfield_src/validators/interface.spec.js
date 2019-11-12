import { assert } from 'chai';
import { ValidationError } from "./interface";

describe('ValidationError', () => {
    it("Should allow undefined codes.", () => {
        let err = new ValidationError("Test");
        assert.equal(err.message, "Test");
        assert.equal(err.code, "invalid");
    });

    it("Should allow special codes.", () => {
        let err = new ValidationError("Test", "bad_result");
        assert.equal(err.message, "Test");
        assert.equal(err.code, "bad_result");
    });

    it("Should allow for message templating", () => {
        let err = new ValidationError('There were too many {{ name }} for your {{ kind }}.', undefined, {name: 'people', kind: 'automobile'});
        assert.equal(err.message, "There were too many people for your automobile.");
    })
})