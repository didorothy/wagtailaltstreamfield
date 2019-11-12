import React from "react";
import PropTypes from "prop-types";

let ModalWorkflow = window.ModalWorkflow;

export default class Chooser extends React.Component {

    showChooserModal(evt) {
        let responses = {};
        responses[this.props.chooserType + 'Chosen'] = (data) => this.props.onChosen(data.id);

        ModalWorkflow({
            url: this.props.url,
            onload: this.props.modalOnLoadHandlers,
            responses: responses,
        });
    }

    clearChoice() {
        this.props.onChosen(null);
    }

    render() {
        let classes = "chooser";
        if(this.props.className) {
            classes += " " + this.props.className
        }

        let indef_article = this.props.chooserType.search(/^[AEIOUaeiou].*$/) == -1 ? 'a' : 'an';

        if(this.props.children) {
            return <div className={classes}>
                <div className="chosen">
                    {this.props.children}

                    <ul className="actions">
                        {!this.props.required && <li>
                            <button type="button" className="button action-clear button-small button-secondary" onClick={this.clearChoice.bind(this)}>Clear choice</button>
                        </li>}
                        <li>
                            <button type="button" className="button action-choose button-small button-secondary" onClick={this.showChooserModal.bind(this)}>Choose another {this.props.chooserType}</button>
                        </li>
                        <li>
                            <a href={this.props.editUrl} className="edit-link button button-small button-secondary" target="_blank" rel="noopener noreferrer">Edit this {this.props.chooserType}</a>
                        </li>
                    </ul>
                </div>
            </div>;
        } else {
            classes += " blank";
            return <div className={classes}>
                <div className="unchosen">
                    <button type="button" id={this.props.inputId} className="button action-choose button-small button-secondary" onClick={this.showChooserModal.bind(this)}>Choose {indef_article} {this.props.chooserType}</button>
                </div>
            </div>;
        }
    }
}

Chooser.propTypes = {
    url: PropTypes.string.isRequired,
    modalOnLoadHandlers: PropTypes.object.isRequired,
    chooserType: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    value: PropTypes.number,
    editUrl: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    onChosen: PropTypes.func.isRequired,
}