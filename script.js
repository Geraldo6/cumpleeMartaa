function goToNextPage() {
    window.location.href = "nextpage.html";
}
// Verificar si la historia de Cerdanyola está completada
if (localStorage.getItem('cerdayolaCompleted') === 'true') {
    const cerdayolaItem = document.getElementById('cerdayola');
    cerdayolaItem.style.filter = 'grayscale(100%)'; // Cambiar a gris
    cerdayolaItem.style.pointerEvents = 'none'; // Deshabilitar clic
}


