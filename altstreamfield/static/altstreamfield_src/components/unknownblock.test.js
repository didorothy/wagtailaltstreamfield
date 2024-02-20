import React from "react";
import { render, fireEvent, wait, waitForDomChange, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnknownBlock from "./unknownblock";


describe('UnknownBlock', () => {
    test("#minimal", () => {
        let container = render(<UnknownBlock block={{value: {one: "1", nest: {list: ['test', 1, 1.0]}}}} blockTypes={[]} onChange={() => {}}/>);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });
});