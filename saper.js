/* add dom event listener => make sure that html file will be loaded before js code */

//const { parseInt } = require("lodash");

 
document.addEventListener('DOMContentLoaded',()=>{
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    let flags = 0;
    let width = 16;
    let squares = [];
    let bombQuant = 40;
    let gameIsOver = false;

   
    function createBoard() {
        createResetListener();
        const bombArr = Array(bombQuant).fill('bomb');
        flagsLeft.innerHTML = bombQuant;
        const remainingCells = Array(width**2 - bombQuant).fill('valid');
        const gArr = remainingCells.concat(bombArr);
        const shuffArr = gArr.sort(() => Math.random() - 0.5);
        for (let i = 0; i < width**2; i++) {
            // create cells, add id and a class for a cell
            const square = document.createElement('div');
            square.setAttribute('id',i);
            square.classList.add(shuffArr[i]);
            //append out cell to a div
            grid.appendChild(square);
            squares.push(square);
            //hold the cell
            square.addEventListener("mousedown", function() {
                if(gameIsOver){
                    return;
                }
                document.getElementById('reset').innerHTML = '<img src=images/o-face.png>';

            });
            square.addEventListener("mouseup", function() {
                if(gameIsOver){
                    return;
                }
                document.getElementById('reset').innerHTML = '<img src=images/smiley-face.png>';
            });
            //
            square.addEventListener('click',function(e){
                click(square);
            })

            //check click
            square.oncontextmenu = function(e){
                e.preventDefault();
                    addFlag(square); 
            }
        }  

        //generate numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            if(squares[i].classList.contains('valid')){
                if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++;
                if(i > 15 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if(i > 16 && squares[i - width].classList.contains('bomb')) total++;
                if(i > 17 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if(i < 244 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++;
                if(i < 240 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if(i < 238 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if(i < 239 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data',total);
            }
        }
    }
    createBoard();


//click smile
function createResetListener() { 
    document.getElementById('reset').addEventListener('click', function() {
        window.location.reload();
    });
  }
//end click smile

//counter
    const timeLeft = document.querySelector('#countdown');
    const startingMin = 40;
    let time = startingMin * 60;
    function calcTime(){
        setTimeout(function(){
            let minutes = Math.floor(time/60);
            let seconds = time % 60;

            seconds2 = seconds < 10 ? '0' + seconds : seconds;
            minutes2 = minutes < 10 ? '0' + minutes : minutes;
            time = time - 1;
            timeLeft.innerHTML = `${minutes2}:${seconds2}`;
            if(gameIsOver){
                return;
            }
            if(minutes === 0 && seconds === 0){
                gameIsOver = true;
                if(gameIsOver){
                    document.getElementById('reset').innerHTML = '<img src=images/dead-face.png>';
                    return;
                }
            }

            calcTime();
        },1000)
    }
    calcTime();
    //end counter

    function addFlag(square){
        if(gameIsOver) return;
        if(!square.classList.contains('checked')/*&& flags < bombQuant*/){
            if(!square.classList.contains('flag') &&!square.classList.contains('question') && (bombQuant - flags) > 0){
                square.classList.add('flag');
                square.innerHTML = ' 🚩';
                flags++;
                flagsLeft.innerHTML = bombQuant - flags;
                win();
            }
            else if(square.classList.contains('flag') && !square.classList.contains('question')){
                square.classList.remove('flag');
                square.classList.add('question');
                square.innerHTML = '?';
                flags--;
                flagsLeft.innerHTML = bombQuant - flags;
            } 
            else if(square.classList.contains('question') && !square.classList.contains('flag')){
                square.classList.remove('question');
                square.innerHTML = '';
                //flags--;
                flagsLeft.innerHTML = bombQuant - flags;
            }
        }
    }

    function click(square){
        let currentId = square.id;
        if(gameIsOver) return;
        if(square.classList.contains('checked') || square.classList.contains('flag')) return;
        if(square.classList.contains('bomb')){
            gameOver(square);
        }else{
            let total = square.getAttribute('data');
            if (total != 0 ){
                square.classList.add('checked');
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                if (total == 5) square.classList.add('five')
                if (total == 6) square.classList.add('six')
                if (total == 7) square.classList.add('seven')
                if (total == 8) square.classList.add('eight')
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    }

    function checkSquare(square, currentId) { 
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width -1);
        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId)-1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 15 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 16){
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 17 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 244 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 240 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 238 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 239){
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        },10);
    }

    function gameOver (square){
        document.getElementById('reset').innerHTML = '<img src=images/dead-face.png>';
        console.log('BOOM! Game is Over');
        gameIsOver = true;
        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣';
            }
        })
    }

    function win (){
        let matches = 0;
        for (let i = 0; i < squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++;
            }
            if(matches === bombQuant){
                document.getElementById('reset').innerHTML = '<img src=images/cool-face.png>';
                alert('YOU WIN');
                gameIsOver = true;
            }
            if(gameIsOver){
                return;
            }
        
        }
    }
})