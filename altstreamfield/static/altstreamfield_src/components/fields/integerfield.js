import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { MaxValueValidator, MinValueValidator } from "../../validators/limits";
import { IntegerValidator } from "../../validators/integer";
import { name_to_label } from "../../utils/text";
import { run_validators } from "../../utils/validation";
import Field from "./field";

export default class IntegerField extends React.Component {
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

    parseInt(value) {
        value = parseInt(value, 10);
        if(isNaN(value)) {
            value = null;
        }
        return value;
    }

    parseString(value) {
        value = this.parseInt(value);
        if(value === null) {
            return '';
        } else {
            return value + '';
        }
    }

    handleChange(evt) {
        let value = this.parseInt(evt.target.value);
        this.props.onChange(this.props.name, value);
    }

    /**
     * Returns null or an error message if there is an error.
     */
    _validate() {
        let validators = [new IntegerValidator()];
        if(this.props.required && (this.props.value === null || this.props.value === undefined)) {
            return 'This field is required.';
        }

        if(this.props.min_value) {
            validators.push(new MinValueValidator(this.props.min_value));
        }
        if(this.props.max_value) {
            validators.push(new MaxValueValidator(this.props.max_value));
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
        let css_classes = "field integer_field";
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

                <input type="number" id={input_id} value={this.parseString(this.props.value)} placeholder={label} onChange={this.handleChange}/>
            </Field>;
    }
}

// Setup the React Context
IntegerField.contextType = FormErrorContext;

// This specifies the default new value.
IntegerField.default = 0;

IntegerField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    default: PropTypes.number,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    required: PropTypes.bool,
    max_value: PropTypes.number,
    min_value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}