let gameActive;
let selected = false;
let selectedCell = null;

let convertIDtoInt = {};
let convertIntToID = {};
let cellElements;
let winner = [];
let possibleMove = [];
let winCon = [];

let size = 7;
let selectedCellIndex;
const statusDisplay = document.querySelector('.game-status');

GenerateGrid();
startGame();

function GenerateGrid(){
	let container = document.querySelector(".game-container");
	let value = 0;
	let midValue = parseInt(size/2);
	gameActive = true;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++){
			let cell = document.createElement("DIV");
			cell.setAttribute("class", "cell");
			cell.setAttribute("cell-index", i+""+j);

			if (i+""+j == midValue+""+midValue) {
				cell.innerHTML = "";
			}
			else if(i==0 || i==1 || i==5 || i==6){
				if(j==0 || j==1 || j==5 || j==6){
					cell.innerHTML = "X";
					cell.classList.add("hiddenCell");
				}
				else{
					cell.innerHTML = "O";
				}
			}
			else{
				cell.innerHTML = "O";
			}
	
			container.appendChild(cell);
			convertIntToID[value] = i+""+j;
			convertIDtoInt[i+""+j] = value;
			value++;
		}
	}
	//console.log(convertIntToID);
}

function cellClick(cellEvent){
	const clickedCell = cellEvent.target;
	const clickedCellIndex = clickedCell.getAttribute('cell-index');
	const clickedCellIndexInt = parseInt(clickedCellIndex);

	if (gameActive) {
		if (selected) {
			if(clickedCell == selectedCell){
				ChangeColor();
				selected = !selected;
			}
			for (var i = 1; i < possibleMove.length; i++) {
				if(clickedCell == cellElements[convertIDtoInt[possibleMove[i]]]){
					//console.log(cellElements[possibleMove[i]]);
					ChangeColor();
					Swap(clickedCell, clickedCellIndex);
					selected = !selected;
				}
			}
		}
		else{
			if(clickedCell.innerHTML == "" || clickedCell.innerHTML == "X"){
				return;
			}
			checkSelected(clickedCell, clickedCellIndex, clickedCellIndexInt);
		}
	}
	//console.log(clickedCell);
}

function checkSelected(clickedCell, clickedCellIndex, clickedCellIndexInt){
	selectedCell = clickedCell;
	selectedCellIndex = selectedCell.getAttribute('cell-index');
	selected = !selected;
	CheckNeighbour(clickedCellIndex);
	ChangeColor();
}

function CheckNeighbour(clickedCellIndex){
	if(cellElements[convertIDtoInt[clickedCellIndex]].innerHTML !="O"){
		return;
	}
	let [a,b] = (""+clickedCellIndex).split("");
	possibleMove = [clickedCellIndex];

	let y = b-1;
	let z = b-2;
	//left
	if(y>=0 && z>=0){
		if(cellElements[convertIDtoInt[a+""+y]].innerHTML == "O" && cellElements[convertIDtoInt[a+""+z]].innerHTML == ""){
			possibleMove.push(a+""+z);
			winCon.push(a+""+y);
		}	
	}
	//right
	y = parseInt(b)+1;
	z = parseInt(b)+2;
	if(y<size && z<size){
		if(cellElements[convertIDtoInt[a+""+y]].innerHTML == "O" && cellElements[convertIDtoInt[a+""+z]].innerHTML == ""){
			possibleMove.push(a+""+z);
			winCon.push(a+""+y);
		}	
	}
	//up
	y = parseInt(a)-1;
	z = parseInt(a)-2;
	if(y>=0 && z>=0){
		if(cellElements[convertIDtoInt[y+""+b]].innerHTML == "O" && cellElements[convertIDtoInt[z+""+b]].innerHTML == ""){
			possibleMove.push(z+""+b);
			winCon.push(y+""+b);
		}	
	}
	//down
	y = parseInt(a)+1;
	z = parseInt(a)+2;
	if(y<size && z<size){
		if(cellElements[convertIDtoInt[y+""+b]].innerHTML == "O" && cellElements[convertIDtoInt[z+""+b]].innerHTML == ""){
			possibleMove.push(z+""+b);
			winCon.push(y+""+b);
		}	
	}
}

function ChangeColor(){
	
	for (var i = 0; i < possibleMove.length; i++) {
		let x = convertIDtoInt[possibleMove[i]];
		if (cellElements[x] != undefined) {
			if(cellElements[x].innerHTML != ""){
				cellElements[x].classList.toggle("borderColorCoral");
			}
			else{
				cellElements[x].classList.toggle("borderColorGreen");
			}
		}
	}
	//cellElements[x].style.background = color;
	//console.log(value);
}

function Swap(clickedCell,clickedCellIndex){
	let [a,b] = (""+clickedCellIndex).split("");
	let [x,y] = (""+selectedCellIndex).split("");
	let z;
	let delElement;
	if(a==x){
		if(b<y){
			z=y-1;
		}
		else{
			z=parseInt(y)+1;
		}
		delElement =a+""+z;
	}
	if (b==y) {
		if(a<x){
			z=x-1;
		}
		else{
			z=parseInt(x)+1;
		}
		delElement = z+""+b;
	}

	cellElements[convertIDtoInt[delElement]].innerHTML="";
	winner[convertIDtoInt[selectedCellIndex]] = "";
	winner[convertIDtoInt[delElement]] = "";
	winner[convertIDtoInt[clickedCellIndex]] = "O";
	[clickedCell.innerHTML, selectedCell.innerHTML] = [selectedCell.innerHTML, clickedCell.innerHTML];
	CheckWinner();
	//console.log(selectedCell);
}

function CheckWinner(){
	winCon = [];
	let a = 0;
	for (var i = 0; i < winner.length; i++){
		if(winner[i] == "O"){
			a++;
			CheckNeighbour(convertIntToID[i]);
		}
	}

	if(winCon.length == 0 && a == 1){
		//console.log("You Win");
		statusDisplay.innerHTML = "You Win!";
		gameActive = false;

	}
	if(winCon.length == 0 && a > 1){
		//console.log("You Lose");
		statusDisplay.innerHTML = "You Lose :(";
		gameActive = false;
	}
	//console.log(a);
	//console.log(winCon.length);
}

function restartGame(){
	cellElements.forEach(cell => cell.remove());
	GenerateGrid();
	startGame();
	//console.log("restartGame");
}

function startGame(){
	cellElements = document.querySelectorAll('.cell');
	statusDisplay.innerHTML = "Play Your Move";
	winner = [];
	for (var i = 0; i < cellElements.length; i++){
		winner.push(cellElements[i].innerHTML);
	}
	//console.log(winner);
	document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));
	document.querySelector('.game-restart').addEventListener('click', restartGame);
}
