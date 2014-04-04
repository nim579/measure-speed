$(function(){
	var measure = null;
	var $table = $('.jsListResult')
	var measureDone = function(results){
		console.log(results)
		$('.jsResult').text(results.average.mbs.toFixed(2));
		$('.jsResultMbps').text(results.average.mbps.toFixed(2));
		setTimeout(function(){
			$('.jsMeasure').button('reset');
			$('.jsProgressForm').fadeOut();
			$('.jsResultForm').removeClass('alert-warning').addClass('alert-success');

			$table.empty();
			for(var i = 0; i < results.speed.length; i++){
				$table.append("<tr><td>"+(i+1)+"</td><td>"+results.speed[i].mbs+"</td><td>"+results.speed[i].mbps+"</td></tr>")
			}
		}, 1000);
	}
	var measureProcess = function(results){
		$('.jsResultMb').text(results.average.mbs.toFixed(2));
		$('.jsResultMbps').text(results.average.mbps.toFixed(2));
		$('.jsProgress').css('width', results.attemptsPercent*100 + '%');

		$('.jsListResult').append("<tr><td>"+results.attempts+"</td><td>"+results.speed.mbs+"</td><td>"+results.speed.mbps+"</td></tr>")

	}
	$('.jsMeasure').bind('click', function(){
		$('.jsProgressForm').html("<div class=\"progress progress-striped active\"><div class=\"progress-bar progress-bar-success jsProgress\" role=\"progressbar\" style=\"width: 0;\"></div></div>").fadeIn();
		$('.jsResultForm').addClass('alert-warning').fadeIn();
		$('.jsProgress').css('width', 0);
		$('.jsShowListResult').fadeIn();
		$table.empty();
		$(this).button('loading');
		var measure = new measureSpeed(measureDone, measureProcess);
	});
	$('.jsShowListResult').bind('click', function(){
		$('.jsListResultTable').fadeToggle().addClass('mVisible');
		buttonText = $(this).data('toggleText');
		$(this).data('toggleText', $(this).html());
		$(this).html(buttonText);
	});
});