function lirc_get_base() {
	return "http://" + location.hostname + ":5000/";
}
console.log("LIRC loading...");
$(document).ready(function () {
	console.log("Yay, document is ready!");
	var url = lirc_get_base();
	url += "api/0.1/devices";
	
	$.ajax({
		url: url,
		dataType: "json",
		success: function(data) {
			console.log(data);
			if (!data.success) {
				alert("Failed to load devices!");
				return;
			}
			
			var devdiv = $('<div/>');
			$.each(data.payload, function(k, dev) {
				$('<h5/>').text(dev.name).appendTo(devdiv);
				var cmds = $('<ul/>');
				$.each(dev.commands, function(k, cmd) {
					var link = $('<a/>').text(cmd.name);
					link.attr('href', lirc_get_base() + "api/0.1/exec/" + dev.id + "/" + cmd.cmd_id);
					link.on('click', function() {
						$.mobile.loading( 'show', {
							text: 'Befehl wird ausgeführt...',
							textVisible: true,
							theme: 'b'
						});
						
						$.ajax({

							url: $(this).attr('href'),
							complete: function() {
								$.mobile.loading('hide');
							},
							error: function() {
								alert("The command could not be executed!");
							}

						});

						return false;
					});
					link.wrap('<li/>').parent().appendTo(cmds);
				});
				cmds.appendTo(devdiv);
			});
			devdiv.appendTo('#lircdevices');
		}
	});
});
