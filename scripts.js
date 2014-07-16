
$(window).load(function(){

	//size screen sections
	resize();
	
		
	
	// Load total data, plugged data and Pennsylvania shapefile
	
	d3.csv("total_wells.csv", type, function(error, total_wells) {
		d3.csv("data.csv", type, function(error, data) {
			d3.json("min.pennsylvania.json", function(error, json) {
				
				$("#go").click(function(){
					
					$("#go").parent().animate({
						"margin-top":(-1 * $(".intro").height())
					}, 500, function(){ 
						makeHexMap(json, total_wells);
						$(".intro").remove(); 
					});	
					
					
					
				});
				
				$("ul.storyline li").click(function(){
					if( ! $(this).hasClass(".active"))
					{
						$("ul.storyline li").removeClass("active");
						$(this).next("li").removeClass("hidden	");
						$(this).find("h3").html($(this).find("h3").attr("text"));
						$(this).addClass("active");
					}
					switch($(this).attr("id"))
					{
						case "step1":
							slideOutInfo();
							cleanUp();
							makeHexMap(json, total_wells);
							currentView="makeHexMap(json, total_wells)";
						break;
						
						case "step2":
							slideOutInfo();
							cleanUp();
							makeMap(json, data, false);
							currentView="makeMap(json, data, false)";
						break;
						
						case "step3":
							slideOutInfo();
							cleanUp();
							makeCluster(data);
							currentView="makeCluster(data)";
						break;
						
						case "step4":
							slideOutInfo();
							cleanUp();
							makeTimeChart(data);
							currentView="makeTimeChart(data);";
						break;
						
						case "step5":
							slideOutInfo();
							cleanUp();
							makeTimeChart(data, false, true, false);
							currentView="makeTimeChart(data, false, true, false)";
						break;
						
						case "step6":
							slideOutInfo();
							cleanUp();
							makeTimeChart(data, false, false, true);
							currentView="makeTimeChart(data, false, false, true);";
						break;
						
						case "step7":
							slideOutInfo();
							cleanUp();
							makeMap(json, data, true);
							currentView="makeMap(json, data, true)";
						break;
					}
				});
				
				//test bullshit
				$("a").click(function(){
					cleanUp();
					switch($(this).attr("id")) {
						case "map": makeHexMap(json, total_wells); break;
						case "companies": makeCluster(data); break;
						case "timeline": makeTimeChart(data); break;
						case "act13": makeAct13(data); break;
					}
				});
				
				makeCompanyColors(data);
				
			});
		});
	});

});

