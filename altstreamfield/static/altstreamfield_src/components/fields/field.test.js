import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Field from "./field";

describe('Field', () => {
    test('#minimal', () => {
        let container = render(<Field css_classes="test" input_id="id_1" label="Test Field" />);
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#input_css_classes', () => {
        let container = render(<Field css_classes="test" input_css_classes="input field-input" input_id="id_1" label="Test Field" />)
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#help_text', () => {
        let container = render(<Field css_classes="test" input_id="id_1" label="Test Field" help_text="Sample help text." />)
        expect(container.container).toMatchSnapshot();
        cleanup();
    });

    test('#error', () => {
        let container = render(<Field css_classes="test" input_id="id_1" label="Test Field" help_text="Sample help text." error="This field is required." />)
        expect(container.container).toMatchSnapshot();
        cleanup();
    });
});