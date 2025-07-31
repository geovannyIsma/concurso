from django.urls import path
from .views import CajonListView, CajonHistorialListView, TipoObjetoListView, CajonObjetoListView

urlpatterns = [
    path('cajones/', CajonListView.as_view(), name='cajon-list'),
    path('cajones/historial/', CajonHistorialListView.as_view(), name='cajon-historial-list'),
    path('tipos-objeto/', TipoObjetoListView.as_view(), name='tipo-objeto-list'),
    path('cajones/objetos/', CajonObjetoListView.as_view(), name='cajon-objeto-list'),
]