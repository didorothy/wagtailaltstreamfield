import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RichTextField from "./richtextfield";
import FormErrorContext from "../../context/formerror";

class MockDraftailEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input_value: '',
        };
    }

    doSave(evt) {
        let value;
        if(this.props.rawContentState) {
            value = Object.assign({}, this.props.rawContentState);
        } else {
            value = {};
        }

        if(value.text) {
            value.text = Object.assign({}, value.text)
        } else {
            value.text = {}
        }

        if(value.text.blocks) {
            value.text.blocks = value.text.blocks.slice(0);
        } else {
            value.text.blocks = [];
        }

        value.text.blocks.push({
            text: this.state.input_value,
            type: 'unstyled'
        });

        this.props.onSave(value);

        this.setState({input_value: ''});
    }

    handleInputChange(evt) {
        this.setState({input_value: evt.target.value});
    }

    render() {
        return <div className="mock-draftail">
            <div>{JSON.stringify(this.props.rawContentState)}</div>
            <input type="text" value={this.state.input_value} onChange={this.handleInputChange.bind(this)}/>
            <button onClick={this.doSave.bind(this)}>Save</button>
        </div>
    }
}

describe('RichTextField', () => {
    let draftail_orig;
    beforeEach(() => {
        draftail_orig = window.Draftail;
        window.Draftail = {
            DraftailEditor: MockDraftailEditor,
            BLOCK_TYPE: {
                UNORDERED_LIST_ITEM: { type: 'ul' },
                ORDERED_LIST_ITEM: { type: 'ol' },
                BLOCKQUOTE: { type: 'blockquote' },
            },
            INLINE_STYLE: {
                BOLD: { type: 'strong' },
                ITALIC: { type: 'em' },
                UNDERLINE: { type: 'underline' },
                STRIKETHROUGH: { type: 'strike' },
            },
        }
    });

    afterEach(() => {
        window.Draftail = draftail_orig;
    });

    test('#minimal', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={null} name="test" onChange={() => {}} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#label', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test RichText Field" />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test RichText Field" help_text="Sample help text." />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#required', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test RichText Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={null} name="test" onChange={() => {}} label="Test RichText Field" help_text="Sample help text." required={true} />
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handle_change', () => {
        let current_value = null;
        let onChange = (name, value) => {
            current_value = value;
        }
        let manager = new FormErrorContext.FormErrorManager();
        let container = render(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test RichText Field" help_text="Sample help text." required={true}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        let input = container.container.getElementsByTagName('input')[0];
        let btn = container.getByText('Save')
        let error = container.container.getElementsByClassName('error-message')[0];
        expect(error.textContent).toEqual('This field is required.')

        fireEvent.change(input, {target: {value: 'a'}});
        fireEvent.click(btn);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test RichText Field" help_text="Sample help text." required={true}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual({text: {blocks: [{text: 'a', type: 'unstyled'}]}});
        expect(manager.isValid()).toEqual(true);

        fireEvent.change(input, {target: {value: 'abc'}});
        fireEvent.click(btn);
        container.rerender(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test RichText Field" help_text="Sample help text." required={true}/>
        </FormErrorContext.Provider>);
        expect(current_value).toEqual({text: {blocks: [{text: 'a', type: 'unstyled'}, {text: 'abc', type: 'unstyled'}]}});
        expect(manager.isValid()).toEqual(true);

        // This is a hack to try to bring the error message back.
        current_value = null;
        container.rerender(<FormErrorContext.Provider value={manager}>
            <RichTextField owner_id="struct-01" value={current_value} name="test" onChange={onChange} label="Test RichText Field" help_text="Sample help text." required={true}/>
        </FormErrorContext.Provider>);
        expect(manager.isValid()).toEqual(false);
        expect(error.textContent).toEqual('This field is required.')

        cleanup();
    });
});