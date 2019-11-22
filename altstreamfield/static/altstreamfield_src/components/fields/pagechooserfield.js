import React from "react";
import PropTypes from "prop-types";

import FormErrorContext from "../../context/formerror";
import { IntegerValidator } from "../../validators/integer";
import { name_to_label } from "../../utils/text";
import { run_validators } from "../../utils/validation";
import Field from "./field";
import Chooser from "./chooser";


export default class PageChooserField extends React.Component {
    constructor(props, context) {
        super(props, context);

        let error_message = this._validate();

        this.state = {
            error: error_message === null ? false : true,
            error_message: error_message || '',
            page_id: null,
            page_name: '',
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

    updatePageTitle() {
        if(this.props.value && this.props.value !== this.state.page_id) {
            window.jQuery.get(
                window.chooserUrls.pageChooser + 'data/' + this.props.value + '/',
                (data) => {
                    this.setState({
                        page_id: this.props.value,
                        page_title: data['result']['title'],
                        edit_url: data['result']['edit_link'],
                    });
                },
                'json'
            );
        } else if(!this.props.value && this.state.page_id) {
            this.setState({
                page_id: this.props.value,
                page_title: '',
                edit_url: '',
            });
        }
    }

    componentDidMount() {
        this.updatePageTitle();
    }

    componentDidUpdate() {
        this.validate();
        // Report status up the tree.
        this.context.reportStatus(this.props.owner_id + this.props.name, this.state.error ? this.context.STATUS_ERROR : this.context.STATUS_OK);

        this.updatePageTitle();
    }

    componentWillUnmount() {
        this.context.removeStatus(this.props.owner_id + this.props.name);
    }

    render() {
        let label = this.props.label || name_to_label(this.props.name);
        let input_id = this.props.owner_id + this.props.name;
        let css_classes = "field page_chooser_field";
        if(this.props.required) {
            css_classes += " required";
        }
        if(this.state.error) {
            css_classes += " error";
        }

        let urlParams = {};
        if(this.props.target_model) {
            urlParams.page_type = this.props.target_model;
        }

        if(this.props.can_choose_root) {
            urlParams.can_choose_root = true;
        }

        return <Field
            css_classes={css_classes}
            input_id={input_id}
            label={label}
            help_text={this.props.help_text}
            error={this.state.error ? this.state.error_message : ''}>

                <Chooser
                    url={window.chooserUrls.pageChooser}
                    urlParams={urlParams}
                    modalOnLoadHandlers={window.PAGE_CHOOSER_MODAL_ONLOAD_HANDLERS}
                    chooserType="page"
                    inputId={input_id}
                    value={this.props.value}
                    editUrl={this.state.edit_url}
                    className="page-chooser"
                    required={this.props.required}
                    onChosen={this.handleChange}>

                    {this.props.value && <span className="title">{this.state.page_title}</span>}
                </Chooser>
            </Field>;
    }
}

// Setup the React Context
PageChooserField.contextType = FormErrorContext;

// This specifies the default new value.
PageChooserField.default = null;

PageChooserField.propTypes = {
    owner_id: PropTypes.string.isRequired,
    value: PropTypes.number,
    default: PropTypes.number,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    help_text: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    target_model: PropTypes.string,
    can_choose_root: PropTypes.bool,
}