import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageChooserField from "./imagechooserfield";
import FormErrorContext from "../../context/formerror";

describe('ImageChooserField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ImageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ImageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test DocumentChooser Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ImageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test DocumentChooser Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let old_jquery = window.jQuery;
        window.jQuery = {
            get: (url, callback, format) => {
                callback({
                    result: {
                        title: 'Test Image',
                        preview: '/image/preview/1',
                        edit_link: '/image/edit/1'
                    }
                })
            }
        }
        try {
            let container = render(<FormErrorContext.Provider value={manager}>
                <ImageChooserField owner_id="struct-01" value={1} name="test" onChange={() => {}} label="Test DocumentChooser Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(container.container).toMatchSnapshot();
        } finally {
            window.jQuery = old_jquery;
        }
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <ImageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test Char Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handle_change', () => {
        let current_value = null;
        let return_id = 3
        let onChange = (name, value) => {
            current_value = value;
        }
        window.ModalWorkflow = (opts) => {
            opts.responses.imageChosen({id: return_id});
        }
        let old_jquery = window.jQuery;
        window.jQuery = {
            get: (url, callback, format) => {
                callback({
                    result: {
                        title: 'Test Image',
                        preview: '/image/preview/' + return_id,
                        edit_link: '/image/edit/' + return_id
                    }
                })
            }
        }
        try {
            let manager = new FormErrorContext.FormErrorManager();
            let container = render(<FormErrorContext.Provider value={manager}>
                <ImageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(manager.isValid()).toEqual(false);
            let choose_btn = container.getByText("Choose an image");
            let error = container.container.getElementsByClassName('error-message')[0];
            expect(error.textContent).toEqual('This field is required.')

            fireEvent.click(choose_btn);
            container.rerender(<FormErrorContext.Provider value={manager}>
                <ImageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(current_value).toEqual(3);
            expect(manager.isValid()).toEqual(true);

            // This is sort of a hack to get a couple of code paths to test because simulating them normally is too difficult.
            current_value = null;
            container.rerender(<FormErrorContext.Provider value={manager}>
                <ImageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(current_value).toEqual(null);
            expect(manager.isValid()).toEqual(false);
        } finally {
            delete window.ModalWorkflow;
            window.jQuery = old_jquery;
        }

        cleanup();
    });
});