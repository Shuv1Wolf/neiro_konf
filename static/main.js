const config = {
    'lineSize': 8,
    'color': 'black'
}

window.onload = () => {

    let isRec = false
    let newDraw = false
    let posX = []
    let posY = []

    // Инициализируем html элементы
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    // Устанавливаем размер холста
    canvas.setAttribute('width', 280);
    canvas.setAttribute('height', 280);

    ctx.lineWidth = config.lineSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = config.color;
    ctx.fillStyle = config.color;

    newDraw = true
    clearCanvas()

    // При нажатии на мышь
    canvas.addEventListener("mousedown", (e) => {
        if (isRec) return;
        clearCanvas();
        canvas.onmousemove = (e) => recordMousePos(e);
    });

    canvas.addEventListener("touchstart", (e) => {
        if (isRec) return;
        clearCanvas();
        recordMousePos(e.touches[0]);
    });

    canvas.addEventListener("touchmove", (e) => {
        if (isRec) return;
        e.preventDefault(); // Предотвращаем прокрутку страницы
        recordMousePos(e.touches[0]);
    });

    // Когда мышь отпущена
    canvas.addEventListener("touchend", () => stopDrawing());
    canvas.addEventListener("mouseup", () => stopDrawing());

    // Добавляем позиции X и Y мыши в массимы arrayX и arrayY
    function recordMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        posX.push(e.clientX);
        posY.push(e.clientY);
        drawLine(e.clientX - rect.left, e.clientY - rect.top);
    }

    // Рисование линий
    function drawLine(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Очистить холст
    function clearCanvas() {
        if (newDraw) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = config.color;
            newDraw = false;
        }
        ctx.beginPath();
    }

    // Остановка рисования
    function stopDrawing() {
        canvas.onmousemove = null;
        posX.push(undefined);
        posY.push(undefined);
    }
    //Кнопка очистки
    document.getElementById('clear').onclick = () => {
        newDraw = true;
        clearCanvas();
    }

    // Выгрузка
    const downloadButton = document.getElementById('choice');

    downloadButton.addEventListener('click', function () {
        const resizedCanvas = document.createElement('canvas');
        const resizedContext = resizedCanvas.getContext('2d');

        // Установить новый размер для измененного canvas
        resizedCanvas.width = 28;
        resizedCanvas.height = 28;

        // Нарисовать изображение на измененном canvas
        resizedContext.drawImage(canvas, 0, 0, 28, 28);

        const imageData = resizedContext.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height);
        const pixels = imageData.data;

        // Инвертировать пиксели
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = 255 - pixels[i]; // Красный канал
            pixels[i + 1] = 255 - pixels[i + 1]; // Зеленый канал
            pixels[i + 2] = 255 - pixels[i + 2]; // Синий канал
            // pixels[i + 3] остается неизменным (альфа-канал)
        }

        // Установить инвертированные пиксели обратно на canvas
        resizedContext.putImageData(imageData, 0, 0);

        const dataURL = resizedCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'img.png';
        link.click();
    });




}