import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { MaxLengthValidator, MinLengthValidator } from "../../validators/limits";
import { name_to_label } from "../../utils/text";
import { run_validators } from "../../utils/validation";
import Field from "./field";

export default class TextField extends React.Component {
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
        setTimeout(() => {
            try {
                window.autosize(window.jQuery('#' + this.props.owner_id + this.props.name));
            } catch(ex) {
                // during testing window.autosize may not exist at some point.
            }
        }, 10);
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
        return <Field
            css_classes={css_classes}
            input_id={input_id}
            label={label}
            help_text={this.props.help_text}
            error={this.state.error ? this.state.error_message : ''}>

                <textarea id={input_id} value={this.props.value} placeholder={label} cols="40" rows="1" onChange={this.handleChange}/>
            </Field>;
    }
}

//<textarea  id="body-0-value" placeholder="Preformatted" data-autosize-on="true" style="overflow: hidden; overflow-wrap: break-word; resize: horizontal; height: 91px;"></textarea>

// Setup the React Context
TextField.contextType = FormErrorContext;

// This specifies the default new value.
TextField.default = '';

TextField.propTypes = {
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