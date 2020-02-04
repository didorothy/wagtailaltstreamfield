import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormErrorContext from "../context/formerror";
import StreamBlock, { BlockTypeMenu, BlockContainer } from "./streamblock";
import StructBlock from "./structblock";
import CharField from "./fields/charfield";

describe('BlockTypeMenu', () => {
    let mock_block1 = {
        type: 'Mock1',
        icon: 'placeholder',
    };
    let mock_block2 = {
        type: 'Mock2',
        icon: 'placeholder',
    };

    test('#minimal', () => {
        let container = render(<BlockTypeMenu blockTypes={[]} onChosen={() => {}} />);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#groups', () => {
        let block_types = [
            {
                type: 'Mock1',
                icon: 'placeholder',
                group: 'test'
            },
            {
                type: 'Mock2',
                icon: 'placeholder',
                group: ''
            }
        ];
        let container = render(<BlockTypeMenu blockTypes={block_types} onChosen={() => {}}/>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('show/hide menu', () => {
        let block_types = [mock_block1, mock_block2];
        let container = render(<BlockTypeMenu blockTypes={block_types} onChosen={() => {}} />);
        expect(container.container.getElementsByTagName('button').length).toEqual(1);
        let add_btn = container.getByTitle('Add');
        fireEvent.click(add_btn);
        container.rerender(<BlockTypeMenu blockTypes={block_types} onChosen={() => {}} />);
        expect(container.container.getElementsByTagName('button').length).toEqual(3);
        cleanup();
    });

    test('handleChosen', () => {
        let block_types = [mock_block1, mock_block2];
        let chosen = null;
        function onChosen(block_type) {
            chosen = block_type;
        }
        let container = render(<BlockTypeMenu blockTypes={block_types} onChosen={onChosen} />);
        expect(container.container.getElementsByTagName('button').length).toEqual(1);
        let add_btn = container.getByTitle('Add');
        fireEvent.click(add_btn);
        container.rerender(<BlockTypeMenu blockTypes={block_types} onChosen={onChosen} />);
        expect(container.container.getElementsByTagName('button').length).toEqual(3);
        let menu_btn = container.getByTitle('Mock1');
        fireEvent.click(menu_btn);
        expect(chosen).toBe(mock_block1);
        cleanup();
    });
});


describe('BlockContainer', () => {
    let mock_block1 = {
        type: 'Mock1',
        icon: 'placeholder',
    };
    let mock_block2 = {
        type: 'Mock2',
        icon: 'placeholder',
    };

    test('#minimal', () => {
        let container = render(<BlockContainer blockTypes={[]} block={{type: 'Testing'}} onDelete={() => {}} onMove={() => {}} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#isBottom', () => {
        let container = render(<BlockContainer blockTypes={[]} block={{type: 'Testing'}} isBottom={true} onDelete={() => {}} onMove={() => {}} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#isTop', () => {
        let container = render(<BlockContainer blockTypes={[]} block={{type: 'Testing'}} isTop={true} onDelete={() => {}} onMove={() => {}} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handleChosen', () => {
        let block_types = [mock_block1, mock_block2];
        let insert = null;
        function onInsert(block_type, block_id) {
            insert = {
                block_type,
                block_id,
            };
        }
        let container = render(<BlockContainer blockTypes={block_types} block={{type: 'Testing'}} isTop={true} onDelete={() => {}} onMove={() => {}} onInsert={onInsert}>
            <div>Some block content.</div>
        </BlockContainer>);
        let add_btn = container.getByTitle('Add');
        fireEvent.click(add_btn);
        container.rerender(<BlockContainer blockTypes={block_types} block={{id: 'UUID', type: 'Testing'}} isTop={true} onDelete={() => {}} onMove={() => {}} onInsert={onInsert}>
            <div>Some block content.</div>
        </BlockContainer>);
        let menu_btn = container.getByTitle('Mock1');
        fireEvent.click(menu_btn);
        expect(insert.block_type).toBe(mock_block1);
        expect(insert.block_id).toEqual('UUID');
        cleanup();
    });

    test('handleDelete', () => {
        let delete_block = null;
        function onDelete(block) {
            delete_block = block;
        }
        let block = {id: 'UUID', type: 'TestBlock'};
        let container = render(<BlockContainer blockTypes={[]} block={block} onDelete={onDelete} onMove={() => {}} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        let delete_btn = container.getByTitle('Delete');
        fireEvent.click(delete_btn);
        expect(delete_block).toBe(block);
        cleanup();
    });

    test('handleMoveUp', () => {
        let move = null;
        function onMove(block, direction) {
            move = {
                block,
                direction,
            };
        }
        let block = {id: 'UUID', type: 'TestBlock'};
        let container = render(<BlockContainer blockTypes={[]} block={block} onDelete={() => {}} onMove={onMove} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        let moveup_btn = container.getByTitle('Move up');
        fireEvent.click(moveup_btn);
        expect(move.block).toBe(block);
        expect(move.direction).toEqual(-1);
        cleanup();
    });

    test('handleMoveDown', () => {
        let move = null;
        function onMove(block, direction) {
            move = {
                block,
                direction,
            };
        }
        let block = {id: 'UUID', type: 'TestBlock'};
        let container = render(<BlockContainer blockTypes={[]} block={block} onDelete={() => {}} onMove={onMove} onInsert={() => {}}>
            <div>Some block content.</div>
        </BlockContainer>);
        let movedown_btn = container.getByTitle('Move down');
        fireEvent.click(movedown_btn);
        expect(move.block).toBe(block);
        expect(move.direction).toEqual(1);
        cleanup();
    });
});

describe('StreamBlock', () => {
    let fields = [{
        name: "one",
        field_type: CharField,
        args: {
            "name": "one",
            "label": "One",
            "required": true,
            "help_text": "Sample help text.",
            "strip": true,
            "min_length": null,
            "max_length": 255
        }
    }];

    class TestStructBlock extends React.Component {
        render() {
            return <StructBlock block={this.props.block} fields={fields} onChange={this.props.onChange} />;
        }
    }
    TestStructBlock.type = 'TestStructBlock';
    TestStructBlock.icon = 'placeholder';
    TestStructBlock.default_value = {one: ''};

    test('#minimal', () => {
        let container = render(<StreamBlock block={{value: []}} blockTypes={{}} onChange={() => {}}/>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#basic_value', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
            SecondTestStructBlock: TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={() => {}}/>
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#unknown_value', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'UnknownBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={() => {}}/>
        </FormErrorContext.Provider>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('handleDelete one block', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        function onChange(updated_block) {
            block_value = updated_block;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        let delete_btn = container.getByTitle('Delete');
        fireEvent.click(delete_btn);
        expect(block_value.value.length).toEqual(0);
        cleanup();
    });

    test('handleDelete three blocks', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbae3a-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbb0a6-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        function onChange(updated_block) {
            block_value = updated_block;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        let delete_btns = container.getAllByTitle('Delete');
        fireEvent.click(delete_btns[1]); // this should be the middle block
        expect(block_value.value.length).toEqual(2);
        expect(block_value.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(block_value.value[1].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');
        cleanup();
    });

    test('handleMove', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbae3a-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbb0a6-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        function onChange(updated_block) {
            block_value = updated_block;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        let moveup_btns = container.getAllByTitle('Move up');
        fireEvent.click(moveup_btns[0]); // this should be the middle block
        expect(block_value.value.length).toEqual(3);
        expect(block_value.value[0].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(block_value.value[1].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(block_value.value[2].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');
        cleanup();
    });

    test('handleMove less than 0 more than length', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbae3a-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbb0a6-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        function onChange(updated_block) {
            block_value = updated_block;
        }

        let r_el = new StreamBlock(
            {
                block: block_value,
                blockTypes: block_types,
                onChange: onChange,
            },
            manager
        );

        // Move the first item to position -1
        r_el.handleMove(block_value.value[0], -1);

        expect(block_value.value.length).toEqual(3);
        expect(block_value.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(block_value.value[1].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(block_value.value[2].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');

        // Move the last item to position last + 1
        r_el.handleMove(block_value.value[2], 1);

        expect(block_value.value.length).toEqual(3);
        expect(block_value.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(block_value.value[1].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(block_value.value[2].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');
    });

    test('handleInsert', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbae3a-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbb0a6-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        let modified_block = null;
        function onChange(updated_block) {
            modified_block = updated_block;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        let add_btns = container.getAllByTitle('Add');
        fireEvent.click(add_btns[0]); // this should be the first block
        let type_btn = container.getByTitle('TestStructBlock');
        fireEvent.click(type_btn);

        expect(modified_block.value.length).toEqual(4);
        expect(modified_block.value[1].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(modified_block.value[2].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(modified_block.value[3].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');

        modified_block = null;
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        add_btns = container.getAllByTitle('Add');
        fireEvent.click(add_btns[1]); // this should be the second block
        type_btn = container.getByTitle('TestStructBlock');
        fireEvent.click(type_btn);
        expect(modified_block.value.length).toEqual(4);
        expect(modified_block.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(modified_block.value[2].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(modified_block.value[3].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');

        modified_block = null;
        container.rerender(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        add_btns = container.getAllByTitle('Add');
        fireEvent.click(add_btns[3]); // this should be the last add button
        type_btn = container.getByTitle('TestStructBlock');
        fireEvent.click(type_btn);
        expect(modified_block.value.length).toEqual(4);
        expect(modified_block.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(modified_block.value[1].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667')
        expect(modified_block.value[2].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');

        cleanup();
    });

    test('handleChange', () => {
        let manager = new FormErrorContext.FormErrorManager();
        let block_types = {
            TestStructBlock,
        };
        let block_value = {
            value: [
                {
                    id: '6e556490-07cc-11ea-8d71-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbae3a-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                },
                {
                    id: '87bbb0a6-0a1a-11ea-9a9f-362b9e155667',
                    type: 'TestStructBlock',
                    value: {
                        'one': 'test value'
                    }
                }
            ]
        };
        let modified_block = null;
        function onChange(updated_block) {
            modified_block = updated_block;
        }
        let container = render(<FormErrorContext.Provider value={manager}>
            <StreamBlock block={block_value} blockTypes={block_types} onChange={onChange}/>
        </FormErrorContext.Provider>);
        let inputs = container.container.getElementsByTagName('input');
        fireEvent.change(inputs[1], {target: {value: 'test'}}); // this should be the second block

        expect(modified_block.value.length).toEqual(3);
        expect(modified_block.value[0].id).toEqual('6e556490-07cc-11ea-8d71-362b9e155667');
        expect(modified_block.value[1].id).toEqual('87bbae3a-0a1a-11ea-9a9f-362b9e155667');
        expect(modified_block.value[2].id).toEqual('87bbb0a6-0a1a-11ea-9a9f-362b9e155667');
        expect(modified_block.value[0].value.one).toEqual('test value');
        expect(modified_block.value[1].value.one).toEqual('test');
        expect(modified_block.value[2].value.one).toEqual('test value');
    });
});