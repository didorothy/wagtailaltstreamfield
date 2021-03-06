import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import BooleanField from "./components/fields/booleanfield";
import CharField from "./components/fields/charfield";
import ChoiceField from "./components/fields/choicefield";
import Chooser from "./components/fields/chooser";
import DocumentChooserField from "./components/fields/documentchooserfield";
import Field from "./components/fields/field";
import ImageChooserField from "./components/fields/imagechooserfield";
import IntegerField from "./components/fields/integerfield";
import PageChooserField from "./components/fields/pagechooserfield";
import ReadOnlyCharField from "./components/fields/readonlycharfield";
import RichTextField from "./components/fields/richtextfield";
import StreamBlockField from "./components/fields/streamblockfield";
import StructBlockField from "./components/fields/structblockfield";
import TextField from "./components/fields/textfield";
import StreamBlock from "./components/streamblock";
import StructBlock from "./components/structblock";
import UnknownBlock from "./components/unknownblock";

import { template } from "./utils/template";
import { camel_pascal_to_label, capfirst, name_to_label } from "./utils/text";
import { run_validators } from "./utils/validation";

import { Validator, ValidationError } from "./validators/interface";
import { DecimalValidator } from "./validators/decimal";
import { EmailValidator } from "./validators/email";
import { IntegerValidator, CommaSeparatedIntegerListValidator } from "./validators/integer";
import { IPV4Validator, IPV6Validator } from "./validators/ip";
import { BaseLimitValidator, MaxLengthValidator, MaxValueValidator, MinLengthValidator, MinValueValidator } from "./validators/limits";
import { ProhibitNullCharacterValidator } from "./validators/prohibitnullcharacter";
import { SlugValidator, UnicodeSlugValidator } from "./validators/slug";
import { RegexValidator } from "./validators/regex";
import { URLValidator } from "./validators/url";

import FormErrorContext from "./context/formerror";

import StreamField from "./app/streamfield";

let FIELD_TYPES = {
    BooleanField,
    CharField,
    ChoiceField,
    DocumentChooserField,
    PageChooserField,
    ImageChooserField,
    IntegerField,
    ReadOnlyCharField,
    RichTextField,
    StreamBlockField,
    StructBlockField,
    TextField,
};

let VALIDATORS = {
    ValidationError,
    Validator,

    BaseLimitValidator,
    CommaSeparatedIntegerListValidator,
    DecimalValidator,
    EmailValidator,
    IntegerValidator,
    IPV4Validator,
    IPV6Validator,
    MaxLengthValidator,
    MaxValueValidator,
    MinLengthValidator,
    MinValueValidator,
    ProhibitNullCharacterValidator,
    RegexValidator,
    SlugValidator,
    UnicodeSlugValidator,
    URLValidator,
};

let UTILS = {
    template: {
        template
    },
    text: {
        camel_pascal_to_label,
        capfirst,
        name_to_label,
    },
    validation: {
        run_validators,
    }
};

/**
 * Attaches a StreamBlock to the document.
 * @param {Object} el_type The class of the StreamBlock to attach.
 * @param {DOMElement} hidden_input The DOM Element that is the hidden input.
 * @param {DOMElement} container The DOM Element that will contain the React Components.
 */
function attach_streamblock(el_type, hidden_input, container) {
    if(typeof hidden_input === 'string') {
        hidden_input = document.getElementById(hidden_input);
    }
    if(typeof container === 'string') {
        container = document.getElementById(container);
    }
    ReactDOM.render(React.createElement(StreamField, {input_element: hidden_input, block_type: el_type}), container);
}

/**
 * Creates a custom StructBlock component.
 * @param {String} type_name The name of the resulting StructBlock type.
 * @param {Array} fields An array of objects that match the following pattern {name: '', field_type: FieldComponent, args: {args: 'go', here: ''}}
 */
function create_structblock(type_name, fields, icon) {
    let default_value = {};
    for(let i = 0; i < fields.length; ++i) {
        let field = FIELD_TYPES[fields[i].field_type];
        default_value[fields[i].name] = field.default;
        fields[i].field_type = field;
    }
    class CustomStructBlock extends React.Component {
        render() {
            return <StructBlock block={this.props.block} fields={fields} onChange={this.props.onChange}/>;
        }
    }
    CustomStructBlock.type = type_name;
    CustomStructBlock.icon = icon || 'placeholder';
    CustomStructBlock.default_value = default_value;
    return CustomStructBlock;
}

/**
 * Builds a custom StreamBlock component.
 * @param {String} type_name The name of the resulting StreamBlockType
 * @param {Object} block_types An object containg the blocks to include {type: Type}
 */
function create_streamblock(type_name, block_types, icon) {
    class CustomStreamBlock extends React.Component {
        render() {
            return <StreamBlock block={this.props.block} blockTypes={block_types} onChange={this.props.onChange}/>;
        }
    }
    CustomStreamBlock.type = type_name;
    CustomStreamBlock.icon = icon || 'placeholder';
    CustomStreamBlock.default_value = [];
    return CustomStreamBlock;
}

window.asf = {
    attach_streamblock,
    create_structblock,
    create_streamblock,
    fields: FIELD_TYPES,
    validators: VALIDATORS,
    utils: UTILS,
    FormErrorContext,
    Field,
    Chooser,
    UnknownBlock,
};