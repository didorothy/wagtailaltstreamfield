import { assert } from 'chai';
import { template } from "./template";

describe('template', () => {
    it("should render various templates", () => {
        let vars = {
            'one': 'one number',
            'bird': 'parrot',
            'color': 'red',
        };
        assert.equal(template("{{ color }}", vars), 'red');
        assert.equal(template("There is only {{ one }}", vars), 'There is only one number');
        assert.equal(template('The {{ bird }} flew the coop.', vars), 'The parrot flew the coop.');
        assert.equal(template("There is {{ one }} {{ bird }} colored {{ color }}.", vars), 'There is one number parrot colored red.');
        assert.equal(template("{{ one is a great number", vars), "{{ one is a great number");
        assert.equal(template("Once {{ person_name }} went to the market.", vars), "Once undefined went to the market.");
    });
});