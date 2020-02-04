import React from "react";
import PropTypes from "prop-types";
import uuid4 from "uuid/v4";

import { camel_pascal_to_label } from "../utils/text";
import UnknownBlock from "./unknownblock";

export class BlockTypeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    handleChosen(evt, block_type) {
        this.props.onChosen(block_type);
        this.toggleMenu();
    }

    toggleMenu() {
        this.setState({visible: !this.state.visible});
    }

    render() {
        let self = this;
        let options = {};
        let groups = [];
        let block_types = [...this.props.blockTypes];
        block_types.sort((a,b) => ((a.label || a.type) < (b.label || b.type) ? -1 : ((a.label || a.type) < (b.label || b.type) ? 1 : 0)));
        for(let i = 0; i < this.props.blockTypes.length; ++i) {
            let block_type = this.props.blockTypes[i];
            let css_classes = "c-sf-button action-add-block" + block_type.icon
            let icon_css_classes = "icon icon-" + block_type.icon;
            let block_label = block_type.label || block_type.type;
            let group = block_type.group || '';

            if(options[group] === undefined) {
                groups.push(group);
                options[group] = []
            }

            options[group].push(
                <button key={block_type.type} type="button" className={css_classes} title={block_type.type} onClick={(evt) => { self.handleChosen(evt, block_type); }}>
                    <span className="c-sf-button__icon">
                        <i className={icon_css_classes}></i>
                    </span>
                    <span className="c-sf-button__label">{block_label}</span>
                </button>
            );
        }
        groups.sort();
        let listings = [];
        for(var i = 0; i < groups.length; ++i) {
            if(groups[i]) {
                listings.push(<h4 className="c-sf-panel__group_title">{groups[i]}</h4>);
            }

            listings.push(
                <div className="add-panel-grid">
                    {options[groups[i]]}
                </div>
            );
        }
        let button_classes = "c-sf-add-button c-sf-add-button--visible";
        if(this.state.visible) {
            button_classes += " c-sf-add-button--close";
        }
        return <div className="stream-menu c-sf-container">
            <button type="button" title="Add" className={button_classes} onClick={this.toggleMenu.bind(this)}>
                <i aria-hidden="true">+</i>
            </button>
            {this.state.visible && <div className="stream-menu-add-panel">
                {listings}
            </div>}
        </div>
    }
}

BlockTypeMenu.propTypes = {
    blockTypes: PropTypes.array.isRequired,
    onChosen: PropTypes.func.isRequired,
};

export class BlockContainer extends React.Component {
    handleChosen(block_type) {
        this.props.onInsert(block_type, this.props.block.id);
    }

    handleDelete(evt) {
        this.props.onDelete(this.props.block);
    }

    handleMoveUp(evt) {
        this.props.onMove(this.props.block, -1);
    }

    handleMoveDown(evt) {
        this.props.onMove(this.props.block, 1)
    }

    render() {
        let icon = 'icon icon-' + (this.props.icon || 'placeholder');
        return <div className="block-container">
            <div className="block-container-before">
                <BlockTypeMenu blockTypes={this.props.blockTypes} onChosen={this.handleChosen.bind(this)}/>
            </div>
            <div className="block-container-block">
                <div className="block-controls">
                    <h3>
                        <span className="c-sf-block__header__icon"><i className={icon}></i></span>
                        {camel_pascal_to_label(this.props.block.type)}
                    </h3>
                    {!this.props.isTop && <button type="button" className="c-sf-block__actions__single" title="Move up" onClick={this.handleMoveUp.bind(this)}>
                        <i className="icon icon-arrow-up" aria-hidden="true"></i>
                    </button>}
                    {!this.props.isBottom && <button type="button" className="c-sf-block__actions__single disabled" title="Move down" onClick={this.handleMoveDown.bind(this)}>
                        <i className="icon icon-arrow-down" aria-hidden="true"></i>
                    </button>}
                    <button type="button" className="c-sf-block__actions__single" title="Delete" onClick={this.handleDelete.bind(this)}>
                        <i className="icon icon-bin" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="block-content">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

BlockContainer.propTypes = {
    blockTypes: PropTypes.array.isRequired,
    block: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onDelete: PropTypes.func.isRequired,
    onInsert: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    isTop: PropTypes.bool,
    isBottom: PropTypes.bool,
    icon: PropTypes.string,
}

export default class StreamBlock extends React.Component {

    handleInsertBlock(block_type, block_id) {
        let new_block = {
            id: uuid4(),
            type: block_type.type,
            value: (block_type.default_value instanceof Array ? block_type.default_value.slice(0) : Object.assign({}, block_type.default_value)),
        };

        let updated_block = Object.assign({}, this.props.block);
        updated_block.value = updated_block.value.slice(0);

        if(block_id) {
            for(let i = 0; i < updated_block.value.length; ++i) {
                if(block_id == updated_block.value[i].id) {
                    if(i == 0) {
                        updated_block.value.unshift(new_block);
                    } else {
                        updated_block.value.splice(i, 0, new_block);
                    }
                    break;
                }
            }
        } else {
            updated_block.value.push(new_block);
        }
        this.props.onChange(updated_block);
    }

    handleDeleteBlock(block) {
        let updated_block = Object.assign({}, this.props.block);
        updated_block.value = updated_block.value.slice(0);
        for(var i = 0; i < updated_block.value.length; ++i) {
            if(block.id == updated_block.value[i].id) {
                if(updated_block.value.length === 1) {
                    // This is a special case because apparently you cannot remove an element with splice() when there is only one element.
                    updated_block.value = [];
                } else {
                    updated_block.value.splice(i, 1);
                }
                break;
            }
        }
        this.props.onChange(updated_block);
    }

    handleMove(block, amount) {
        let updated_block = Object.assign({}, this.props.block);
        updated_block.value = updated_block.value.slice(0);
        for(var i = 0; i < updated_block.value.length; ++i) {
            if(block.id == updated_block.value[i].id) {
                let pos = i + amount;
                if(pos < 0) {
                    pos = 0;
                }
                if(pos >= updated_block.value.length) {
                    pos = updated_block.value.length - 1;
                }
                updated_block.value.splice(i, 1);
                updated_block.value.splice(pos, 0, block)
                break;
            }
        }
        this.props.onChange(updated_block);
    }

    handleChange(block) {
        let updated_block = Object.assign({}, this.props.block);
        updated_block.value = updated_block.value.slice(0);
        for(var i = 0; i < updated_block.value.length; ++i) {
            if(block.id == updated_block.value[i].id) {
                updated_block.value[i] = block;
                break;
            }
        }
        this.props.onChange(updated_block);
    }

    render() {
        let blockTypeArray = [];
        for(let key in this.props.blockTypes) {
            blockTypeArray.push(this.props.blockTypes[key]);
        }
        blockTypeArray.sort((a,b) => a.type < b.type ? -1 : (a.type > b.type ? 1 : 0))
        let sub_blocks = [];
        for(let i = 0; i < this.props.block.value.length; ++i) {
            let sub_block = this.props.block.value[i];
            if(this.props.blockTypes[sub_block.type]) {
                sub_blocks.push(React.createElement(
                    BlockContainer,
                    {
                        blockTypes: blockTypeArray,
                        block: sub_block,
                        key: sub_block.id,
                        onInsert: this.handleInsertBlock.bind(this),
                        onDelete: this.handleDeleteBlock.bind(this),
                        isTop: i == 0,
                        isBottom: i == this.props.block.value.length - 1,
                        onMove: this.handleMove.bind(this),
                        icon: this.props.blockTypes[sub_block.type].icon,
                    },
                    React.createElement(
                        this.props.blockTypes[sub_block.type],
                        {
                            block: sub_block,
                            onChange: this.handleChange.bind(this),
                        },
                    )
                ));
            } else if(sub_block.type === 'UnknownBlock') {
                let sub_block = this.props.block.value[i];
                sub_blocks.push(React.createElement(
                    BlockContainer,
                    {
                        blockTypes: blockTypeArray,
                        block: sub_block,
                        key: sub_block.id,
                        onInsert: this.handleInsertBlock.bind(this),
                        onDelete: this.handleDeleteBlock.bind(this),
                        isTop: i == 0,
                        isBottom: i == this.props.block.value.length - 1,
                        onMove: this.handleMove.bind(this),
                        icon: UnknownBlock.icon,
                    },
                    React.createElement(
                        UnknownBlock,
                        {
                            block: sub_block,
                            onChange: this.handleChange.bind(this),
                        },
                    )
                ));
            }
        }
        return <div id={this.props.block.id} className="stream-block">
            {sub_blocks}
            <div className="stream-block-append">
                <BlockTypeMenu blockTypes={blockTypeArray} onChosen={this.handleInsertBlock.bind(this)}/>
            </div>
        </div>
    }
}

StreamBlock.default_value = [];

StreamBlock.propTypes = {
    block: PropTypes.object.isRequired,
    blockTypes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};
