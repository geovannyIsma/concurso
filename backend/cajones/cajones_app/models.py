from django.db import models

# Create your models here.

class Cajon(models.Model):
    nombre = models.CharField(max_length=100)
    capacidad_maxima = models.IntegerField()
    
    def __str__(self):
        return self.nombre + f" (Capacidad: {self.capacidad_maxima})"
    
    
class CajonHistorial(models.Model):
    cajon = models.ForeignKey(Cajon, on_delete=models.CASCADE, related_name='historial_entries')
    fecha = models.DateTimeField(auto_now_add=True)
    accion = models.CharField(max_length=100)  # e.g., 'creado', 'modificado', 'eliminado'
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.cajon.nombre} - {self.accion} en {self.fecha}"


class TipoObjeto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre
    
class CajonTamanio(models.TextChoices):
    PEQUENO = 'PE', 'Pequeño'
    MEDIANO = 'ME', 'Mediano'
    GRANDE = 'GR', 'Grande'

class CajonObjeto(models.Model):
    cajon = models.ForeignKey(Cajon, on_delete=models.CASCADE, related_name='objetos')
    nombre_objeto = models.CharField(max_length=100)
    tipo_objeto = models.ForeignKey('TipoObjeto', on_delete=models.CASCADE, related_name='objetos')
    tamanio = models.CharField(
        max_length=2,
        choices=CajonTamanio.choices,
        default=CajonTamanio.PEQUENO
    )

    def __str__(self):
        return f"{self.nombre_objeto} ({self.tipo_objeto.nombre}) en {self.cajon.nombre} - Tamaño: {self.tamanio}"
    