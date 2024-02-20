import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import IntegerField from "./integerfield";
import FormErrorContext from "../../context/formerror";


describe('IntegerField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={1} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={1} name="test" onChange={() => {}} label="Test Char Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={1} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={1} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('min_value', () => {
        let current_value = null;
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_value={3}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: '1'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_value={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(1);
        expect(manager.isValid()).toEqual(false);

        fireEvent.change(input, {target: {value: '3'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_value={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(3);
        expect(manager.isValid()).toEqual(true);
        cleanup();
    });

    test('max_length', () => {
        let current_value = null;
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_value={3}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: "1"}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_value={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(1);
        expect(manager.isValid()).toEqual(true);

        fireEvent.change(input, {target: {value: "4"}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <IntegerField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_value={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual(4);
        expect(manager.isValid()).toEqual(false);
        cleanup();
    });
});