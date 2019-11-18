import { run_validators } from "./validation";
import { MaxLengthValidator, MinLengthValidator } from "../validators/limits";

describe('utils.validation.run_validators', () => {
    test('it should run no validators', () => {
        expect(run_validators([], 'test')).toBeNull();
    });

    test('it should run multiple validators', () => {
        let validators = [
            new MaxLengthValidator(4, 'Must be less than 5 chars in length.'),
            new MinLengthValidator(1, 'Must be 1 or more chars in length.'),
        ];

        expect(run_validators(validators, "")).toEqual('Must be 1 or more chars in length.');
        expect(run_validators(validators, "Green")).toEqual('Must be less than 5 chars in length.');
        expect(run_validators(validators, "ax")).toBeNull;
    });
});