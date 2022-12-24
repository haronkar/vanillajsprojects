const t = gsap.timeline({defaults: {ease: 'power1.out'}});
const t2 = gsap.timeline({paused: true, reversed: true});

const slides = document.querySelectorAll(".slide");
const pages = document.querySelectorAll(".page");
const navlinks = document.querySelectorAll(".navlink");
const logo = document.querySelector(".logo");
const menu = document.querySelector(".menu");
const navOpen = document.querySelector(".nav-open");
const menuHide = document.querySelector(".menuHide");
const menuLinks = document.querySelectorAll(".menuLink");
const dotText = document.querySelectorAll(".dotText");

slides.forEach((slide, index) => {
	slide.addEventListener("click", function(){
		changeDots(index);
		nextPage(index);
	});
	slide.addEventListener("mouseenter", function(){
		showText(index, 1);
	});
	slide.addEventListener("mouseleave", function(){
		showText(index, 0);
	});
});

navlinks.forEach((link, index) => {
	link.addEventListener('click', function(){
		changeDots(index);
		nextPage(index);
	});
});

logo.addEventListener("click", function(){
		changeDots(0);
		nextPage(0);
	});

menuLinks.forEach((link, index) => {
	link.addEventListener('click', function(){
		menuAnim();
		changeDots(index);
		nextPage(index);
	});
});
function changeDots(index){

	slides.forEach(slide => {
		slide.classList.remove("active");
	});
	slides[index].classList.add("active");
}

let currentIndex = 0;
function nextPage(nextIndex){
	if(nextIndex == currentIndex)return;

	const next = pages[nextIndex];
	const current = pages[currentIndex];

	if(nextIndex > currentIndex){
		t.fromTo(current, {y: "0%"}, { y: "-120%", duration: 0.5});
		t.fromTo(next, {y:"120%"}, { y: "0%", duration: 0.5, delay: -0.5});
	}
	else{
		t.fromTo(current, {y:"0%"}, { y: "120%", duration: 0.5});
		t.fromTo(next, {y:"-120%"}, { y: "0%", duration: 0.5, delay: -0.5});
	}
	currentIndex = nextIndex;
}

function showText(index, value){
	gsap.to(dotText[index], {opacity: value, duration: 0.3})
}

t2.to(menuHide, {zIndex: 1, duration: 0});
t2.to(navOpen, {y:0, duration: 0.5});

menu.addEventListener('click', menuAnim);

function menuAnim(){
	t2.reversed() ? t2.play() : t2.reverse();
}
