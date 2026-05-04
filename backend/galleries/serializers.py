from .models import *
from rest_framework import serializers


class GallerySerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    authorInitial = serializers.SerializerMethodField()
    gradient = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Galleries
        fields = ['id', 'author', 'authorInitial', 'title', 'status', 'coins', 'uploaded_at', 'tags', 'gradient', 'image']

    def get_authorInitial(self, obj):
        return obj.author.username[0].upper() if obj.author else "?"

    def get_gradient(self, obj):
        gradients = ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "..."]
        return gradients[obj.id % len(gradients)]

    def get_tags(self, obj):
        if not obj.tags:
            return []
        return [tag.strip() for tag in obj.tags.split(',')]