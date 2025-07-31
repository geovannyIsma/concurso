from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CajonListView, CajonDetailView, CajonHistorialListView, CajonHistorialDetailView,
    TipoObjetoListView, TipoObjetoDetailView, CajonObjetoListView, CajonObjetoDetailView,
    CajonObjetosView, CajonHistorialView, CajonCapacidadView, RecomendacionSimpleView,
    CajonObjetosOrdenadosView, OrdenamientoView
)

urlpatterns = [
    # Rutas de Cajones
    path('api/cajones/', CajonListView.as_view(), name='cajones-list'),
    path('api/cajones/<int:pk>/', CajonDetailView.as_view(), name='cajon-detail'),
    path('api/cajones/<int:cajon_id>/objetos/', CajonObjetosView.as_view(), name='cajon-objetos'),
    path('api/cajones/<int:cajon_id>/objetos-ordenados/', CajonObjetosOrdenadosView.as_view(), name='cajon-objetos-ordenados'),
    path('api/cajones/<int:cajon_id>/historial/', CajonHistorialView.as_view(), name='cajon-historial'),
    path('api/cajones/<int:cajon_id>/capacidad/', CajonCapacidadView.as_view(), name='cajon-capacidad'),
    
    # Rutas de Historial
    path('api/historial/', CajonHistorialListView.as_view(), name='historial-list'),
    path('api/historial/<int:pk>/', CajonHistorialDetailView.as_view(), name='historial-detail'),
    
    # Rutas de Tipos de Objeto
    path('api/tipos-objeto/', TipoObjetoListView.as_view(), name='tipos-objeto-list'),
    path('api/tipos-objeto/<int:pk>/', TipoObjetoDetailView.as_view(), name='tipo-objeto-detail'),
    
    # Rutas de Objetos
    path('api/objetos/', CajonObjetoListView.as_view(), name='objetos-list'),
    path('api/objetos/<int:pk>/', CajonObjetoDetailView.as_view(), name='objeto-detail'),
    
    # Ruta de Recomendación
    path('api/recomendacion/', RecomendacionSimpleView.as_view(), name='recomendacion-simple'),

    # Ruta de Ordenamiento
    path('api/ordenamiento/', OrdenamientoView.as_view(), name='ordenamiento'),
]