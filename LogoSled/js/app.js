document.addEventListener('DOMContentLoaded', () => {//ожидание загрузки страницы
    const turtle1 = document.getElementById('turtle-img');
    const turtle2 = document.getElementById('turtle-img-2');
    const turtle3 = document.getElementById('turtle-img-3');
    const turtle4 = document.getElementById('turtle-img-4');
    const turtle5 = document.getElementById('turtle-img-5');//инициализация черпашек и поиск на странице
    const starterButton = document.querySelector('.starter-button');//инициализация и поиск кнопки старт

    const titleOverlay = document.querySelector('.title-overlay');//инициализация и поиск титульника
    const backgroundLayer1 = document.getElementById('layer-1');//инициализация и поиск первой главы
    const backgroundLayer2 = document.getElementById('layer-2');//инициализация и поиск второй главы
    const backgroundLayer3 = document.getElementById('layer-3');//инициализация и поиск третьей главы
    const backgroundLayer4 = document.getElementById('layer-4');//инициализация и поиск четвёртой главы
    const backgroundLayer5 = document.getElementById('layer-5');//инициализация и поиск пятой главы

    const levels = [
        document.getElementById('level-1'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-2'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-3'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-4'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-5'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-6'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-7'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-8'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-9'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-10'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-11'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-12'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-13'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-14'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-15'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-16'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-17'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-18'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-19'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-20'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-21'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-22'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-23'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-24'),//собираем все вопросы каждой главы вместе в константу
        document.getElementById('level-25')//собираем все вопросы каждой главы вместе в константу
    ];

    const submitButtons = document.querySelectorAll('.submit-btn');//инициализация и поиск кнопки ответить
    const pathPoints = document.querySelectorAll('.path-point');//инициализация и поиск всех точек пути
    

    let isProcessing = false;//защита кнопки (флаг) от двйных нажатий для того чтобы черпашка не переходила на несколько точек сразу

    const layerPoints = {//константа для точек каждого уровня
        1: [], 
        2: [], 
        3: [], 
        4: [], 
        5: [] 
    };
    
    pathPoints.forEach((point, index) => {//раскладываем точки по уровням(по индексам)
        if (index < 5) layerPoints[1].push(point);
        else if (index < 10) layerPoints[2].push(point);
        else if (index < 15) layerPoints[3].push(point);
        else if (index < 20) layerPoints[4].push(point);
        else layerPoints[5].push(point);
    });
    
    
    let activatedPoints = {//просмотр какие точки уже пройдены черпашкой
        1: new Set(),
        2: new Set(),
        3: new Set(),
        4: new Set(),
        5: new Set()
    };

    let layerPointIndexes = {//на каждой главе с точки с индексом 0(то есть начинаем с первой точки)
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    
    // просмотр пройденных точек пути 
    let levelCompleted = {};

    let turtlePositions = {//первые точки от края слоёв на новой главе
        1: { top: '40.33%', left: '58.67%' },
        2: { top: '37.33%', left: '55.67%' },
        3: { top: '50.00%', left: '58.00%' },
        4: { top: '39.33%', left: '55.67%' },
        5: { top: '48.00%', left: '57.00%' }
    };

    const turtles = {//к каждой черпашке присваеваем её позицию
        1: turtle1,
        2: turtle2,
        3: turtle3,
        4: turtle4,
        5: turtle5
    };
    
    Object.keys(turtles).forEach(layer => {//каждая черпашка на её начальном месте
        if (turtles[layer]) {
            turtles[layer].style.top = turtlePositions[layer].top;
            turtles[layer].style.left = turtlePositions[layer].left;
        }
    });

    function getCurrentLayer() {//узнаём на каком мы слое и какой сейчас фон
        if (backgroundLayer1.style.display !== 'none') return 1;
        if (backgroundLayer2.style.display !== 'none') return 2;
        if (backgroundLayer3.style.display !== 'none') return 3;
        if (backgroundLayer4.style.display !== 'none') return 4;
        if (backgroundLayer5.style.display !== 'none') return 5;
        return 1;
    }

    const correctImage = document.createElement('img');//объявление и стили картинки верно(для ответа черпашки на наше действие)
    correctImage.src = 'Images/верно.png';
    correctImage.className = 'result-image correct-result';
    correctImage.style.position = 'absolute';
    correctImage.style.display = 'none';
    correctImage.style.zIndex = '1000';
    correctImage.style.width = '150px';
    correctImage.style.height = 'auto';
    document.body.appendChild(correctImage);

    const wrongImage = document.createElement('img');//объявление и стили картинки неверно(для ответа черпашки на наше действие)
    wrongImage.src = 'Images/неверно.png';
    wrongImage.className = 'result-image wrong-result';
    wrongImage.style.position = 'absolute';
    wrongImage.style.display = 'none';
    wrongImage.style.zIndex = '1000';
    wrongImage.style.width = '150px';
    wrongImage.style.height = 'auto';
    document.body.appendChild(wrongImage);

    const finalOverlay = document.createElement('div');//объявление и стили картинки финального окна
    finalOverlay.className = 'final-overlay';
    finalOverlay.style.position = 'fixed';
    finalOverlay.style.top = '0';
    finalOverlay.style.left = '0';
    finalOverlay.style.width = '100%';
    finalOverlay.style.height = '100%';
    finalOverlay.style.backgroundColor = 'rgb(211, 209, 209)';
    finalOverlay.style.display = 'none';
    finalOverlay.style.flexDirection = 'column';
    finalOverlay.style.alignItems = 'center';
    finalOverlay.style.justifyContent = 'center';
    finalOverlay.style.zIndex = '10000';
    
    const finalImage = document.createElement('img');//сама картинка финального окна
    finalImage.src = 'Images/финал.png';
    finalImage.className = 'final-image';
    finalImage.style.maxWidth = '100%';
    finalImage.style.maxHeight = '100%';
    finalImage.style.objectFit = 'contain';
    finalImage.style.marginBottom = '30px';
    
    const restartWrapper = document.createElement('button');//объявление и стили финальной кнопки перезапуска
    restartWrapper.className = 'restart-button';
    restartWrapper.type = 'button';
    restartWrapper.style.background = 'none';
    restartWrapper.style.border = 'none';
    restartWrapper.style.cursor = 'pointer';
    restartWrapper.style.outline = 'none';
    restartWrapper.style.zIndex = '10001';
    restartWrapper.style.position = 'absolute';
    restartWrapper.style.top = '70%';
    restartWrapper.style.left = '50%';
    restartWrapper.style.transform = 'translate(-50%, -50%)';
    restartWrapper.style.width = 'auto';
    restartWrapper.style.maxWidth = '400px';

    const restartButtonImg = document.createElement('img');
    restartButtonImg.src = 'Images/финалка.png';
    restartButtonImg.alt = 'Начать заново';

    
    restartWrapper.appendChild(restartButtonImg);
    restartWrapper.addEventListener('click', () => {
        location.reload();
    });
    
    finalOverlay.appendChild(finalImage);
    finalOverlay.appendChild(restartWrapper);
    document.body.appendChild(finalOverlay);


    backgroundLayer1.style.display = 'none';//прячем все уровни перед стартом игры
    backgroundLayer2.style.display = 'none';
    backgroundLayer3.style.display = 'none';
    backgroundLayer4.style.display = 'none';
    backgroundLayer5.style.display = 'none';
    levels.forEach(level => {
        if (level) level.style.display = 'none';
    });

    starterButton.addEventListener('click', () => {//при нажатии на старт прячем титульник и все объекты на нём и открываем уровень1
        titleOverlay.classList.add('hidden');
        backgroundLayer1.style.display = 'flex';
        levels[0].style.display = 'block';
    });

    function getActiveTurtle() {//проверка черпашки
        const layer = getCurrentLayer();
        return turtles[layer];
    }

    function updateTurtlePosition(layer, top, left) {//передвижение черпашки за 1 секунду
        const turtle = turtles[layer];
        if (turtle) {
            turtle.style.transition = 'top 1s ease-in-out, left 1s ease-in-out';
            turtle.style.top = top;
            turtle.style.left = left;
        }
    }

    submitButtons.forEach((button, index) => {//проверка ответа на вопрос
        if (button && index < 25) {
            button.addEventListener('click', () => {
                // проверка блокировки кнопки
                if (isProcessing) return;
                
                // проверка завершения уровня
                if (levelCompleted[index]) return;
                
                const selectedAnswers = document.querySelectorAll(`input[name="level-${index + 1}"]:checked`);//проверка пока не ответил нп всё не переходишь
                
                if (selectedAnswers.length === 0) {
                    alert('Сначала выбери ответ!');
                    return;
                }
                
                // блокировка нажатий
                isProcessing = true;
                
                const firstInput = document.querySelector(`input[name="level-${index + 1}"]`);//какие ответы одиночные или множественные
                const isCheckbox = firstInput && firstInput.type === 'checkbox';
                
                let isCorrect;
                //проверка множетсвенного выбора
                if (isCheckbox) {
                    const allCorrectAnswers = document.querySelectorAll(`input[name="level-${index + 1}"][value="correct"]`);
                    const allWrongAnswers = document.querySelectorAll(`input[name="level-${index + 1}"][value="wrong"]`);
                    
                    const allCorrectSelected = Array.from(allCorrectAnswers).every(input => input.checked);
                    const noWrongSelected = Array.from(allWrongAnswers).every(input => !input.checked);
                    
                    isCorrect = allCorrectSelected && noWrongSelected && selectedAnswers.length === allCorrectAnswers.length;
                } else {
                    isCorrect = selectedAnswers[0].value === 'correct';
                }
                //слой черпашки и какая активна
                const currentLayer = getCurrentLayer();
                const activeTurtle = getActiveTurtle();
                
                if (activeTurtle) {
                    const resultImage = isCorrect ? correctImage : wrongImage;
                    showResultImageBesideTurtle(resultImage, activeTurtle, () => {
                        if (isCorrect) {
                            // отметка  уровня как завершенного
                            levelCompleted[index] = true;
                            
                            // перемещение черепашки на 1 точку вперёд
                            if (layerPointIndexes[currentLayer] < layerPoints[currentLayer].length) {
                                const nextPointIndex = layerPointIndexes[currentLayer];
                                const nextPoint = layerPoints[currentLayer][nextPointIndex];
                                
                                // проверка неактивации данной точки
                                if (!activatedPoints[currentLayer].has(nextPointIndex)) {
                                    turtlePositions[currentLayer].top = nextPoint.style.top;
                                    turtlePositions[currentLayer].left = nextPoint.style.left;
                                    
                                    updateTurtlePosition(currentLayer, turtlePositions[currentLayer].top, turtlePositions[currentLayer].left);
                                    
                                    nextPoint.classList.add('visible');
                                    
                                    // отметка точки как активированная
                                    activatedPoints[currentLayer].add(nextPointIndex);
                                    
                                    // увеличение индекс  если это ожидаемая точка
                                    if (nextPointIndex === layerPointIndexes[currentLayer]) {
                                        layerPointIndexes[currentLayer]++;
                                    }
                                }
                            }
                            
                            proceedToNextLevel(index);
                        }
                        // Разблокируем кнопку после обработки
                        setTimeout(() => {
                            isProcessing = false;
                        }, 100);
                    });
                } else {
                    if (isCorrect) {
                        // Отмечаем уровень как завершенный
                        levelCompleted[index] = true;
                        //если проёдена то сделай точку видимой и пройди на неё
                        if (layerPointIndexes[currentLayer] < layerPoints[currentLayer].length) {
                            const nextPointIndex = layerPointIndexes[currentLayer];
                            const nextPoint = layerPoints[currentLayer][nextPointIndex];
                            
                            if (!activatedPoints[currentLayer].has(nextPointIndex)) {
                                turtlePositions[currentLayer].top = nextPoint.style.top;
                                turtlePositions[currentLayer].left = nextPoint.style.left;
                                nextPoint.classList.add('visible');
                                activatedPoints[currentLayer].add(nextPointIndex);
                                //увеличение счётчика точек
                                if (nextPointIndex === layerPointIndexes[currentLayer]) {
                                    layerPointIndexes[currentLayer]++;
                                }
                            }
                        }
                        proceedToNextLevel(index);
                    }
                    //сделай флаг открытым чтобы можно нажать на кнопку проверить
                    setTimeout(() => {
                        isProcessing = false;
                    }, 100);
                }
            });
        }
    });
//функция для показа результата рядом с черпашкой
    function showResultImageBesideTurtle(imageElement, turtleElement, callback) {
        const turtleRect = turtleElement.getBoundingClientRect();
        
        const offsetX = 10;
        const offsetY = -20;
        
        imageElement.style.top = (turtleRect.top + offsetY) + 'px';
        imageElement.style.left = (turtleRect.left + turtleRect.width + offsetX) + 'px';
        imageElement.style.display = 'block';
        imageElement.style.animation = 'bounceIn 0.5s ease-in-out';
        
        setTimeout(() => {
            imageElement.style.display = 'none';
            imageElement.style.animation = '';
            if (callback) callback();
        }, 1000);//убираем картинку через 1 секунду
    }

    function proceedToNextLevel(levelIndex) {
        levels[levelIndex].style.display = 'none';//пряечм уровень на котором сейчас 

        if (levelIndex < 24) {
            if (levelIndex === 4) {
                backgroundLayer1.style.display = 'none';
                backgroundLayer2.style.display = 'flex';
                updateTurtlePosition(2, turtlePositions[2].top, turtlePositions[2].left);
            } else if (levelIndex === 9) {
                // переход со 2 на 3 слой
                backgroundLayer2.style.display = 'none';
                backgroundLayer3.style.display = 'flex';
                updateTurtlePosition(3, turtlePositions[3].top, turtlePositions[3].left);
            } else if (levelIndex === 14) {
                // переход со 3 на 4 слой
                backgroundLayer3.style.display = 'none';
                backgroundLayer4.style.display = 'flex';
                updateTurtlePosition(4, turtlePositions[4].top, turtlePositions[4].left);
            } else if (levelIndex === 19) {
                // переход со 4 на 5 слой
                backgroundLayer4.style.display = 'none';
                backgroundLayer5.style.display = 'flex';
                updateTurtlePosition(5, turtlePositions[5].top, turtlePositions[5].left);
            }
            levels[levelIndex + 1].style.display = 'block';
        } else {
            finalOverlay.style.display = 'flex';
        }
    }
//анимация появления картинок 
    const styleSheet = document.createElement('style');//лист для стилей css
    styleSheet.textContent = `
        @keyframes bounceIn {
            0% { 
                opacity: 0; //сначала прозрачная
                transform: scale(0.3); сжатие до 30%
            }
            50% { 
                opacity: 1; //полностью видимая
                transform: scale(1.1); //увеличена от своего нормального размера на 10%
            }
            70% { 
                transform: scale(0.9); //делаем картинку меньше на 10% чем она есть в нормальном фале
            }
            100% { 
                opacity: 1; 
                transform: scale(1); //нормальный размер картинки
            }
        }
        
        .result-image {
            pointer-events: none;//не нажимается на картинку
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));//тень под ней
        }
        
        .correct-result {
            filter: drop-shadow(0 4px 6px rgba(76, 175, 80, 0.5));//зеленая для верного ответа
        }
        
        .wrong-result {
            filter: drop-shadow(0 4px 6px rgba(244, 67, 54, 0.5));//красная для неверого ответа
        }
    `;
    document.head.appendChild(styleSheet);//добавляем на страниц стили css 
});