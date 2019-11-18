import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormErrorContext from "../context/formerror";
import StructBlock from "./structblock";
import CharField from "./fields/charfield";

describe("StructBlock", () => {
    test("#minimal", () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block = {
            id: '8d0f0232-07c8-11ea-8d71-362b9e155667',
            type: 'StructBlock',
            value: {
                'one': '',
            }
        };
        let fields = [{
            name: "one",
            field_type: CharField,
            args: {
                "name": "one",
                "label": "One",
                "required": true,
                "help_text": "Sample help text.",
                "strip": true,
                "min_length": null,
                "max_length": 255
            }
        }];
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlock block={block} fields={fields} onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handle change', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block = {
            id: '8d0f0232-07c8-11ea-8d71-362b9e155667',
            type: 'StructBlock',
            value: {
                'one': '',
            }
        };
        let fields = [{
            name: "one",
            field_type: CharField,
            args: {
                "name": "one",
                "label": "One",
                "required": true,
                "help_text": "Sample help text.",
                "strip": true,
                "min_length": null,
                "max_length": 255
            }
        }];
        function on_change(value) {
            block = value;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlock block={block} fields={fields} onChange={on_change} />
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        fireEvent.change(input, {target: {value: 'test'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StructBlock block={block} fields={fields} onChange={on_change} />
        </FormErrorContext.Provider>)
        expect(manager.isValid()).toEqual(true);
        expect(block.value.one).toEqual('test');

    });
});