from django.test import TestCase

from ...blocks.fields import CharField
from ...blocks.streamblock import StreamBlock, StreamValue
from ...blocks.structblock import StructBlock

class TestStructBlock(StructBlock):
    value = CharField()


class TestStreamBlock(StreamBlock):
    test = TestStructBlock()


simple_value = [
    {
        "id":"a71848c8-b773-4ca1-b764-97f439da27ab",
        "type":"TestStructBlock",
        "value":{"value":"test"}
    }
]

class TestStreamValue(TestCase):

    def test_can_create(self):
        StreamValue(TestStreamBlock(), [])
        StreamValue(TestStreamBlock(), simple_value)

    def test_to_json(self):
        value = StreamValue(TestStreamBlock(), simple_value)
        self.assertEqual(
            value.to_json(),
            [{
                "id":"a71848c8-b773-4ca1-b764-97f439da27ab",
                "type":"TestStructBlock",
                "value":{"value":"test"}
            }]
        )

from django.forms import MediaDefiningClass, Media

class MediaClass(metaclass=MediaDefiningClass):
    class Media:
        css = {
            'all': ['test.css']
        }
        js = ['test.js']

class SubMediaClass(MediaClass):
    class Media:
        css = {
            'all': ['no.css']
        }
        js = ['no.js']
        extend = False

    @property
    def media(self):
        base = super().media

        definition = getattr(self, 'Media', None)
        if definition:
            extend = getattr(definition, 'extend', True)
            if extend:
                if extend is True:
                    m = base
                else:
                    m = Media()
                    for medium in extend:
                        m = m + base[medium]
                return m + Media(definition)
            return Media(definition)
        else:
            return base

class TestMediaDefiningClassOverride(TestCase):
    def test_go(self):
        c = SubMediaClass()
        print(c.media)