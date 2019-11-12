import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { IntegerValidator } from "../../validators/integer";
import { name_to_label } from "../../utils/text";
import Field from "./field";
import Chooser from "./chooser";


export default class ImageChooserField extends React.Component {
    constructor(props, context) {
        super(props, context);

        let error_message = this._validate();

        this.state = {
            error: error_message === null ? false : true,
            error_message: error_message || '',
            image_id: null,
            image_name: '',
            image_url: '',
            edit_url: '',
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
        let validators = [new IntegerValidator()];
        if(this.props.required && !this.props.value) {
            return 'This field is required.';
        }

        // if the field is not required and the value evaluates to false then no further validation.
        if(!this.props.required && !this.props.value) {
            return null;
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

    updateImage() {
        if(this.props.value && this.props.value !== this.state.image_id) {
            window.jQuery.get(
                window.chooserUrls.imageChooser + this.props.value + '/',
                (data) => {
                    this.setState({
                        image_id: this.props.value,
                        image_name: data['result']['title'],
                        image_url: data['result']['preview']['url'],
                        edit_url: data['result']['edit_link']
                    });
                },
                'json'
            );
        } else if(!this.props.value && this.state.image_id) {
            this.setState({
                image_id: this.props.value,
                image_name: '',
                image_url: '',
                edit_url: '',
            });
        }
    }

    componentDidMount() {
        this.updateImage();
    }

    componentDidUpdate() {
        this.validate();
        // Report status up the tree.
        this.context.reportStatus(this.props.owner_id + this.props.name, this.state.error ? this.context.STATUS_ERROR : this.context.STATUS_OK);

        this.updateImage();
    }

    componentWillUnmount() {
        this.context.removeStatus(this.props.owner_id + this.props.name);
    }

    render() {
        let label = this.props.label || name_to_label(this.props.name);
        let input_id = this.props.owner_id + this.props.name;
        let css_classes = "field image_chooser_field";
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

                <Chooser
                    url={window.chooserUrls.imageChooser}
                    modalOnLoadHandlers={window.IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS}
                    chooserType="image"
                    inputId={input_id}
                    value={this.props.value}
                    editUrl={this.state.edit_url}
                    className="image-chooser"
                    required={this.props.required}
                    onChosen={this.handleChange}>

                    {this.props.value && <div className="preview-image">
                        <img alt={this.state.image_name} src={this.state.image_url} title={this.state.image_name} />
                    </div>}
                </Chooser>
            </Field>;
    }
}

// Setup the React Context
ImageChooserField.contextType = FormErrorContext;

// This specifies the default new value.
ImageChooserField.default = null;

ImageChooserField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.number,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
}