$('#button1').click(function(){
  console.log('button1 click');
  var newDiv = $(document.createElement("div"));
  newDiv.html('<img src="images/bg.png" alt="" />'+
    '<input type="text" name="text" value="">');
  newDiv.css({
    'background-color':'rgba(0,0,0,0.1)',
    'position':'absolute',
    'width':'100%',
    'height':'100%'
  });
  $("#main").append(newDiv);
});
