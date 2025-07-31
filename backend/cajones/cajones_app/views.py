from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cajon, CajonObjeto, TipoObjeto, CajonHistorial
from .serializers import CajonSerializer, CajonHistorialSerializer, TipoObjetoSerializer, CajonObjetoSerializer
from .services import RecomendacionService, OrdenamientoService
from .models import Cajon, CajonHistorial, TipoObjeto, CajonObjeto
from rest_framework import status

class CajonListView(APIView):
    def get(self, request):
        cajones = Cajon.objects.all()
        serializer = CajonSerializer(cajones, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CajonSerializer(data=request.data)
        if serializer.is_valid():
            cajon = serializer.save()
            # Crear entrada en el historial
            CajonHistorial.objects.create(
                cajon=cajon,
                accion='creado',
                descripcion=f'Cajón "{cajon.nombre}" creado con capacidad {cajon.capacidad_maxima}'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CajonDetailView(APIView):
    def get(self, request, pk):
        cajon = get_object_or_404(Cajon, pk=pk)
        serializer = CajonSerializer(cajon)
        return Response(serializer.data)
    
    def put(self, request, pk):
        cajon = get_object_or_404(Cajon, pk=pk)
        serializer = CajonSerializer(cajon, data=request.data)
        if serializer.is_valid():
            cajon = serializer.save()
            # Crear entrada en el historial
            CajonHistorial.objects.create(
                cajon=cajon,
                accion='modificado',
                descripcion=f'Cajón "{cajon.nombre}" actualizado'
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        cajon = get_object_or_404(Cajon, pk=pk)
        # Crear entrada en el historial antes de eliminar
        CajonHistorial.objects.create(
            cajon=cajon,
            accion='eliminado',
            descripcion=f'Cajón "{cajon.nombre}" eliminado'
        )
        cajon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CajonHistorialListView(APIView):
    def get(self, request):
        historial = CajonHistorial.objects.all().order_by('-fecha')
        serializer = CajonHistorialSerializer(historial, many=True)
        return Response(serializer.data)


class CajonHistorialDetailView(APIView):
    def get(self, request, pk):
        historial = get_object_or_404(CajonHistorial, pk=pk)
        serializer = CajonHistorialSerializer(historial)
        return Response(serializer.data)


class TipoObjetoListView(APIView):
    def get(self, request):
        tipos = TipoObjeto.objects.all()
        serializer = TipoObjetoSerializer(tipos, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TipoObjetoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TipoObjetoDetailView(APIView):
    def get(self, request, pk):
        tipo = get_object_or_404(TipoObjeto, pk=pk)
        serializer = TipoObjetoSerializer(tipo)
        return Response(serializer.data)
    
    def put(self, request, pk):
        tipo = get_object_or_404(TipoObjeto, pk=pk)
        serializer = TipoObjetoSerializer(tipo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        tipo = get_object_or_404(TipoObjeto, pk=pk)
        tipo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CajonObjetoListView(APIView):
    def get(self, request):
        objetos = CajonObjeto.objects.all()
        serializer = CajonObjetoSerializer(objetos, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CajonObjetoSerializer(data=request.data)
        if serializer.is_valid():
            objeto = serializer.save()
            # Crear entrada en el historial del cajón
            CajonHistorial.objects.create(
                cajon=objeto.cajon,
                accion='objeto_agregado',
                descripcion=f'Objeto "{objeto.nombre_objeto}" agregado al cajón'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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


class CajonObjetoDetailView(APIView):
    def get(self, request, pk):
        objeto = get_object_or_404(CajonObjeto, pk=pk)
        serializer = CajonObjetoSerializer(objeto)
        return Response(serializer.data)
    
    def put(self, request, pk):
        objeto = get_object_or_404(CajonObjeto, pk=pk)
        serializer = CajonObjetoSerializer(objeto, data=request.data)
        if serializer.is_valid():
            objeto = serializer.save()
            # Crear entrada en el historial del cajón
            CajonHistorial.objects.create(
                cajon=objeto.cajon,
                accion='objeto_modificado',
                descripcion=f'Objeto "{objeto.nombre_objeto}" modificado'
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        objeto = get_object_or_404(CajonObjeto, pk=pk)
        cajon = objeto.cajon
        nombre_objeto = objeto.nombre_objeto
        
        # Crear entrada en el historial antes de eliminar
        CajonHistorial.objects.create(
            cajon=cajon,
            accion='objeto_eliminado',
            descripcion=f'Objeto "{nombre_objeto}" eliminado del cajón'
        )
        objeto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CajonObjetosView(APIView):
    """Vista para obtener objetos de un cajón específico"""
    def get(self, request, cajon_id):
        cajon = get_object_or_404(Cajon, pk=cajon_id)
        objetos = cajon.objetos.all()
        serializer = CajonObjetoSerializer(objetos, many=True)
        return Response(serializer.data)


class CajonHistorialView(APIView):
    """Vista para obtener historial de un cajón específico"""
    def get(self, request, cajon_id):
        cajon = get_object_or_404(Cajon, pk=cajon_id)
        historial = cajon.historial_entries.all().order_by('-fecha')
        serializer = CajonHistorialSerializer(historial, many=True)
        return Response(serializer.data)


class CajonCapacidadView(APIView):
    """Vista para obtener capacidad disponible de un cajón"""
    def get(self, request, cajon_id):
        cajon = get_object_or_404(Cajon, pk=cajon_id)
        objetos_count = cajon.objetos.count()
        capacidad_disponible = cajon.capacidad_maxima - objetos_count
        
        return Response({
            'cajon_id': cajon.id,
            'cajon_nombre': cajon.nombre,
            'capacidad_maxima': cajon.capacidad_maxima,
            'objetos_actuales': objetos_count,
            'capacidad_disponible': capacidad_disponible,
            'porcentaje_ocupacion': (objetos_count / cajon.capacidad_maxima) * 100
        })


class OrdenamientoView(APIView):
    """Vista para obtener objetos ordenados por diferentes criterios"""
    def get(self, request):
        try:
            tipo_ordenamiento = request.query_params.get('tipo_ordenamiento', 'tipo')
            cajon_id = request.query_params.get('cajon_id')
            if cajon_id:
                cajon_id = int(cajon_id)
            ordenamiento_service = OrdenamientoService()
            if tipo_ordenamiento == 'tipo':
                resultado = ordenamiento_service.ordenar_por_tipo(cajon_id)
            elif tipo_ordenamiento == 'tamanio':
                resultado = ordenamiento_service.ordenar_por_tamanio(cajon_id)
            elif tipo_ordenamiento == 'mixto':
                resultado = ordenamiento_service.ordenar_mixto(cajon_id)
            else:
                return Response({
                    'error': 'Tipo de ordenamiento no válido. Use: tipo, tamanio, mixto'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Serializar el resultado
            if resultado and isinstance(resultado, list) and isinstance(resultado[0], dict) and 'objetos' in resultado[0]:
                for grupo in resultado:
                    grupo['objetos'] = CajonObjetoSerializer(grupo['objetos'], many=True).data
            else:
                resultado = CajonObjetoSerializer(resultado, many=True).data

            return Response({
                'tipo_ordenamiento': tipo_ordenamiento,
                'cajon_id': cajon_id,
                'resultado': resultado
            })
        except Exception as e:
            return Response({
                'error': f'Error al ordenar objetos: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecomendacionSimpleView(APIView):    
    def get(self, request):
        try:
            tipo_ordenamiento = request.query_params.get('tipo_ordenamiento', 'tipo')
            recomendacion_service = RecomendacionService()
            recomendaciones = recomendacion_service.generar_recomendaciones_organizacion(tipo_ordenamiento)
            return Response({
                'recomendaciones': recomendaciones,
                'tipo_ordenamiento': tipo_ordenamiento
            })
        except Exception as e:
            return Response({
                'error': f'Error al generar recomendación: {str(e)}',
                'recomendaciones': [
                    "Error al generar recomendación 1",
                    "Error al generar recomendación 2", 
                    "Error al generar recomendación 3"
                ],
                'tipo_ordenamiento': tipo_ordenamiento
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CajonObjetosOrdenadosView(APIView):
    """Vista para obtener objetos de un cajón ordenados según criterio"""
    
    def get(self, request, cajon_id):
        try:
            cajon = get_object_or_404(Cajon, pk=cajon_id)
            tipo_ordenamiento = request.query_params.get('ordenamiento', 'creacion')
            
            # Obtener objetos del cajón
            objetos = cajon.objetos.all()
            
            # Aplicar ordenamiento según el criterio
            if tipo_ordenamiento == 'tipo':
                # Ordenar por tipo alfabéticamente
                objetos = objetos.order_by('tipo_objeto__nombre')
            elif tipo_ordenamiento == 'tamanio':
                # Ordenar por tamaño: Pequeño -> Mediano -> Grande
                from django.db.models import Case, When, Value, IntegerField
                objetos = objetos.annotate(
                    tamanio_order=Case(
                        When(tamanio='PE', then=Value(1)),
                        When(tamanio='ME', then=Value(2)),
                        When(tamanio='GR', then=Value(3)),
                        default=Value(4),
                        output_field=IntegerField(),
                    )
                ).order_by('tamanio_order')
            else:
                # Ordenamiento por creación (por defecto)
                objetos = objetos.order_by('id')
            
            serializer = CajonObjetoSerializer(objetos, many=True)
            
            return Response({
                'cajon_id': cajon.id,
                'cajon_nombre': cajon.nombre,
                'tipo_ordenamiento': tipo_ordenamiento,
                'objetos': serializer.data,
                'total_objetos': objetos.count()
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al obtener objetos ordenados: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
