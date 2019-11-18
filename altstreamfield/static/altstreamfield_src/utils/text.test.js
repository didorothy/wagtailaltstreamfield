import { capfirst, name_to_label, camel_pascal_to_label } from "./text";

describe('utils.text.capfirst', () => {
    test("always uppercase first character and lowercase all others.", () => {
        expect(capfirst('test')).toEqual('Test');
        expect(capfirst('ORANGE')).toEqual('Orange');
        expect(capfirst('BlUEbErry')).toEqual('Blueberry');
        expect(capfirst('pINEAPPLE')).toEqual('Pineapple');
    });
});

describe('utils.text.name_to_label', () => {
    expect(name_to_label('test')).toEqual('Test');
    expect(name_to_label('Orange_Tea-with-Monkeys')).toEqual('Orange Tea With Monkeys');
    expect(name_to_label('zesty-tigers')).toEqual('Zesty Tigers');
    expect(name_to_label('rAPID_lIONS')).toEqual('Rapid Lions');
});

describe('utils.text.camel_pascal_to_label', () => {
    expect(camel_pascal_to_label('test')).toEqual('Test');
    expect(camel_pascal_to_label('MerryMenEatABCs')).toEqual('Merry Men Eat ABCs');
    expect(camel_pascal_to_label('ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D'))
        .toEqual('To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D');
});