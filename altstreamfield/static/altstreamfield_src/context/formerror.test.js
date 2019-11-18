import FormErrorContext from "./formerror";

describe("FormErrorContext.FormErrorManager", () => {
    test('it should start in an OK status', () => {
        let manager = new FormErrorContext.FormErrorManager();
        expect(manager.isValid()).toEqual(true);
    });

    test('it should report an error if any report retains an error status.', () => {
        let manager = new FormErrorContext.FormErrorManager();
        expect(manager.isValid()).toEqual(true);
        manager.reportStatus('some-name', manager.STATUS_ERROR);
        expect(manager.isValid()).toEqual(false);
        manager.reportStatus('some-good-value', manager.STATUS_OK);
        expect(manager.isValid()).toEqual(false);
        manager.reportStatus('some-name', manager.STATUS_OK);
        expect(manager.isValid()).toEqual(true);
    });

    test('it should allow a reported status to be deleted (ie. a field is deleted)', () => {
        let manager = new FormErrorContext.FormErrorManager();
        expect(manager.isValid()).toEqual(true);
        manager.reportStatus('some-name', manager.STATUS_ERROR);
        expect(manager.isValid()).toEqual(false);
        manager.removeStatus('some-name');
        expect(manager.isValid()).toEqual(true);
    });

    test('it should allow subscribing to status reports.', () => {
        let last_report = null;
        let call_count = 0;
        let subscriber = (is_valid) => {
            last_report = is_valid;
            call_count += 1;
        }

        let manager = new FormErrorContext.FormErrorManager();
        expect(manager.isValid()).toEqual(true);
        manager.subscribe(subscriber);
        manager.reportStatus('some-name', manager.STATUS_OK);
        expect(call_count).toEqual(1);
        expect(last_report).toEqual(true);

        manager.reportStatus('some-name', manager.STATUS_ERROR);
        expect(call_count).toEqual(2);
        expect(last_report).toEqual(false);

        manager.removeStatus('some-name');
        expect(call_count).toEqual(3);
        expect(last_report).toEqual(true);
    });

    test('it should focus on an element reported by error name.', () => {
        document.body.innerHTML = '<div><input type="text" id="first" /><input type="text" id="second" /></div>';
        let manager = new FormErrorContext.FormErrorManager();
        expect(manager.isValid()).toEqual(true);
        manager.reportStatus('first', manager.STATUS_ERROR);
        manager.findError();
        expect(document.activeElement.id).toEqual('first');
        manager.reportStatus('second', manager.STATUS_ERROR);
        manager.findError();
        expect(document.activeElement.id).toEqual('first');
        manager.reportStatus('first', manager.STATUS_OK);
        manager.findError();
        expect(document.activeElement.id).toEqual('second');
        manager.reportStatus('third', manager.STATUS_ERROR);
        manager.reportStatus('second', manager.STATUS_OK);
        manager.findError();
        expect(document.activeElement.id).toEqual('second'); // because if the element cannot be found we do not change focus.
    });
});