import { URLValidator } from "./url";
import { ValidationError } from "./interface";

let valid_urls = [
    'http://www.djangoproject.com/',
    'HTTP://WWW.DJANGOPROJECT.COM/',
    'http://localhost/',
    'http://example.com/',
    'http://example.com./',
    'http://www.example.com/',
    'http://www.example.com:8000/test',
    'http://valid-with-hyphens.com/',
    'http://subdomain.example.com/',
    'http://a.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'http://200.8.9.10/',
    'http://200.8.9.10:8000/test',
    'http://su--b.valid-----hyphens.com/',
    'http://example.com?something=value',
    'http://example.com/index.php?something=value&another=value2',
    'https://example.com/',
    'ftp://example.com/',
    'ftps://example.com/',
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://www.example.com/wpstyle/?p=364',
    'https://www.example.com/foo/?bar=baz&inga=42&quux',
    'http://✪df.ws/123',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/',
    'http://userid@example.com',
    'http://userid@example.com/',
    'http://userid@example.com:8080',
    'http://userid@example.com:8080/',
    'http://userid:password@example.com',
    'http://userid:password@example.com/',
    'http://142.42.1.1/',
    'http://142.42.1.1:8080/',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://⌘.ws/',
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://foo.com/(something)?after=parens',
    'http://☺.damowmow.com/',
    'http://djangoproject.com/events/#&product=browser',
    'http://j.mp',
    'ftp://foo.bar/baz',
    'http://foo.bar/?q=Test%20URL-encoded%20stuff',
    'http://مثال.إختبار',
    'http://例子.测试',
    'http://उदाहरण.परीक्षा',
    'http://-.~_!$&\'()*+,;=%40:80%2f@example.com',
    'http://xn--7sbb4ac0ad0be6cf.xn--p1ai',
    'http://1337.net',
    'http://a.b-c.de',
    'http://223.255.255.254',
    'ftps://foo.bar/',
    'http://10.1.1.254',
    'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html',
    'http://[::192.9.5.5]/ipng',
    'http://[::ffff:192.9.5.5]/ipng',
    'http://[::1]:8080/',
    'http://0.0.0.0/',
    'http://255.255.255.255',
    'http://224.0.0.0',
    'http://224.1.1.1',
    'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.example.com',
    'http://example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com',
    'http://example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'http://dashintld.c-m',
    'http://multipledashintld.a-b-c',
    'http://evenmoredashintld.a---c',
    'http://dashinpunytld.xn---c',
]

let invalid_urls = [
    'foo',
    'http://',
    'http://example',
    'http://example.',
    'http://.com',
    'http://invalid-.com',
    'http://-invalid.com',
    'http://invalid.com-',
    'http://invalid.-com',
    'http://inv-.alid-.com',
    'http://inv-.-alid.com',
    'file://localhost/path',
    'git://example.com/',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    'http://foo.bar?q=Spaces should be encoded',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'foo.com',
    'rdar://1234',
    'h://test',
    'http:// shouldfail.com',
    ':// should fail',
    'http://foo.bar/foo(bar)baz quux',
    'http://-error-.invalid/',
    'http://dashinpunytld.trailingdot.xn--.',
    'http://dashinpunytld.xn---',
    'http://-a.b.co',
    'http://a.b-.co',
    'http://a.-b.co',
    'http://a.b-.c.co',
    'http:/',
    'http://',
    'http://',
    'http://1.1.1.1.1',
    'http://123.123.123',
    'http://3628126748',
    'http://123',
    'http://.www.foo.bar/',
    'http://.www.foo.bar./',
    'http://[::1:2::3]:8080/',
    'http://[]',
    'http://[]:8080',
    'http://example..com/',
    'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.example.com',
    'http://example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com',
    'http://example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    //'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaa',
    'https://test.[com',
    'http://foo@bar@example.com',
    'http://foo/bar@example.com',
    'http://foo:bar:baz@example.com',
    'http://foo:bar@baz@example.com',
    'http://foo:bar/baz@example.com',
    'http://invalid-.com/?m=foo@example.com',
]

describe("URLValidator", () => {
    describe("URLValidator.constructor", () => {
        test("Should allow specifying URL schemes [protocols]", () => {
            let validator = new URLValidator(['http', 'https']);
            expect(validator.schemes.indexOf('http')).not.toEqual(-1);
            expect(validator.schemes.indexOf('https')).not.toEqual(-1);
            expect(validator.schemes.indexOf('ftp')).toEqual(-1);
        });

        test("Should allow not specifying URL schemes [protocols]", () => {
            let validator = new URLValidator();
            expect(validator.schemes.indexOf('http')).not.toEqual(-1);
            expect(validator.schemes.indexOf('https')).not.toEqual(-1);
            expect(validator.schemes.indexOf('ftp')).not.toEqual(-1);
            expect(validator.schemes.indexOf('ftps')).not.toEqual(-1);
        });
    });

    describe("URLValidator.doValidate", () => {
        test("Should validate various URLs.", () => {
            let validator = new URLValidator();
            for(let i = 0; i < valid_urls.length; ++i) {
                expect(validator.doValidate(valid_urls[i])).toBeUndefined();
            }

            for(let i = 0; i < invalid_urls.length; ++i) {
                expect(validator.doValidate(invalid_urls[i])).toBeInstanceOf(ValidationError);
            }
        });
    });

    describe("URLValidator.isEqual", () => {
        test("should be equal to a similarly configured validator.", () => {
            let a = new URLValidator(undefined, "Must provide a valid url.");
            let b = new URLValidator(undefined, "Must provide a valid url.");
            expect(a.isEqual(b)).toEqual(true);
        });

        test("should not be equal to a differently configured validator", () => {
            let a = new URLValidator();
            let b = new URLValidator(undefined, "Must provide a valid url.");
            expect(a.isEqual(b)).toEqual(false);

            let c = new URLValidator(['http', 'https']);
            expect(a.isEqual(c)).toEqual(false);

            let d = new URLValidator(['http', 'https', 'udp', 'tcp']);
            expect(a.isEqual(d)).toEqual(false);
        });
    })
});