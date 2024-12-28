function goToWorlds() {
    // Guardar el estado de completado en localStorage
    localStorage.setItem('juegoComplicadoComplete', 'true');
    
    // Redirigir a la página de mundos
    window.location.href = '../../nextpage.html'; // Asegúrate de que el nombre del archivo sea correcto
}

