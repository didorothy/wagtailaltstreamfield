import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BooleanField from "./booleanfield";
import FormErrorContext from "../../context/formerror";

describe('BooleanField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={false} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={false} name="test" onChange={() => {}} label="Test Char Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={false} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={true} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={false} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handle_change', () => {
        let current_value = false;
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.click(input);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(true);
        expect(manager.isValid()).toEqual(true);

        fireEvent.click(input);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <BooleanField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(false);
        expect(manager.isValid()).toEqual(false);

        cleanup();
    });
});