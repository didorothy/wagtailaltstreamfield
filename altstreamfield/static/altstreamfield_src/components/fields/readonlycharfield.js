import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { name_to_label } from "../../utils/text";
import { run_validators } from "../../utils/validation";
import Field from "./field";

export default class ReadOnlyCharField extends React.Component {
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

    handleChange(evt) {
        this.props.onChange(this.props.name, this.props.value);
    }

    /**
     * Returns null or an error message if there is an error.
     */
    _validate() {
        let validators = [];

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
        let css_classes = "field char_field";
        if(this.props.required) {
            css_classes += " required";
        }
        if(this.state.error) {
            css_classes += " error";
        }
        return <Field
            css_classes={css_classes}
            input_id={input_id}
            label={label}
            help_text={this.props.help_text}
            error={this.state.error ? this.state.error_message : ''}>

                <input type="text" readOnly={true} id={input_id} value={this.props.value} />
            </Field>;
    }
}

// Setup the React Context
ReadOnlyCharField.contextType = FormErrorContext;

// This specifies the default new value.
ReadOnlyCharField.default = '';

ReadOnlyCharField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    strip: PropTypes.bool,
//    required: PropTypes.bool,
//    max_length: PropTypes.number,
//    min_length: PropTypes.number,
//    onChange: PropTypes.func.isRequired,
}