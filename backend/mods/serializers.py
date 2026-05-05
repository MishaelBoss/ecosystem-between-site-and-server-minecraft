from .models import Mod
from rest_framework import serializers


class ModSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    file_url = serializers.SerializerMethodField()
    category_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Mod
        fields = [
            'id', 'author', 'title', 'description', 'file', 'file_url',
            'version', 'category', 'category_display', 'status', 'status_display',
            'downloads', 'uploaded_at'
        ]
        read_only_fields = ['downloads', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_category_display(self, obj):
        return obj.get_category_display()

    def get_status_display(self, obj):
        return obj.get_status_display()