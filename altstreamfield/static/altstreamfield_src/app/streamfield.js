import React from "react";
import PropTypes from "prop-types";
import uuid4 from "uuid/v4";

import FormErrorContext from "../context/formerror";

export default class StreamField extends React.Component {
    constructor(props) {
        super(props);

        // parse data from input
        let data = null;
        try {
            data = JSON.parse(props.input_element.value);
        } catch {}

        if(data === null) {
            data = {
                'id': uuid4(),
                'type': props.block_type.type,
                'value': [],
            };
            props.input_element.value = JSON.stringify(data);
        }

        this.state = {
            data,
            error: false,
        }

        this.error_manager = new FormErrorContext.FormErrorManager();
        this.error_manager.subscribe(this.handleErrorChange.bind(this));

        // Need to do this here so that when we add an event listener we can also remove that event listener.
        this.handleSubmit = this.handleSubmit.bind(this);

        this.props.input_element.form.addEventListener('submit', this.handleSubmit);
    }

    componentWillUnmount() {
        this.props.input_element.form.removeEventListener('submit', this.handleSubmit);
    }

    /**
     * This should prevent the form from being sumitted if there are errors in the StreamField.
     * @param {Event} evt The event we are handling.
     */
    handleSubmit(evt) {
        let error_manager = this.error_manager;
        if(!this.error_manager.isValid()) {
            setTimeout(function () {
                window.cancelSpinner();
                error_manager.findError();
            }, 1000);
            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    handleErrorChange(valid) {
        if(this.state.error !== !valid) {
            this.setState({error: !valid});
        }
    }

    /**
     * This makes sure that the state is persisted into the hidden input and causes re-renders via state.
     * @param {Object} block The new block state.
     */
    handleBlockChange(block) {
        this.setState({data: block});
        this.props.input_element.value = JSON.stringify(block);
    }

    render() {
        let stream_block = React.createElement(
            this.props.block_type,
            {
                block: this.state.data,
                onChange: this.handleBlockChange.bind(this)
            });
        return <div className="stream-field">
            <div className="form-status">{this.state.error ? 'Error' : 'Valid'}</div>
            <FormErrorContext.Provider value={this.error_manager}>
                {stream_block}
            </FormErrorContext.Provider>
        </div>
    }
}

StreamField.propTypes = {
    input_element: PropTypes.object,
    block_type: PropTypes.func,

}