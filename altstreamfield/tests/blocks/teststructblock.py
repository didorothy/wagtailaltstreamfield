from django.core import exceptions
from django.forms.widgets import Media
from django.test import TestCase

from altstreamfield.blocks.core import Block
from altstreamfield.blocks.fields import CharField, IntegerField, RichTextField
from altstreamfield.blocks.structblock import StructValue, StructBlock


class TestStructValue(TestCase):
    def test_init(self):
        val = StructValue(Block())
        self.assertIsInstance(val.block, Block)

    def test_html(self):
        val = StructValue(Block())
        self.assertEqual(val.__html__(), 'StructValue()')

    def test_render_as_block(self):
        val = StructValue(Block())
        self.assertEqual(val.render_as_block(), 'StructValue()')


class TestStructBlock(TestCase):
    def test_init(self):
        class TestStructBlock(StructBlock):
            name = CharField()
            value = CharField()

        b = TestStructBlock()
        self.assertEqual(len(b.fields), 2)

    def test_media(self):
        '''Ensure that we recieve a Media object and that any field media is combined in the returned object.'''
        class TestStructBlock(StructBlock):
            name = CharField
            description = RichTextField()

            class Media:
                js = ['test.js']

        b = TestStructBlock()
        media = b.media
        self.assertIsInstance(media, Media)
        self.assertIn('wagtailadmin/js/draftail.js', media._js)
        self.assertIn('test.js', media._js)

    def test_check(self):
        b = StructBlock()
        self.assertEqual(b.check(), [])

        b.fields['test'] = CharField()
        b.fields[''] = CharField()
        b.fields['test ing'] = CharField()
        b.fields['test-ing'] = CharField()
        b.fields['1test'] = CharField()

        errors = b.check()
        self.assertEqual(len(errors), 4)

    def test_to_python(self):
        b = StructBlock()
        with self.assertRaises(exceptions.ValidationError):
            b.to_python('')

        self.assertEqual(b.to_python({'one': 'one', 'two': 2}), {})

        class TestStructBlock(StructBlock):
            name = CharField()
            description = CharField()

        b = TestStructBlock()
        self.assertEqual(b.to_python({
            'name': 'Bullpen',
            'age': 10,
            'description': 'A place to keep bulls.',
        }), {
            'name': 'Bullpen',
            'description': 'A place to keep bulls.'
        })

    def test_clean(self):
        class TestStructBlock(StructBlock):
            name = CharField()
            age = IntegerField()

        block = TestStructBlock()
        with self.assertRaises(exceptions.ValidationError):
            block.clean({})

        with self.assertRaises(exceptions.ValidationError):
            block.clean({"name": 12, "age": "21.3"})

        value = block.clean({"name": "John", "age": "21"})
        self.assertEqual(value['name'], 'John')
        self.assertEqual(value['age'], 21)
        self.assertIs(value.block, block)


    def test_to_json(self):
        b = StructBlock()
        self.assertEqual(b.to_json({'name': 'John'}), {})

        class TestStructBlock(StructBlock):
            name = CharField()
            description = CharField()

        b = TestStructBlock()
        self.assertEqual(b.to_json({
            'name': 'John',
            'age': 10,
        }), {
            'name': 'John',
            'description': None
        })

    def test_render_basic(self):
        b = StructBlock()
        self.assertEqual(b.render_basic({}), '<dl>\n\n</dl>')

        class TestStructBlock(StructBlock):
            name = CharField()
            description = CharField()

        b = TestStructBlock()
        self.assertEqual(b.render_basic({}), '<dl>\n\n</dl>')
        self.assertEqual(b.render_basic({'name': 'John', 'age': 10}), '<dl>\n    <dt>name</dt>\n    <dd>John</dd>\n</dl>')

    def test_render_edit_js(self):
        b = StructBlock()
        self.assertEqual(b.render_edit_js(), '\nvar StructBlock = asf.create_structblock("StructBlock", []);\nStructBlock.icon = "placeholder";\n')

        class TestStructBlock(StructBlock):
            name = CharField()

        b = TestStructBlock()
        self.assertEqual(b.render_edit_js(), '\nvar TestStructBlock = asf.create_structblock("TestStructBlock", [{"name": "name", "field_type": "CharField", "args": {"name": "name", "label": "Name", "required": true, "help_text": "", "strip": true, "min_length": null, "max_length": null}}]);\nTestStructBlock.icon = "placeholder";\n')

    def test_get_searchable_content(self):
        b = StructBlock()
        self.assertEqual(b.get_searchable_content({'something': 'value'}), [])

        class TestStructBlock(StructBlock):
            name = CharField()

        b = TestStructBlock()
        self.assertEqual(b.get_searchable_content({'name': 'John', 'age': '10'}), ['John'])