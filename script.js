function ejecutar(tipo) {
    console.log("Iniciando función: " + tipo);
    
    if (tipo === 'Objetivos') {
        alert("Abriendo carpeta de proyectos de UDU Studios...");
        // Aquí conectaremos con Python después
    }
    if (tipo === 'codigo') {
        // Redirigir a la herramienta de creación de niveles
        console.log("Estás siendo redirigido a una carpeta de creatorTools de UDU Studios")
        window.location.href = "creatorTools/Function-CreateLevelsZT/creatorLevels.html";
    }
    if (tipo === 'creadorQR') {
        // Redirige a La herramienta para generar códigos QR gratuitos <<Desarrollada por UDU Studios>>
        console.log("Te redirigimos a la herramienta de creación de códigos QR gratuita inegrada por defecto.")
        window.location.href = "GenerateQRs/creatorQR.html";
    }
}