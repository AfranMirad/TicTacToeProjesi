var time=0;
var TimerTurn=true;
var TimerBarStop=true;
var origBoard; // her karede ne olduğunu izleyen bir dizi: X, O veya hiçbir şey
const OPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [  //dizi kazanan kombinasyonları gösterecek
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

var turn_count = 0;
const cells = document.querySelectorAll('.cell'); // hücre değişkeni, bir 'cell' sınıfına sahip olan her öğeye bir başvuru depolayacak.
startGame(); // oyuna başlamak için arama fonksiyonu



//Oyunu başlatmak için işlevi tanımlamak ("Replay" düğmesine tıkladığınızda da çalışır)
function startGame() {
  TimerBarStop=true;
  progress(5,10, $('#progressBar'));
  turn_count=0;
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys()) //diziyi 0-9 arası her sayıya dönüştür
  for (var i=0; i< cells.length; i++) {
  cells[i].innerText = ''; //hücrede hiçbir şey olmayacak
  cells[i].style.removeProperty('background-color'); // arka plan rengini kaldırarak
  cells[i].addEventListener('click',turnClick, false); //turnClick işlevini çağırmak

    }
}


// turnClick işlevini tanımlama
function turnClick (square) {
  console.log(TimerTurn);
    if (typeof origBoard[square.target.id] === 'number') { //sadece tıklanan id bir sayıysa, bu kimse bu noktada oynamadığı anlamına gelir
        turn(square.target.id, OPlayer);
        if(!checkTie()) turn(bestSpot(), aiPlayer); //bir dönüş alarak insan oyuncu

      }
}



// dönüş fonksiyonunu tanımlama
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;  // ekranın güncellenmesiyle oynatıcının nereye tıklandığını görebiliriz
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)  // Sıra alındığında oyunun kazanılıp kazanılmadığını kontrol edeceğiz

}


// checkWin işlevini tanımlama
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
  (e === player) ? a.concat(i) : a, []); //Oynatıcının oynadığı her dizini bulmak
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) { //Oyunun her winCombos üzerinden döngü yaparak kazanılıp kazanılmadığını kontrol etme
    if (win.every(elem => plays.indexOf(elem) > -1)) { //Bu kazananın kazananı olarak sayılan her yerde oyuncu oynandı
      gameWon = {index: index, player: player};  //hangi oyuncuyu kazanırsa kazanır ve hangi oyuncu kazanırdı
      break;
    }
}
return gameWon;
}


// oyun tanımlama işlevi
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) { // WinCombos'un her dizininden geçiyor
    document.getElementById(index).style.backgroundColor = gameWon.player === OPlayer ? "#4da6ff" : "#ff0000"; // AI arka plan rengini kırmızıya kazandıysa, arka plan rengini kırmızıya kazandıysa
}
  for (var i= 0; i < cells.length; i++ ) { // artık hücreleri tıklayamadığımızdan emin olmak
    cells[i].removeEventListener('click', turnClick,false);

}
  declareWinner(gameWon.player === OPlayer ? "Sen kazandın!" : "Bilgisayar Kazandı!"); // İnsan Oyuncu kazanırsa "Sen kazandın!" gösterse, aksi takdirde "Kayboldun".
  TimerBarStop=false;
}

// declareWinner işlevini tanımlama
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

// emptySuares işlevinin tanımlanması
function emptySquares() {

    return origBoard.filter(s => typeof s === 'number'); // eleman türünün sayıya eşit olup olmadığını
                                                         //görmek için origBoard'daki tüm öğeleri filtreleyin.
                                                         //Eğer evet ise, onu iade edeceğiz (sayılar boş olan
                                                         //tüm kareler, X ve O ile kareler boş değil)
}
// bestSpot işlevini tanımlama
function bestSpot() {
    return emptySquares()[0];
}
// checkTie işlevinin tanımlanması
function checkTie() {
  if (emptySquares().length === 0) { // her kare doluysa ve kimse kazanmadıysa o zaman bir kravat
    for (var i = 0; i < cells.length; i++) {
       cells[i].style.backgroundColor = "#66ff66"; // arka plan rengini yeşil olarak ayarlama
       cells[i].removeEventListener('click', turnClick, false); //makindeclareWinner(gameWon.player === Oplayer? "Sen kazandın!": "Kaybettin.")
                                                                //emin kullanıcı oyun bitti her yerde tıklayamaz

      }

    if(time>6){
        declareWinner("Süre Farkı O kazandı!");
    }else{
        declareWinner("Süre Farkı AI kazandı!");
    }
    TimerBarStop=false;

    return true; // bir kravat olarak doğru dönüyor
}
return false;
}


function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find('div').animate({ width: progressBarWidth }, 600).html(Math.floor());
    if(timeleft > 0 && timeleft<10) {
        setTimeout(function() {
            if(TimerTurn==false){
                if(TimerBarStop){progress(timeleft +1, timetotal, $element);}

            }
            else{
                if(TimerBarStop){progress(timeleft -1, timetotal, $element);}

            }


        }, 1000);

      }

      if(timeleft==0){
          for (var i= 0; i < cells.length; i++ ) { // artık hücreleri tıklayamadığımızdan emin olmak
            cells[i].removeEventListener('click', turnClick,false);

            }
        declareWinner("X Kazandı!");
      }
      if(timeleft==10){
          for (var i= 0; i < cells.length; i++ ) { // artık hücreleri tıklayamadığımızdan emin olmak
            cells[i].removeEventListener('click', turnClick,false);
            }
        declareWinner("O Kazandı!");
      }
      time=timeleft;
};
