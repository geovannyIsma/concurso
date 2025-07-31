from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CajonSerializer, CajonHistorialSerializer, TipoObjetoSerializer, CajonObjetoSerializer

# Create your views here.

class CajonListView(APIView):
    def get(self, request):
        cajones = Cajon.objects.all()
        serializer = CajonSerializer(cajones, many=True)
        return Response(serializer.data)

class CajonHistorialListView(APIView):
    def get(self, request):
        historial = CajonHistorial.objects.all()
        serializer = CajonHistorialSerializer(historial, many=True)
        return Response(serializer.data)

class TipoObjetoListView(APIView):
    def get(self, request):
        tipos = TipoObjeto.objects.all()
        serializer = TipoObjetoSerializer(tipos, many=True)
        return Response(serializer.data)

class CajonObjetoListView(APIView):
    def get(self, request):
        objetos = CajonObjeto.objects.all()
        serializer = CajonObjetoSerializer(objetos, many=True)
        return Response(serializer.data)
