import os
import google.generativeai as genai
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Cajon, CajonObjeto, CajonHistorial, CajonTamanio, TipoObjeto


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
        for tamanio_choice in CajonTamanio.choices:
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


class OrdenamientoService:
    """
    Servicio para manejar la lógica de ordenamiento de objetos en cajones
    """
    
    @staticmethod
    def ordenar_por_tipo(cajon_id=None):
        """
        Ordenar objetos por tipo de objeto
        Si se especifica cajon_id, ordena solo los objetos de ese cajón
        """
        if cajon_id:
            objetos = CajonObjeto.objects.filter(cajon_id=cajon_id).select_related('tipo_objeto', 'cajon')
        else:
            objetos = CajonObjeto.objects.all().select_related('tipo_objeto', 'cajon')
        
        # Agrupar por tipo de objeto
        objetos_por_tipo = {}
        for objeto in objetos:
            tipo_nombre = objeto.tipo_objeto.nombre
            if tipo_nombre not in objetos_por_tipo:
                objetos_por_tipo[tipo_nombre] = []
            objetos_por_tipo[tipo_nombre].append(objeto)
        
        # Crear resultado ordenado
        resultado = []
        for tipo_nombre, objetos_list in sorted(objetos_por_tipo.items()):
            resultado.append({
                'tipo': tipo_nombre,
                'cantidad': len(objetos_list),
                'objetos': objetos_list
            })
        
        return resultado
    
    @staticmethod
    def ordenar_por_tamanio(cajon_id=None):
        """
        Ordenar objetos por tamaño
        Si se especifica cajon_id, ordena solo los objetos de ese cajón
        """
        if cajon_id:
            objetos = CajonObjeto.objects.filter(cajon_id=cajon_id).select_related('tipo_objeto', 'cajon')
        else:
            objetos = CajonObjeto.objects.all().select_related('tipo_objeto', 'cajon')
        
        # Agrupar por tamaño
        objetos_por_tamanio = {}
        for objeto in objetos:
            tamanio_display = objeto.get_tamanio_display()
            if tamanio_display not in objetos_por_tamanio:
                objetos_por_tamanio[tamanio_display] = []
            objetos_por_tamanio[tamanio_display].append(objeto)
        
        # Ordenar por tamaño (Pequeño, Mediano, Grande)
        orden_tamanios = ['Pequeño', 'Mediano', 'Grande']
        resultado = []
        for tamanio in orden_tamanios:
            if tamanio in objetos_por_tamanio:
                resultado.append({
                    'tamanio': tamanio,
                    'cantidad': len(objetos_por_tamanio[tamanio]),
                    'objetos': objetos_por_tamanio[tamanio]
                })
        
        return resultado
    
    @staticmethod
    def ordenar_mixto(cajon_id=None):
        """
        Ordenar objetos combinando tipo y tamaño para optimizar espacio
        Si se especifica cajon_id, ordena solo los objetos de ese cajón
        """
        if cajon_id:
            objetos = CajonObjeto.objects.filter(cajon_id=cajon_id).select_related('tipo_objeto', 'cajon')
        else:
            objetos = CajonObjeto.objects.all().select_related('tipo_objeto', 'cajon')
        
        # Agrupar por tipo y tamaño
        objetos_por_tipo_tamanio = {}
        for objeto in objetos:
            tipo_nombre = objeto.tipo_objeto.nombre
            tamanio_display = objeto.get_tamanio_display()
            clave = f"{tipo_nombre}_{tamanio_display}"
            
            if clave not in objetos_por_tipo_tamanio:
                objetos_por_tipo_tamanio[clave] = {
                    'tipo': tipo_nombre,
                    'tamanio': tamanio_display,
                    'objetos': []
                }
            objetos_por_tipo_tamanio[clave]['objetos'].append(objeto)
        
        # Crear resultado ordenado
        resultado = []
        for clave, datos in sorted(objetos_por_tipo_tamanio.items()):
            datos['cantidad'] = len(datos['objetos'])
            resultado.append(datos)
        
        return resultado


class RecomendacionService:
    def __init__(self):
        # Configurar Gemini AI
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY no está configurada en las variables de entorno")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generar_contexto_completo(self):
        """Generar contexto completo de la base de datos para Gemini"""
        cajones = Cajon.objects.all()
        objetos = CajonObjeto.objects.all()
        tipos = TipoObjeto.objects.all()
        
        contexto = "CONTEXTO COMPLETO DEL SISTEMA DE CAJONES:\n\n"
        
        # Información detallada de cajones
        contexto += "=== CAJONES DISPONIBLES ===\n"
        for cajon in cajones:
            objetos_count = cajon.objetos.count()
            capacidad_disponible = cajon.capacidad_maxima - objetos_count
            porcentaje_ocupacion = (objetos_count / cajon.capacidad_maxima) * 100
            
            contexto += f"CAJÓN: {cajon.nombre}\n"
            contexto += f"   - Capacidad: {objetos_count}/{cajon.capacidad_maxima} objetos\n"
            contexto += f"   - Espacio disponible: {capacidad_disponible}\n"
            contexto += f"   - Ocupación: {porcentaje_ocupacion:.1f}%\n"
            
            # Objetos en este cajón
            objetos_cajon = cajon.objetos.all()
            if objetos_cajon:
                contexto += f"   - Objetos contenidos:\n"
                for obj in objetos_cajon:
                    contexto += f"     • {obj.nombre_objeto} (Tipo: {obj.tipo_objeto.nombre}, Tamaño: {obj.get_tamanio_display()})\n"
            else:
                contexto += f"   - Objetos contenidos: VACÍO\n"
            contexto += "\n"
        
        contexto += "=== TIPOS DE OBJETOS ===\n"
        for tipo in tipos:
            objetos_tipo = tipo.objetos.all()
            contexto += f"{tipo.nombre}: {tipo.descripcion or 'Sin descripción'}\n"
            contexto += f"   - Cantidad total: {objetos_tipo.count()} objetos\n"
            if objetos_tipo:
                contexto += f"   - Ejemplos: {', '.join([obj.nombre_objeto for obj in objetos_tipo[:3]])}\n"
            contexto += "\n"
        
        # Estadísticas generales
        contexto += "=== ESTADÍSTICAS GENERALES ===\n"
        contexto += f"Total de cajones: {cajones.count()}\n"
        contexto += f"Total de objetos: {objetos.count()}\n"
        contexto += f"Total de tipos: {tipos.count()}\n"
        
        # Distribución por tamaños
        tamanios_stats = {}
        for tamanio_choice in CajonTamanio.choices:
            count = objetos.filter(tamanio=tamanio_choice[0]).count()
            tamanios_stats[tamanio_choice[1]] = count
        
        contexto += f"Distribución por tamaños:\n"
        for tamanio, count in tamanios_stats.items():
            contexto += f"   - {tamanio}: {count} objetos\n"
        
        contexto += "\n"
        
        return contexto
    
    def generar_recomendaciones_organizacion(self, tipo_ordenamiento='tipo'):
        """
        Generar 3 recomendaciones específicas de organización usando Gemini AI
        tipo_ordenamiento: 'tipo', 'tamanio', 'mixto'
        """
        try:
            contexto = self.generar_contexto_completo()
            
            prompt = f"""
{contexto}

INSTRUCCIONES:
Analiza el contexto completo del sistema de cajones y genera EXACTAMENTE 3 recomendaciones específicas de organización basadas en el criterio: {tipo_ordenamiento}.

REGLAS IMPORTANTES:
1. Genera EXACTAMENTE 3 recomendaciones
2. Cada recomendación debe ser específica y accionable
3. Considera la capacidad disponible de cada cajón
4. Basa las recomendaciones en el criterio especificado ({tipo_ordenamiento})
5. Usa el contexto real de los cajones y objetos existentes
6. Las recomendaciones deben ser prácticas y realizables

CRITERIOS DE ORGANIZACIÓN:
- 'tipo': Agrupa objetos por su tipo/categoría
- 'tamanio': Agrupa objetos por tamaño (Pequeño, Mediano, Grande)
- 'mixto': Combina criterios de tipo y tamaño para optimizar espacio

FORMATO DE RESPUESTA:
Genera exactamente 3 recomendaciones numeradas (1, 2, 3) en texto plano, cada una en una línea separada.

EJEMPLO:
1. Mover todos los libros del cajón "Oficina" al cajón "Biblioteca" para agrupar por tipo
2. Reorganizar herramientas pequeñas en el cajón "Herramientas" para optimizar espacio
3. Crear un cajón específico para dispositivos electrónicos grandes

RESPONDE SOLO LAS 3 RECOMENDACIONES NUMERADAS:
"""
            
            response = self.model.generate_content(prompt)
            recomendaciones_texto = response.text.strip()
            
            # Procesar las recomendaciones para asegurar formato correcto
            recomendaciones = []
            for linea in recomendaciones_texto.split('\n'):
                linea = linea.strip()
                if linea and (linea.startswith('1.') or linea.startswith('2.') or linea.startswith('3.')):
                    # Extraer solo el texto de la recomendación
                    recomendacion = linea.split('.', 1)[1].strip() if '.' in linea else linea
                    recomendaciones.append(recomendacion)
            
            # Asegurar que tengamos exactamente 3 recomendaciones
            while len(recomendaciones) < 3:
                recomendaciones.append("No hay suficientes datos para generar esta recomendación")
            
            return recomendaciones[:3]  # Solo las primeras 3
            
        except Exception as e:
            return [
                f"Error al generar recomendación 1: {str(e)}",
                "Error al generar recomendación 2",
                "Error al generar recomendación 3"
            ] 