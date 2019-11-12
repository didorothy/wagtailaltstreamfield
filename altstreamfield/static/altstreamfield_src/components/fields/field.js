import React from "react";
import PropTypes from "prop-types";

export default class Field extends React.Component {
    render() {
        let input_css_classes = this.props.input_css_classes || 'input';
        return <div className={this.props.css_classes}>
            <label htmlFor={this.props.input_id}>{this.props.label}</label>
            <div className="field-content">
                <div className={input_css_classes}>
                    {this.props.children}
                </div>
                {this.props.help_text && <p className="help">{this.props.help_text}</p>}
                {this.props.error && <p className="error-message">{this.props.error}</p>}
            </div>
        </div>;
    }
}

Field.propTypes = {
    css_classes: PropTypes.string.isRequired,
    input_id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    help_text: PropTypes.string,
    error: PropTypes.string,
    input_css_classes: PropTypes.string,
}