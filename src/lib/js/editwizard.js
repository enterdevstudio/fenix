// Wizard Controller
$('#editwizard > button').on('click',function(e){
	var id = $(e.currentTarget.parentNode).find('input[type="hidden"]').val();
	var s = ROUTER.getServer(id);
	var running = s.running, shared = s.shared, recapture = false;
	s.stop(function(){
		if (s.path !== $('#epath').val()){
			s.syslog.log('Path changed from '+s.path+' to '+$('#epath').val());
		}
		if (s.name !== $('#ename').val()){
			s.syslog.log('Name changed from '+s.name+' to '+$('#ename').val());
		}
		if (s.port !== parseInt($('#eport').val())){
			s.syslog.log('Path changed from '+s.port.toString()+' to '+$('#eport').val().toString());
		}
		s.path = $('#epath').val();
		s.port = $('#eport').val();
		s.name = $('#ename').val();
		
		var x = $('#'+id).find('div:nth-child(2) > div');
		x[0].innerHTML = s.name;
		x[0].setAttribute('data-hint','Open http://127.0.0.1:'+s.port.toString());
		x[1].innerHTML = s.port.toString();
		x[2].innerHTML = s.name;
		
		if (!require('fs').existsSync(s.path)){
			$('#'+id).addClass('unavailable');
		} else {
			if (running){
				s.start(function(){
					if (shared){
						s.share();
					}
					UI.notify({
						title: 'Server Modified',
						msg: s.name+' was modified and restarted. Now running on port '+s.port.toString()
					});
				});
			}
		}
		UI.editwizard.hide();
	});
});

$('#editwizard > a').on('click',function(e){
	e.preventDefault();
	UI.editwizard.hide();
});

$('#filebrowser2').on('click',function(e){
	e.preventDefault();
	UI.editwizard.browseFilepath();
});

document.querySelector('#choosefile2').addEventListener('change',function(evt){
	$('#epath').val(this.value);
	UI.editwizard.prepopulate();
},false);

$('#eport').on('keypress',function(evt){
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
	}
	return true;
});

var efn = function(){
	UI.editwizard.prepopulate();
};

var edelay = null;

$('#epath').on('keyup',function(e){
	clearTimeout(edelay);
	edelay = setTimeout(efn,900);
});

$('#editwizard > input').on('keyup',function(e){
	if (UI.editwizard.valid()){
		UI.editwizard.button.enable();
	} else {
		UI.editwizard.button.disable();
	}
});