import React from "react";
import PropTypes from "prop-types";

import Link from "../../vendor/wagtail/decorators/link";
import Document from "../../vendor/wagtail/decorators/document";
import Embed from "../../vendor/wagtail/blocks/embedblock";
import Image from "../../vendor/wagtail/blocks/imageblock";
import ModalWorkflowSource from "../../vendor/wagtail/modalworkflowsource";

import FormErrorContext from "../../context/formerror";
import { name_to_label } from "../../utils/text";
import { run_validators } from "../../utils/validation";
import Field from "./field";
import Icon from "../../vendor/wagtail/icon";




export default class RichTextField extends React.Component {
    constructor(props, context) {
        super(props, context);

        let error_message = this._validate();

        this.state = {
            error: error_message === null ? false : true,
            error_message: error_message || '',
        }
        this.handleChange = this.handleChange.bind(this);

        // Report our status right away
        this.context.reportStatus(this.props.owner_id + this.props.name, this.state.error ? this.context.STATUS_ERROR : this.context.STATUS_OK);
    }

    handleChange(value) {
        this.props.onChange(this.props.name, value);
    }

    /**
     * Returns null or an error message if there is an error.
     */
    _validate() {
        let validators = [];
        if(this.props.required && !this.props.value) {
            return 'This field is required.';
        }

       return run_validators(validators, this.props.value);
    }

    validate() {
        let message = this._validate();
        if(message === null) {
            if(this.state.error) {
                this.setState({
                    error: false,
                    error_message: ''
                });
            }
        } else {
            if(this.state.error_message != message) {
                this.setState({
                    error: true,
                    error_message: message
                })
            }
        }
    }

    componentDidMount() {
        /*setTimeout(() => {
            window.autosize(window.jQuery('#' + this.props.owner_id + this.props.name));
        }, 10);*/
    }

    componentDidUpdate() {
        this.validate();
        // Report status up the tree.
        this.context.reportStatus(this.props.owner_id + this.props.name, this.state.error ? this.context.STATUS_ERROR : this.context.STATUS_OK);
    }

    componentWillUnmount() {
        this.context.removeStatus(this.props.owner_id + this.props.name);
    }

    render() {
        let label = this.props.label || name_to_label(this.props.name);
        let input_id = this.props.owner_id + this.props.name;
        let css_classes = "field text_field";
        if(this.props.required) {
            css_classes += " required";
        }
        if(this.state.error) {
            css_classes += " error";
        }
        let DraftailEditor = window.Draftail.DraftailEditor;
        let BLOCK_TYPE = window.Draftail.BLOCK_TYPE;
        let INLINE_STYLE = window.Draftail.INLINE_STYLE;
        let entityTypes = [
            {
                type: 'LINK',
                description: "Link",
                source: ModalWorkflowSource,
                decorator: Link,
                icon: <Icon name="link"/>,
                attributes: ["url", "id", "parentId"],
                whitelist: {href: "^http:|https:|undefiend$"}
            },
            {
                type: 'DOCUMENT',
                description: "Document",
                source: ModalWorkflowSource,
                decorator: Document,
                icon: <Icon name="doc-empty"/>,
            }
        ];
        let value = this.props.value;
        if(typeof value === 'string') {
            console.log(value);
            try {
                value = window.DraftJS.convertFromHTML(value);
                if(value.contentBlocks) {
                    value.blocks = value.contentBlocks.map(item => item);
                } else {
                    value = null;
                }
            } catch {
                value = null;
            }
        }

        return <Field
            css_classes={css_classes}
            input_id={input_id}
            label={label}
            help_text={this.props.help_text}
            error={this.state.error ? this.state.error_message : ''}>

                <DraftailEditor
                    rawContentState={value || null}
                    onSave={this.handleChange}
                    blockTypes={[
                        {type: BLOCK_TYPE.UNORDERED_LIST_ITEM},
                        {type: BLOCK_TYPE.ORDERED_LIST_ITEM},
                        {type: BLOCK_TYPE.BLOCKQUOTE},
                    ]}
                    inlineStyles={[
                        {type: INLINE_STYLE.BOLD},
                        {type: INLINE_STYLE.ITALIC},
                        {type: INLINE_STYLE.UNDERLINE},
                        {type: INLINE_STYLE.STRIKETHROUGH},
                    ]}
                    entityTypes={entityTypes}
                />
            </Field>;
    }
}
//<textarea id={input_id} value={this.props.value} placeholder={label} cols="40" rows="1" onChange={this.handleChange}/>

// Setup the React Context
RichTextField.contextType = FormErrorContext;

// This specifies the default new value.
RichTextField.default = null;

RichTextField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.object,
    default: PropTypes.object,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};