import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ChoiceField from "./choicefield";
import FormErrorContext from "../../context/formerror";

describe('ChoiceField', () => {
    let choices = [
        ['one', 'One'],
        ['two', 'Two'],
        ['three', 'Three'],
    ];

    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value="one" choices={choices} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value="one" choices={choices} name="test" onChange={() => {}} label="Test Char Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value="one" choices={choices} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value="one" choices={choices} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value="" choices={choices} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handles update', () => {
        let current_value = "";
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value={current_value} choices={choices} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('select')[0];
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: 'one'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value={current_value} choices={choices} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('one');
        expect(manager.isValid()).toEqual(true);

        fireEvent.change(input, {target: {value: 'six'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <ChoiceField owner_id="struct-01" value={current_value} choices={choices} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} min_length={3}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual('');
        expect(manager.isValid()).toEqual(false);

        cleanup();
    });
});