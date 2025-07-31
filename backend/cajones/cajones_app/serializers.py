from rest_framework import serializers
from .models import Cajon, CajonHistorial, TipoObjeto, CajonObjeto

class CajonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cajon
        fields = '__all__'

class CajonHistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CajonHistorial
        fields = '__all__'

class TipoObjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoObjeto
        fields = '__all__'

class CajonObjetoSerializer(serializers.ModelSerializer):    
    class Meta:
        model = CajonObjeto
        fields = '__all__'

