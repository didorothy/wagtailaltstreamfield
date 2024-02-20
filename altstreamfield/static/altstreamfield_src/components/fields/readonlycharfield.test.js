import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReadOnlyCharField from "./readonlycharfield";
import FormErrorContext from "../../context/formerror";

describe('CharField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ReadOnlyCharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ReadOnlyCharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} label="Test Char Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ReadOnlyCharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('ensure readonly react', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let value = 'sample text';
        function handleChange(name, val) {
            value = val;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <ReadOnlyCharField owner_id="struct-01" value={value} name="test" onChange={handleChange} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        let index = container.container.getElementsByTagName('input')[0];
        fireEvent.change(index, {target: {value: 'oops'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <ReadOnlyCharField owner_id="struct-01" value={value} name="test" onChange={handleChange} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(value).toEqual('sample text');
        cleanup();
    });

    test('ensure readonly code', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let value = 'sample text';
        function handleChange(name, val) {
            value = val;
        }
        let field = new ReadOnlyCharField(
            {
                owner_id: 'struct-01',
                name: 'test',
                value: value,
                label: 'Test Field',
                help_text: 'Some help.',
                strip: true,
                onChange: handleChange,
            }, manager
        );

        field.handleChange({target: {value: 'oops'}});
        expect(value).toEqual('sample text');
    });

});