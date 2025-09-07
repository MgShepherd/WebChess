// @ts-check

function pressButton() {
	console.log("The button has been pressed");
}

document.addEventListener('DOMContentLoaded', () => {
	const myButton = document.getElementById("testButton");
	if (myButton) {
		myButton.addEventListener('click', pressButton);
	}
});
