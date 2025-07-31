from django.contrib import admin
from .models import Cajon, CajonHistorial, TipoObjeto, CajonObjeto

# Register your models here.


@admin.register(Cajon)
class CajonAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'capacidad_maxima')
    search_fields = ('nombre',)
    list_filter = ('capacidad_maxima',)
    ordering = ('nombre',)

@admin.register(CajonHistorial)
class CajonHistorialAdmin(admin.ModelAdmin):
    list_display = ('cajon', 'accion', 'fecha')
    search_fields = ('cajon__nombre', 'accion')
    list_filter = ('accion', 'fecha')
    ordering = ('-fecha',)

@admin.register(TipoObjeto)
class TipoObjetoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)
    ordering = ('nombre',)

@admin.register(CajonObjeto)
class CajonObjetoAdmin(admin.ModelAdmin):
    list_display = ('nombre_objeto', 'cajon', 'tipo_objeto', 'tamanio')
    search_fields = ('nombre_objeto', 'cajon__nombre', 'tipo_objeto__nombre')
    list_filter = ('tamanio', 'tipo_objeto')
    ordering = ('cajon__nombre', 'nombre_objeto')
    raw_id_fields = ('cajon', 'tipo_objeto')
