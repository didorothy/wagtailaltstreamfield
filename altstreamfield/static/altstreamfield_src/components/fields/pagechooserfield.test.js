import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageChooserField from "./pagechooserfield";
import FormErrorContext from "../../context/formerror";

describe('PageChooserField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test PageChooser Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test PageChooser Field" help_text="Sample help text." />
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
                        title: 'Home Page',
                        edit_link: '/pages/1/edit/'
                    }
                })
            }
        }
        try {
            let container = render(<FormErrorContext.Provider value={manager}>
                <PageChooserField owner_id="struct-01" value={1} name="test" onChange={() => {}} label="Test PageChooser Field" help_text="Sample help text." required={true} />
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
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test PageChooser Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#target_model', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test PageChooser Field" help_text="Sample help text." target_model="wagtailcore.Page" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#can_choose_root', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <PageChooserField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test PageChooser Field" help_text="Sample help text." can_choose_root={true} />
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
            opts.responses.pageChosen({id: return_id});
        }
        let old_jquery = window.jQuery;
        window.jQuery = {
            get: (url, callback, format) => {
                callback({
                    result: {
                        title: 'Home Page',
                        edit_link: '/pages/' + return_id + '/edit/'
                    }
                })
            }
        }
        try {
            let manager = new FormErrorContext.FormErrorManager();
            let container = render(<FormErrorContext.Provider value={manager}>
                <PageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test PageChooser Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(manager.isValid()).toEqual(false);
            let choose_btn = container.getByText("Choose a page");
            let error = container.container.getElementsByClassName('error-message')[0];
            expect(error.textContent).toEqual('This field is required.')

            fireEvent.click(choose_btn);
            container.rerender(<FormErrorContext.Provider value={manager}>
                <PageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(current_value).toEqual(3);
            expect(manager.isValid()).toEqual(true);

            // This is sort of a hack to get a couple of code paths to test because simulating them normally is too difficult.
            current_value = null;
            container.rerender(<FormErrorContext.Provider value={manager}>
                <PageChooserField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test Char Field" help_text="Sample help text." required={true} />
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