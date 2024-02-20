import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import StructBlockField from "./structblockfield";
import FormErrorContext from "../../context/formerror";
import CharField from "./charfield";
import StructBlock from "../structblock";

let fields = [
    {
        "name": "url",
        "field_type": "CharField",
        "args": {
            "name": "url",
            "label": "Url",
            "required": true,
            "help_text": "",
            "strip": true,
            "min_length": null,
            "max_length": 255
        }
    }
];
let field = CharField;
fields[0].field_type = field;

class TestStructBlock extends React.Component {
    render() {
        return <StructBlock block={this.props.block} fields={fields} onChange={this.props.onChange}/>;
    }
}
TestStructBlock.type = 'TestStructBlock';
TestStructBlock.icon = 'placeholder';
TestStructBlock.default_value = {};


let block_types = {TestStructBlock};

describe('StructBlockField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={{value: {}}} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={{value: {}}} name="test" onChange={() => {}} label="Test StreamBlock Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={{value: {}}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={{type: 'TestStructBlock', value: {}, id: '44c5e004-85b8-4280-9730-2822e4782230'}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={{value: {}}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#string_block', () => {
        window.TestStructBlock = TestStructBlock;
        try {
            let manager = new FormErrorContext.FormErrorManager();
            let container = render(<FormErrorContext.Provider value={manager}>
                <StructBlockField owner_id="struct-01" block="TestStructBlock" value={{type: 'TestStructBlock', value: {}, id: '44c5e004-85b8-4280-9730-2822e4782230'}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(container.container).toMatchSnapshot();
        } finally {
            delete window.TestStructBlock;
        }
        cleanup();
    });

    test('handle_change', () => {
        let current_value = {
            id: '',
            type: 'TestStructBlock',
            value: {
                url: ''
            }
        };
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);

        let input = container.container.getElementsByTagName('input')[0];
        fireEvent.change(input, {target: {value: 'test'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value.value.url).toEqual('test')
        expect(manager.isValid()).toEqual(true);

        input = container.container.getElementsByTagName('input')[0];
        fireEvent.change(input, {target: {value: ''}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StructBlockField owner_id="struct-01" block={TestStructBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value.value.url).toEqual('')
        expect(manager.isValid()).toEqual(false);

        cleanup();
    });
});