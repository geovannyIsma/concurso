import os
import google.generativeai as genai
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Cajon, CajonObjeto, CajonHistorial, TipoObjeto


class CajonService:
    """
    Servicio para manejar la lógica de negocio de los cajones
    """
    
    @staticmethod
    def crear_cajon(nombre, capacidad_maxima):
        """Crear un nuevo cajón con validaciones"""
        if capacidad_maxima <= 0:
            raise ValidationError("La capacidad máxima debe ser mayor a 0")
        
        if len(nombre.strip()) == 0:
            raise ValidationError("El nombre del cajón no puede estar vacío")
        
        with transaction.atomic():
            cajon = Cajon.objects.create(
                nombre=nombre.strip(),
                capacidad_maxima=capacidad_maxima
            )
            
            # Crear entrada en el historial
            CajonHistorial.objects.create(
                cajon=cajon,
                accion='creado',
                descripcion=f'Cajón "{cajon.nombre}" creado con capacidad {cajon.capacidad_maxima}'
            )
            
            return cajon
    
    @staticmethod
    def agregar_objeto_a_cajon(cajon_id, nombre_objeto, tipo_objeto_id, tamanio):
        """Agregar un objeto a un cajón con validaciones de capacidad"""
        try:
            cajon = Cajon.objects.get(id=cajon_id)
        except Cajon.DoesNotExist:
            raise ValidationError("El cajón especificado no existe")
        
        # Verificar capacidad
        objetos_count = cajon.objetos.count()
        if objetos_count >= cajon.capacidad_maxima:
            raise ValidationError(
                f"El cajón '{cajon.nombre}' está lleno. Capacidad máxima: {cajon.capacidad_maxima}"
            )
        
        with transaction.atomic():
            objeto = CajonObjeto.objects.create(
                cajon=cajon,
                nombre_objeto=nombre_objeto,
                tipo_objeto_id=tipo_objeto_id,
                tamanio=tamanio
            )
            
            # Crear entrada en el historial
            CajonHistorial.objects.create(
                cajon=cajon,
                accion='objeto_agregado',
                descripcion=f'Objeto "{objeto.nombre_objeto}" agregado al cajón'
            )
            
            return objeto
    
    @staticmethod
    def mover_objeto(objeto_id, nuevo_cajon_id):
        """Mover un objeto de un cajón a otro"""
        try:
            objeto = CajonObjeto.objects.get(id=objeto_id)
            nuevo_cajon = Cajon.objects.get(id=nuevo_cajon_id)
        except (CajonObjeto.DoesNotExist, Cajon.DoesNotExist):
            raise ValidationError("El objeto o cajón especificado no existe")
        
        # Verificar capacidad del nuevo cajón
        objetos_count = nuevo_cajon.objetos.count()
        if objetos_count >= nuevo_cajon.capacidad_maxima:
            raise ValidationError(
                f"El cajón destino '{nuevo_cajon.nombre}' está lleno"
            )
        
        cajon_anterior = objeto.cajon
        
        with transaction.atomic():
            objeto.cajon = nuevo_cajon
            objeto.save()
            
            # Crear entradas en el historial
            CajonHistorial.objects.create(
                cajon=cajon_anterior,
                accion='objeto_movido',
                descripcion=f'Objeto "{objeto.nombre_objeto}" movido fuera del cajón'
            )
            
            CajonHistorial.objects.create(
                cajon=nuevo_cajon,
                accion='objeto_recibido',
                descripcion=f'Objeto "{objeto.nombre_objeto}" movido al cajón'
            )
            
            return objeto
    
    @staticmethod
    def obtener_estadisticas_cajon(cajon_id):
        """Obtener estadísticas detalladas de un cajón"""
        try:
            cajon = Cajon.objects.get(id=cajon_id)
        except Cajon.DoesNotExist:
            raise ValidationError("El cajón especificado no existe")
        
        objetos = cajon.objetos.all()
        objetos_count = objetos.count()
        capacidad_disponible = cajon.capacidad_maxima - objetos_count
        
        # Estadísticas por tamaño
        tamanios = {}
        for tamanio_choice in CajonObjeto.CajonTamanio.choices:
            tamanios[tamanio_choice[1]] = objetos.filter(tamanio=tamanio_choice[0]).count()
        
        # Estadísticas por tipo
        tipos = {}
        for objeto in objetos:
            tipo_nombre = objeto.tipo_objeto.nombre
            if tipo_nombre not in tipos:
                tipos[tipo_nombre] = 0
            tipos[tipo_nombre] += 1
        
        return {
            'cajon': {
                'id': cajon.id,
                'nombre': cajon.nombre,
                'capacidad_maxima': cajon.capacidad_maxima,
                'objetos_actuales': objetos_count,
                'capacidad_disponible': capacidad_disponible,
                'porcentaje_ocupacion': (objetos_count / cajon.capacidad_maxima) * 100
            },
            'estadisticas_por_tamanio': tamanios,
            'estadisticas_por_tipo': tipos
        }


class RecomendacionService:
    """
    Servicio para generar recomendaciones de organización usando Gemini AI
    """
    
    def __init__(self):
        # Configurar Gemini AI
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY no está configurada en las variables de entorno")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generar_contexto_base_datos(self):
        """Generar contexto de la base de datos para Gemini"""
        cajones = Cajon.objects.all()
        objetos = CajonObjeto.objects.all()
        tipos = TipoObjeto.objects.all()
        
        contexto = "CONTEXTO DE LA BASE DE DATOS:\n\n"
        
        # Información de cajones
        contexto += "CAJONES DISPONIBLES:\n"
        for cajon in cajones:
            objetos_count = cajon.objetos.count()
            capacidad_disponible = cajon.capacidad_maxima - objetos_count
            contexto += f"- {cajon.nombre}: {objetos_count}/{cajon.capacidad_maxima} objetos (disponible: {capacidad_disponible})\n"
        
        # Información de tipos de objetos
        contexto += "\nTIPOS DE OBJETOS:\n"
        for tipo in tipos:
            contexto += f"- {tipo.nombre}: {tipo.descripcion or 'Sin descripción'}\n"
        
        # Información de objetos actuales
        contexto += "\nOBJETOS ACTUALES:\n"
        for objeto in objetos:
            contexto += f"- {objeto.nombre_objeto} (tipo: {objeto.tipo_objeto.nombre}, tamaño: {objeto.get_tamanio_display()}) en cajón: {objeto.cajon.nombre}\n"
        
        return contexto
    
    def generar_recomendacion_organizacion(self, tipo_ordenamiento='tipo'):
        """
        Generar recomendación de organización usando Gemini AI
        tipo_ordenamiento: 'tipo', 'tamanio', 'mixto'
        """
        try:
            contexto = self.generar_contexto_base_datos()
            
            prompt = f"""
{contexto}

INSTRUCCIONES:
Analiza la información de los cajones y objetos. Genera una recomendación de organización basada en el tipo de ordenamiento: {tipo_ordenamiento}.

REGLAS:
1. La respuesta debe ser de máximo 30 palabras
2. Sugiere movimientos específicos de objetos entre cajones
3. Considera la capacidad disponible de cada cajón
4. Agrupa objetos por tipo o tamaño según el criterio
5. Mantén un patrón lógico de organización

RESPONDE SOLO LA RECOMENDACIÓN EN 30 PALABRAS O MENOS:
"""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            return f"Error al generar recomendación: {str(e)}"
    
    def generar_recomendacion_especifica(self, cajon_id=None, objeto_id=None):
        """
        Generar recomendación específica para un cajón u objeto
        """
        try:
            contexto = self.generar_contexto_base_datos()
            
            if cajon_id:
                cajon = Cajon.objects.get(id=cajon_id)
                prompt = f"""
{contexto}

INSTRUCCIONES:
Analiza el cajón "{cajon.nombre}" y sus objetos. Genera una recomendación específica para mejorar su organización.

REGLAS:
1. La respuesta debe ser de máximo 30 palabras
2. Sugiere movimientos específicos de objetos
3. Considera la capacidad disponible
4. Mantén un patrón lógico

RESPONDE SOLO LA RECOMENDACIÓN EN 30 PALABRAS O MENOS:
"""
            elif objeto_id:
                objeto = CajonObjeto.objects.get(id=objeto_id)
                prompt = f"""
{contexto}

INSTRUCCIONES:
Analiza el objeto "{objeto.nombre_objeto}" (tipo: {objeto.tipo_objeto.nombre}, tamaño: {objeto.get_tamanio_display()}) actualmente en el cajón "{objeto.cajon.nombre}". Sugiere el mejor cajón para este objeto.

REGLAS:
1. La respuesta debe ser de máximo 30 palabras
2. Sugiere el cajón más apropiado
3. Justifica brevemente la recomendación

RESPONDE SOLO LA RECOMENDACIÓN EN 30 PALABRAS O MENOS:
"""
            else:
                return "Error: Se requiere especificar cajon_id u objeto_id"
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            return f"Error al generar recomendación: {str(e)}"
    
    def obtener_movimientos_sugeridos(self, tipo_ordenamiento='tipo'):
        """
        Obtener movimientos específicos sugeridos por Gemini
        """
        try:
            contexto = self.generar_contexto_base_datos()
            
            prompt = f"""
{contexto}

INSTRUCCIONES:
Analiza la información y sugiere movimientos específicos de objetos entre cajones para mejorar la organización basada en: {tipo_ordenamiento}.

FORMATO DE RESPUESTA:
- Mover [nombre_objeto] de [cajon_origen] a [cajon_destino] (razón)
- Mover [nombre_objeto] de [cajon_origen] a [cajon_destino] (razón)

REGLAS:
1. Solo sugiere movimientos que mejoren la organización
2. Considera la capacidad disponible
3. Agrupa objetos similares
4. Máximo 5 movimientos sugeridos

RESPONDE SOLO LOS MOVIMIENTOS SUGERIDOS:
"""
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            return f"Error al generar movimientos: {str(e)}" 