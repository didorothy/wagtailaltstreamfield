Customization
=============

If you need some special capabilities this document provides some insights to the inner workings.


Custom Fields
-------------

If you need a Field type that is not provided with the package you need to create a new class that inherits from `altstreamfield.fields.Field` or another class from the `altstreamfield.fields` module.

Every field must be able to generate JavaScript to create itself.
For your customizations that means that your field should provide a new definition of the `media` property to include your JavaScript component of the Custom Field.
Additionally, if your custom field requires additional arguments to be passed from the Python to the JavaScript you will also have to at least update the `args_list` member and possibly override the `get_args()` method if custom output is needed.

Below is an example of what a custom Field might look like:

.. code-block:: python
   :linenos:

    from django.forms.widgets import Media

    from altstreamfield.blocks.fields import Field


    class MyCustomField(Field):
        args_list = Field.args_list + [
            'a_special_field',
        ]

        def __init__(self, a_special_field, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.a_special_field = a_special_field

        @property
        def media(self):
            return Media(js=['myapp/mycustomfield.js'])

        def get_args(self):
            args = super().get_args()
            args['a_special_field'] = args['a_special_field'].strip()
            return args

To create the custom JavaScript needed you will have to build a React component.
The component name must match the class name in Python.
The following provides an example to give an idea of the basics.

.. code-block:: jsx
    :linenos:

    import React from "react";

    export default MyCustomField extends React.Component {
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
            let css_classes = "field my-custom-field";
            if(this.props.required) {
                css_classes += " required";
            }
            if(this.state.error) {
                css_classes += " error";
            }
            let Field = window.asf.Field;
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

    // configure the context to be able to report validation errors up the tree.
    MyCustomField.contextType = window.asf.FormErrorContext;

    // make sure that this Field can be found.
    window.asf.fields.MyCustomField = MyCustomField;


Custom Blocks
-------------

Custom blocks is part of the normal way to use `altstreamfield`.
If `altstreamfield.blocks.streamblock.StreamBlock` and `altstreamfield.blocks.structblock.StructBlock` do not meet your needs you can inherit from `altstreamfield.blocks.core.Block` and provide a completely custom block.
In these cases you will want to override the `render_edit_js()` method to render out the needed JavaScript to setup your custom block and possibly the `render_edit_js_prerequisites()` method to render any pre-requisites.
If you have built some custom JavaScript generics that your `render_edit_js()` method makes use of then you will also want to override the `media` property.

For examples of how Blocks are built please reference the source code.