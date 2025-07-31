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
    
    def del_duplicados(self, request):
        nombre = request.data.get('nombre')
        tipo = request.data.get('tipo')
        tamanio = request.data.get('tamanio')
        objeto = CajonObjeto.objects.filter(nombre_objeto=nombre, tipo_objeto=tipo, tamanio=tamanio).first()
        if objeto:
            objeto.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def ord_CajonObjeto(self, request, type_ordenmiento):
        if type_ordenmiento == 'tipo':
            objetos = CajonObjeto.objects.all().order_by('tipo_objeto')
        elif type_ordenmiento == 'tamanio':
            objetos = CajonObjeto.objects.all().order_by('tamanio')
        serializer = CajonObjetoSerializer(objetos, many=True)
        return Response(serializer.data)
    
    def capturar_accionHistorial(self, request):
        accion = request.data.get('accion')
        if accion == 'creado':
            CajonHistorial.objects.create(accion=accion, descripcion=descripcion)
        elif accion == 'modificado':
            CajonHistorial.objects.create(accion=accion, descripcion=descripcion)
        elif accion == 'eliminado':
            CajonHistorial.objects.create(accion=accion, descripcion=descripcion)
        return Response(status=status.HTTP_204_NO_CONTENT)