import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Chooser from "./chooser";

describe('Chooser', () => {
    test("#minimal", () => {
        let handlers = {};
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" onChosen={() => {}} />
        );
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#chosen_value', () => {
        let handlers = {};
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={1} onChosen={() => {}}>
                <span>Chosen Value</span>
            </Chooser>
        );
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#chosen_required', () => {
        let handlers = {};
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={1} required={true} onChosen={() => {}}>
                <span>Chosen Value</span>
            </Chooser>
        );
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#chosen_editUrl', () => {
        let handlers = {};
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={1} required={true} editUrl="/url/1" onChosen={() => {}}>
                <span>Chosen Value</span>
            </Chooser>
        );
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#chosen_className', () => {
        let handlers = {};
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={1} required={true} editUrl="/url/1" className="test" onChosen={() => {}}>
                <span>Chosen Value</span>
            </Chooser>
        );
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('it can clear choice when not required', () => {
        let handlers = {};
        let last_value = 1
        let onChosen = (value) => {
            last_value = value;
        };
        let container = render(
            <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={1} onChosen={onChosen}>
                <span>Chosen Value</span>
            </Chooser>
        );
        expect(last_value).toEqual(1);
        let button = container.getByText('Clear choice');
        fireEvent.click(button);
        expect(last_value).toBeNull()
        cleanup();
    });

    test('it shows the modal workflow and handles a chosen event', () => {
        let handlers = {type: 'test'};
        let last_value = 1
        let onChosen = (value) => {
            last_value = value;
        };
        window.ModalWorkflow = (opts) => {
            opts.responses.testChosen({id: 3});
        }
        try {
            let container = render(
                <Chooser url="/chooser-url" modalOnLoadHandlers={handlers} chooserType="test" inputId="test" value={0} onChosen={onChosen}/>
            );
            expect(last_value).toEqual(1);
            let button = container.getByText('Choose a test');
            fireEvent.click(button);
            expect(last_value).toEqual(3);
        } finally {
            delete window.ModalWorkflow;
        }
        cleanup();
    });
});