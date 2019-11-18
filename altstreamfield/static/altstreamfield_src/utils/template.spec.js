import { template } from "./template";

describe('template', () => {
    it("should render various templates", () => {
        let vars = {
            'one': 'one number',
            'bird': 'parrot',
            'color': 'red',
        };
        expect(template("{{ color }}", vars)).toEqual('red');
        expect(template("There is only {{ one }}", vars)).toEqual('There is only one number');
        expect(template('The {{ bird }} flew the coop.', vars)).toEqual('The parrot flew the coop.');
        expect(template("There is {{ one }} {{ bird }} colored {{ color }}.", vars)).toEqual('There is one number parrot colored red.');
        expect(template("{{ one is a great number", vars)).toEqual("{{ one is a great number");
        expect(template("Once {{ person_name }} went to the market.", vars)).toEqual("Once undefined went to the market.");
    });
});