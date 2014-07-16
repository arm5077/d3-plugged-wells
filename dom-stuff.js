$(window).load(function() {
	// Resizing
	$("#canvas").width( $(document).width() - $(".nav").outerWidth(true) );
	
});

$(document).ready(function() {
	
	$(document).on("click", "g.well", function(){
		$.getJSON("process.php?name=" + $(this).attr("id"), function(result){
		
			if( $(".wellInfoBox").hasClass("active"))
			{
					slideOutInfo()
					updateInfo(result);
					slideInInfo();
			}
			else {
				updateInfo(result);	
				slideInInfo();
			}
		});
		
	
	});
	
	$("#canvas").on("click", "g:not{.well}", function(){
		slideOutInfo();
	});
	
	$("#close").click( function(){ slideOutInfo() } );
	
	$(window).resize(resize);
	
	
	
});

function resize() {

	$(".introBox").css("margin-top", ( $(window).height() - $(".introBox").outerHeight() ) / 2);

	$("#canvas").width( $(document).width() - $(".nav").outerWidth(true) );
	
	//$(".wellInfoBox").height( $(window).height() - 575 );
	
	chart = d3.select("#canvas");
	w = $(chart.node()).width();
	h = $(chart.node()).height();
	
	eval(currentView);
}

function updateInfo(result) {
	
	$(".wellInfoBox h2").html("Permit No. " + result.name);
	$(".wellInfoBox h3").html("<div class='colorDot' style='background-color:" + colors[result.company] + "'></div>" + result.company);
	$(".wellInfoBox li#farm span").html(result.farm);
	$(".wellInfoBox li#town span").html(result.muni);
	$(".wellInfoBox li#county span").html(result.county);

}

function slideInInfo() {
	if( $(window).height() / $(".storyBox").height() <= 2 )
	{
		$(".storyBox").animate({
			"margin-top":($(window).height() / 2) - $(".storyBox").height() - 30
		},125);
	}
		
	$(".wellInfoBox").animate({
		bottom:"0"
	},125);
	
	$(".wellInfoBox").addClass("active");
}

function slideOutInfo() {
	$(".storyBox").animate({
		"margin-top":0
	},125);
	
	$(".wellInfoBox").animate({
		bottom:"-100%"
	}, 125, function(){
		$(".wellInfoBox").removeClass("active");
	});
}