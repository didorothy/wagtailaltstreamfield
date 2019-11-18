import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StreamField from "./streamfield";
import CharField from "../components/fields/charfield";
import StructBlock from "../components/structblock";
import StreamBlock from "../components/streamblock";

describe('app.StreamField', () => {
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

    test('#minimal', () => {
        let form = document.createElement('form');
        let el = document.createElement('input');
        el.type = 'hidden';
        el.value = '{"id": "10cbacdc-76de-4a23-a771-8d35ab0ce2f7", "type": "TestStreamBlock", "value": []}';
        form.appendChild(el);
        let container = render(<StreamField input_element={el} block_type={TestStreamBlock} />);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#baddata', () => {
        let form = document.createElement('form');
        let el = document.createElement('input');
        el.type = 'hidden';
        el.value = 'unparseable data';
        form.appendChild(el);
        let container = render(<StreamField input_element={el} block_type={TestStreamBlock} />);
        let parsed_value = JSON.parse(el.value);
        expect(parsed_value.value).toEqual([])
        expect(parsed_value.type).toEqual('TestStreamBlock');

        cleanup();
    });

    test('handleChange', () => {
        let form = document.createElement('form');
        let el = document.createElement('input');
        el.type = 'hidden';
        el.value = '{"id": "10cbacdc-76de-4a23-a771-8d35ab0ce2f7", "type": "TestStreamBlock", "value": []}';
        form.appendChild(el);
        let container = render(<StreamField input_element={el} block_type={TestStreamBlock} />);

        let add_btn = container.getByTitle('Add');
        fireEvent.click(add_btn);
        let block_type_btn = container.getByTitle('TestStructBlock');
        fireEvent.click(block_type_btn);
        container.rerender(<StreamField input_element={el} block_type={TestStreamBlock} />);
        let parsed_value = JSON.parse(el.value);
        expect(parsed_value.value).toBeDefined()
        expect(parsed_value.value.length).toEqual(1)

        cleanup();
    });

    test('handleSubmit', () => {
        let form = document.createElement('form');
        let el = document.createElement('input');
        el.type = 'hidden';
        el.value = '{"id": "10cbacdc-76de-4a23-a771-8d35ab0ce2f7", "type": "TestStreamBlock", "value": [{"id": "f991f631-ed23-4ed5-bff2-ec85b7f2a8e5", "type": "TestStructBlock", "value": {"url": ""}}]}';
        form.appendChild(el);

        let status = {
            stopPropagation: false,
            preventDefault: false,
            cancelSpinner: false,
        };
        function stopPropagation() {
            status.stopPropagation = true;
        }
        function preventDefault() {
            status.preventDefault = true;
        }
        function cancelSpinner() {
            status.cancelSpinner = true;
        }
        window.cancelSpinner = cancelSpinner;
        try {
            let r_el = new StreamField(
                {
                    input_element: el,
                    block_type: TestStreamBlock
                }
            );
            r_el.error_manager.reportStatus('test', r_el.error_manager.STATUS_ERROR);
            expect(r_el.error_manager.isValid()).toEqual(false);

            r_el.handleSubmit({
                preventDefault,
                stopPropagation,
            });
            expect(status.stopPropagation).toEqual(true);
            expect(status.preventDefault).toEqual(true);
            expect(status.cancelSpinner).toEqual(false);
        } finally {
            delete window.cancelSpinner;
        }

        cleanup();
    });
});