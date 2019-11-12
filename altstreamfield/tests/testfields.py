from django.test import TestCase

from ..blocks.fields import CharField
from ..blocks.streamblock import StreamBlock, StreamValue
from ..blocks.structblock import StructBlock
from ..fields import BlockField, AltStreamField

class TestStructBlock(StructBlock):
    value = CharField()


class TestStreamBlock(StreamBlock):
    test = TestStructBlock()


simple_value = '''{
    "id":"a8b5e919-8518-49ec-9302-fa33fa266d65",
    "type":"TestStreamBlock",
    "value":[
        {
            "id":"a71848c8-b773-4ca1-b764-97f439da27ab",
            "type":"TestStructBlock",
            "value":{"value":"test"}
        }
    ]
}'''

class TestBlockField(TestCase):

    def test_clean(self):
        block = TestStreamBlock()
        field = BlockField(block)

        #self.assertEqual(field.clean(simple_value), simple_value)


class TestAltStreamField(TestCase):

    def test_to_python(self):
        f = AltStreamField(TestStreamBlock)
        self.assertIsInstance(f.to_python(simple_value), StreamValue)

    def test_get_prep_value(self):
        f = AltStreamField(TestStreamBlock)
        value = f.to_python(simple_value)
        #print(f.get_prep_value(value))
