/* domain of site. In this case, it is localhost since it is run locally...
   Obviously, the shorter the domain, the better.
*/
var domain = 'localhost:3000';

function url_handler() {
	var url = document.getElementById('url').value;
	var post_request = new XMLHttpRequest();
	if(url === "") return;
	post_request.open("POST", "/a", false);
	post_request.setRequestHeader("url", url);
	post_request.send();
	var short_code = post_request.responseText;
	var response = document.getElementById('response');
	response.innerHTML = 'new url: http://' + domain + '/s/' + short_code;
	response.style.display = 'block';
}

window.onload = function () {
	document.getElementById('btn').onclick = url_handler;
}
