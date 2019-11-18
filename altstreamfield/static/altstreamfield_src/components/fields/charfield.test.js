import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CharField from "./charfield";
import FormErrorContext from "../../context/formerror";

describe('CharField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} label="Test Char Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value="sample text" name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value="" name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('min_length', () => {
        let current_value = "";
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: 'a'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('a');
        expect(manager.isValid()).toEqual(false);

        fireEvent.change(input, {target: {value: 'abc'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('abc');
        expect(manager.isValid()).toEqual(true);
        cleanup();
    });

    test('max_length', () => {
        let current_value = "";
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_length={3}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: 'a'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('a');
        expect(manager.isValid()).toEqual(true);

        fireEvent.change(input, {target: {value: 'abcd'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <CharField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} max_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('abcd');
        expect(manager.isValid()).toEqual(false);
        cleanup();
    });
});