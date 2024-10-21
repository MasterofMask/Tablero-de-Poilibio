// Definición de la cuadrícula Polybius
// La cuadrícula es un array 2D donde cada letra tiene una posición única
// definida por su fila y columna (excluyendo la primera fila y columna que son índices)
const grid = [
    ['', '1', '2', '3', '4', '5'],    // Fila 0: índices de columna
    ['1', 'A', 'B', 'C', 'D', 'E'],   // Fila 1: letras A-E
    ['2', 'F', 'G', 'H', 'I/J', 'K'], // Fila 2: letras F-K (I y J comparten posición)
    ['3', 'L', 'M', 'N', 'O', 'P'],   // Fila 3: letras L-P
    ['4', 'Q', 'R', 'S', 'T', 'U'],   // Fila 4: letras Q-U
    ['5', 'V', 'W', 'X', 'Y', 'Z']    // Fila 5: letras V-Z
];

// Obtención de elementos del DOM para interactuar con la interfaz
const polybiusGrid = document.getElementById('polybiusGrid');  // Cuadrícula de botones en la interfaz
const valorCifrado = document.getElementById('valorCifrado');  // Campo para mostrar el valor cifrado
const valorDescifrado = document.getElementById('valorDescifrado');  // Campo para mostrar el valor descifrado
const modeSwitch = document.getElementById('modeSwitch');  // Interruptor para cambiar entre cifrar y descifrar
const modeText = document.getElementById('modeText');  // Texto que muestra el modo actual

// Variables de estado
let isLetterMode = false;           // Modo actual: false para números (descifrado), true para letras (cifrado)
let firstNumber = null;             // Almacena el primer número seleccionado en modo números
let isFirstNumberSelected = false;  // Indica si ya se seleccionó el primer número en modo números

// Crea la cuadrícula de botones en la interfaz
function createGrid() {
    grid.forEach((row, i) => {  // Recorre cada fila de la cuadrícula
        row.forEach((cell, j) => {  // Recorre cada celda de la fila
            const button = document.createElement('button');  // Crea un botón por cada celda
            button.textContent = cell;  // Establece el texto del botón como el valor de la celda
            button.disabled = i !== 0 && j !== 0;  // Deshabilita botones que no sean índices (primera fila y columna)
            button.addEventListener('click', () => handleButtonClick(i, j));  // Agrega el manejador de eventos para los clics
            polybiusGrid.appendChild(button);  // Añade el botón a la cuadrícula de la interfaz
        });
    });
}

// Maneja los clics en los botones de la cuadrícula
function handleButtonClick(row, col) {
    if (isLetterMode) {
        // Modo letras: seleccionar una letra para cifrarla
        if (row > 0 && col > 0) {
            // La letra seleccionada está en grid[row][col]
            valorDescifrado.value += grid[row][col];  // Añade la letra al campo de texto de descifrado
            // El par de números correspondiente es: columna seguida de fila
            valorCifrado.value += `${col}${row} `;  // Añade el par de números cifrados al campo de cifrado
        }
    } else {
        // Modo números: seleccionar dos números para descifrar
        if (row === 0 && col > 0 && !isFirstNumberSelected) {
            // Selección del primer número (columna)
            firstNumber = col;  // Almacena el número de la columna
            valorCifrado.value += col;  // Añade el número al valor cifrado
            isFirstNumberSelected = true;  // Indica que se ha seleccionado el primer número
        } else if (col === 0 && row > 0 && isFirstNumberSelected) {
            // Selección del segundo número (fila)
            valorCifrado.value += row + ' ';  // Añade el número de la fila al valor cifrado
            // La letra correspondiente está en grid[row][firstNumber]
            valorDescifrado.value += grid[row][firstNumber];  // Añade la letra descifrada al campo de descifrado
            // Resetear para la próxima selección
            firstNumber = null;  // Reinicia el valor del primer número
            isFirstNumberSelected = false;  // Reinicia el estado de la selección
        }
        updateButtonStates();  // Actualizar qué botones están habilitados
    }
}

// Cambia entre modo letras y números
function toggleMode() {
    isLetterMode = modeSwitch.checked;  // Cambia el modo basado en el interruptor
    modeText.textContent = isLetterMode ? 'Letras' : 'Números';  // Actualiza el texto del modo actual
    // Limpiar campos y resetear estado
    valorCifrado.value = '';  // Limpia el campo de cifrado
    valorDescifrado.value = '';  // Limpia el campo de descifrado
    firstNumber = null;  // Reinicia el primer número seleccionado
    isFirstNumberSelected = false;  // Reinicia el estado de la selección
    updateButtonStates();  // Actualiza el estado de los botones
}

// Actualiza qué botones están habilitados según el modo y estado actual
function updateButtonStates() {
    const buttons = polybiusGrid.getElementsByTagName('button');  // Obtiene todos los botones de la cuadrícula
    for (let i = 0; i < buttons.length; i++) {
        const row = Math.floor(i / 6);  // Calcula la fila del botón
        const col = i % 6;  // Calcula la columna del botón
        if (isLetterMode) {
            // En modo letras, solo se pueden seleccionar las letras (no los índices)
            buttons[i].disabled = row === 0 || col === 0;  // Deshabilita los botones de la primera fila y columna
        } else {
            if (isFirstNumberSelected) {
                // Si ya se seleccionó el primer número, solo se puede seleccionar de la primera columna
                buttons[i].disabled = row === 0 || (col !== 0 && row !== 0);  // Deshabilita las celdas que no son la primera columna
            } else {
                // Si no se ha seleccionado el primer número, solo se puede seleccionar de la primera fila
                buttons[i].disabled = col === 0 || (row !== 0 && col !== 0);  // Deshabilita las celdas que no son la primera fila
            }
        }
    }
}

// Inicialización
createGrid();  // Crea la cuadrícula de botones al cargar la página
modeSwitch.addEventListener('change', toggleMode);  // Agrega el evento para cambiar el modo al interruptor
updateButtonStates();  // Actualiza el estado de los botones según el modo inicial
