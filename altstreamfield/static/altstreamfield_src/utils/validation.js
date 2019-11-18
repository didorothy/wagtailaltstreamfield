/**
 * Runs a list of validators against a value and returns a message from the first failing validator.
 * @param {Array} validators The array of validators to run.
 * @param {*} value The value to validate.
 * @returns {String} Returns a validation message if not valid otherwise returns null.
 */
export function run_validators(validators, value) {
    for(let i = 0; i < validators.length; ++i) {
        let err = validators[i].doValidate(value);
        if(err) {
            return err.message;
        }
    }
    return null;
}
