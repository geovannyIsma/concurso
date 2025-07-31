#!/usr/bin/env python
"""
Script de configuración inicial para el proyecto de Cajones
"""

import os
import subprocess
import sys

def run_command(command):
    """Ejecutar comando y mostrar resultado"""
    print(f"Ejecutando: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✅ {command} - Exitoso")
        return True
    else:
        print(f"❌ {command} - Error: {result.stderr}")
        return False

def create_env_file():
    """Crear archivo .env si no existe"""
    env_file = '.env'
    if not os.path.exists(env_file):
        print("Creando archivo .env...")
        with open(env_file, 'w') as f:
            f.write("# Configuración de Gemini AI\n")
            f.write("GEMINI_API_KEY=tu_api_key_de_gemini_aqui\n\n")
            f.write("# Configuración de Django\n")
            f.write("SECRET_KEY=django-insecure-e_qw6cyadic9f^8qi5hv3%+7k8+%dii#yco(2_&qd#8=@ota4a\n")
            f.write("DEBUG=True\n")
            f.write("ALLOWED_HOSTS=localhost,127.0.0.1\n")
        print("✅ Archivo .env creado")
    else:
        print("✅ Archivo .env ya existe")

def main():
    """Función principal de configuración"""
    print("🚀 Configurando proyecto de Cajones...")
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('manage.py'):
        print("❌ Error: No se encontró manage.py. Ejecuta este script desde el directorio del proyecto.")
        sys.exit(1)
    
    # Crear archivo .env
    create_env_file()
    
    # Instalar dependencias
    print("\n📦 Instalando dependencias...")
    if not run_command("pip install -r requirements.txt"):
        print("❌ Error al instalar dependencias")
        sys.exit(1)
    
    # Ejecutar migraciones
    print("\n🗄️ Ejecutando migraciones...")
    if not run_command("python manage.py makemigrations"):
        print("❌ Error al crear migraciones")
        sys.exit(1)
    
    if not run_command("python manage.py migrate"):
        print("❌ Error al aplicar migraciones")
        sys.exit(1)
    
    # Crear superusuario (opcional)
    print("\n👤 ¿Deseas crear un superusuario? (s/n): ", end="")
    response = input().lower()
    if response in ['s', 'si', 'sí', 'y', 'yes']:
        run_command("python manage.py createsuperuser")
    
    print("\n✅ Configuración completada!")
    print("\n📋 Próximos pasos:")
    print("1. Configura tu API key de Gemini en el archivo .env")
    print("2. Ejecuta: python manage.py runserver")
    print("3. Accede a: http://localhost:8000/admin/")
    print("4. La API estará disponible en: http://localhost:8000/api/")
    
    print("\n🔗 Documentación:")
    print("- API: API_DOCUMENTATION.md")
    print("- Recomendaciones: README_RECOMENDACIONES.md")

if __name__ == "__main__":
    main() 