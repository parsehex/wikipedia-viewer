var url = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
var pageUrl = 'https://en.wikipedia.org/?curid=';
function search() {
	var searchVal = $('#textbox').val();
	if(searchVal === '') {
		$('#group').addClass('has-error');
		$('#message').text('Enter something to search for');
		return;
	}
	$('#group').removeClass('has-error');
	$('#message').text('');
	$.ajax({
		url: url + encodeURI(searchVal),
		type: 'GET',
		dataType: 'JSONP',
		success: function(data) {
			listResults(data.query.pages);
		}
	});
}

function listResults(pages) {
	$('#results').empty();
	$('#group').parent().addClass('col-lg-4');
	$('#results').addClass('col-lg-8');
	$.each(pages, function(id, page) {
		var imgHigherRes = page.thumbnail ? page.thumbnail.source.replace(/\d+px/, '150px') : '';
		$('#results')[0].appendChild(generateResult(
			imgHigherRes,
			page.title,
			page.extract,
			pageUrl + page.pageid
		));
	});
}

function generateResult(imgUrl, title, extract, link) {
	var li = document.createElement('li');

	var anchor = document.createElement('a');
	anchor.href = link;
	anchor.target = '_blank';

	var row = document.createElement('div');
	row.classList.add('row');

	var imgContainer = document.createElement('div');
	imgContainer.classList.add('col-xs-2');
	// imgContainer.classList.add('col-lg-1');
	imgContainer.classList.add('imgContainer');

	if(img !== '') {
		var img = document.createElement('img');
		img.src = imgUrl;
	}

	var content = document.createElement('div');
	content.classList.add('col-xs-10');
	// content.classList.add('col-lg-11');

	var heading = document.createElement('h4');
	var headingText = document.createTextNode(title);

	var description = document.createElement('p');
	var descriptionText = document.createTextNode(extract);

	description.appendChild(descriptionText);
	heading.appendChild(headingText);
	content.appendChild(heading);
	content.appendChild(description);

	if(img !== '') {
		imgContainer.appendChild(img);
	}

	row.appendChild(imgContainer);
	row.appendChild(content);

	anchor.appendChild(row);

	li.appendChild(anchor);

	return li;
}

$(document).ready(function() {
	$('#searchbtn').on('click', search);
	$("#textbox").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#searchbtn").click();
	    }
	});
});
