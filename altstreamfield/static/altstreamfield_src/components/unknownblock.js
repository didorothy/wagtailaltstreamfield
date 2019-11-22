import React from "react";
import PropTypes from "prop-types";

export default class UnknownBlock extends React.Component {
    render() {
        return <div class="raw">
            <pre>{JSON.stringify(this.props.block.value, null, '  ')}</pre>
        </div>;
    }
}

UnknownBlock.icon = 'help';
UnknownBlock.default_value = null;

UnknownBlock.propTypes = {
    block: PropTypes.object,
    blockTypes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};