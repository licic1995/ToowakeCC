$('#btn-ask').click(function(){
  console.log('btn-ask')
  $('.mask').removeAttr('hidden');
});
$('#btn-que').click(function(){
  console.log('btn-que');
  $('.mask').prop('hidden', 'hidden');
});
