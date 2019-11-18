import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StreamBlockField from "./streamblockfield";
import FormErrorContext from "../../context/formerror";
import CharField from "./charfield";
import StructBlock from "../structblock";
import StreamBlock from "../streamblock";

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

class TestStreamBlock extends React.Component {
    render() {
        return <StreamBlock block={this.props.block} blockTypes={block_types} onChange={this.props.onChange}/>;
    }
}

TestStreamBlock.type = 'TestStreamBlock';
TestStreamBlock.icon = 'placeholder';
TestStreamBlock.default_value = [];


describe('StreamBlockField', () => {
    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={{value: []}} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={{value: []}} name="test" onChange={() => {}} label="Test StreamBlock Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={{value: []}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={{value: [{type: 'TestStructBlock', value: {}, id: '44c5e004-85b8-4280-9730-2822e4782230'}]}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={{value: []}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#string_block', () => {
        window.TestStreamBlock = TestStreamBlock;
        try {
            let manager = new FormErrorContext.FormErrorManager();
            let container = render(<FormErrorContext.Provider value={manager}>
                <StreamBlockField owner_id="struct-01" block="TestStreamBlock" value={{value: [{type: 'TestStructBlock', value: {}, id: '44c5e004-85b8-4280-9730-2822e4782230'}]}} name="test" onChange={() => {}} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
            </FormErrorContext.Provider>);
            expect(container.container).toMatchSnapshot();
        } finally {
            delete window.TestStreamBlock;
        }
        cleanup();
    });

    test('handle_change', () => {
        let current_value = {
            value: [
                {
                    id: '',
                    type: 'TestStructBlock',
                    value: {
                        url: ''
                    }
                }
            ]
        };
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);

        let input = container.container.getElementsByTagName('input')[0];
        fireEvent.change(input, {target: {value: 'test'}});
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value.value[0].value.url).toEqual('test')
        expect(manager.isValid()).toEqual(true);

        let delete_btn = container.getByTitle('Delete');
        fireEvent.click(delete_btn);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value.value.length).toEqual(0);
        expect(manager.isValid()).toEqual(false);
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.');

        let add_btn = container.getByTitle('Add');
        fireEvent.click(add_btn);
        let block_type_btn = container.getByText('TestStructBlock');
        fireEvent.click(block_type_btn);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StreamBlockField owner_id="struct-01" block={TestStreamBlock} value={current_value} name="test" onChange={onChange} label="Test StreamBlock Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(current_value.value.length).toEqual(1);
        expect(manager.isValid()).toEqual(false);

        cleanup();
    });
});