import React from "react";

const STATUS_OK = true;
const STATUS_ERROR = false;

/**
 * This class keeps track of all child elements that report a valid or invalid
 * state. Every element that can report a valid/invalid state must report that
 * statewhen it is rendered. This keeps track of all the responses in an object
 * and reports a valid value only if all of those responses are valid.
 */
class FormErrorManager {
    constructor() {
        this.reports = {};
        this.subscriptions = [];
        this.STATUS_OK = STATUS_OK;
        this.STATUS_ERROR = STATUS_ERROR;
    }

    /**
     * Allows for a user of the context to report their status.
     * @param {String} name The unique name of the user (this is going to be block.id + field_name in most cases)
     * @param {bool} status True if OK and False otherwise (use FormErrorManager.STATUS_OK or FormErrorManager.STATUS_ERROR)
     */
    reportStatus(name, status) {
        this.reports[name] = status;
        this.publish();
    }

    /**
     * Allows a user to remove themselves from reporting (for when the component is deleted).
     * @param {String} name The unique name of the user (this is going to be block.id + field_name in most cases)
     */
    removeStatus(name) {
        delete this.reports[name];
        this.publish();
    }

    /**
     * Attempts to find an error and jump the page to it.
     */
    findError() {
        for(let name in this.reports) {
            if(this.reports[name] === STATUS_ERROR) {
                let elem = document.getElementById(name);
                if(elem) {
                    elem.focus();
                    return;
                }
            }
        }
    }

    isValid() {
        for(let name in this.reports) {
            if(this.reports[name] === STATUS_ERROR) {
                return false
            }
        }
        return true;
    }

    /**
     * Allows for Components to subscribe to changes in the state.
     * @param {Function} func A function to call with the current isValid() value.
     */
    subscribe(func) {
        this.subscriptions.push(func);
    }

    /**
     * Publishes the current isValid() state to all subscribers.
     */
    publish() {
        let valid = this.isValid();
        for(let i = 0; i < this.subscriptions.length; ++i) {
            this.subscriptions[i](valid);
        }
    }
}

FormErrorManager.STATUS_OK = STATUS_OK;
FormErrorManager.STATUS_ERROR = STATUS_ERROR;

const FormErrorContext = React.createContext(null);
FormErrorContext.FormErrorManager = FormErrorManager;

export default FormErrorContext;