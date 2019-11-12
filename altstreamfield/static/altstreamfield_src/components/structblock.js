import React from "react";
import PropTypes from "prop-types";

export default class StructBlock extends React.Component {
    handleChange(name, value) {
        let updated_block = Object.assign({}, this.props.block);
        updated_block.value = Object.assign({}, updated_block.value);
        updated_block.value[name] = value;
        this.props.onChange(updated_block);
    }

    render() {
        let fields = [];
        for(let i = 0; i < this.props.fields.length; ++i) {
            let field_def = this.props.fields[i];
            let args = Object.assign({}, field_def.args);
            args.name = field_def.name
            args.value = this.props.block.value[field_def.name] || field_def.field_type.default;
            args.key = field_def.name
            args.onChange = this.handleChange.bind(this);
            args.owner_id = this.props.block.id;
            fields.push(React.createElement(
                field_def.field_type,
                args,
            ));
        }
        return <div id="{this.props.block.id}" className="struct-block">
            {fields}
        </div>;
    }
}

StructBlock.propTypes = {
    block: PropTypes.object.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        field_type: PropTypes.func,
        args: PropTypes.object,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    //children: PropTypes.node,
}