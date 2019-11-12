import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { MaxLengthValidator, MinLengthValidator } from "../../validators/limits";
import { name_to_label } from "../../utils/text";
import Field from "./field";

export default class CharField extends React.Component {
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
        this.props.onChange(this.props.name, evt.target.value);
    }

    /**
     * Returns null or an error message if there is an error.
     */
    _validate() {
        let validators = [];
        if(this.props.required && !this.props.value.trim()) {
            return 'This field is required.';
        }

        if(this.props.min_length) {
            validators.push(new MinLengthValidator(this.props.min_length));
        }
        if(this.props.max_length) {
            validators.push(new MaxLengthValidator(this.props.max_length));
        }

        for(let i = 0; i < validators.length; ++i) {
            let err = validators[i].doValidate(this.props.value);
            if(err) {
                return err.message;
            }
        }

        return null;
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

                <input type="text" id={input_id} value={this.props.value} placeholder={label} onChange={this.handleChange}/>
            </Field>;
    }
}

// Setup the React Context
CharField.contextType = FormErrorContext;

// This specifies the default new value.
CharField.default = '';

CharField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    required: PropTypes.bool,
    max_length: PropTypes.number,
    min_length: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}