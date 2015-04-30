
// global variables for audio.
window.record = false;

function postAudio() {
  if (recorder){
      // read audio data and send to server
      recorder.exportWAV(function(blob) {
        var reader = new FileReader();
        reader.onload = function(evt){
            window.socket.emit("user_post",
                                {
                                    data: evt.target.result,
                                    type: "audio",
                                    longitude: window.longitude,
                                    latitude: window.latitude,
                                    lon_region: calculateRegion(window.longitude),
                                    lat_region: calculateRegion(window.latitude)

                                });
        };
        reader.readAsDataURL(blob);
      });

  }
}
// check record
$("#audio_record_btn").mousedown(function(evt){
    if (window.record === false){
        // begin record
        console.log("Begin to record");
        $("#audio_page_info").text("Click again to finish recording");
        window.record = true;

        if(recorder)
            recorder.record(); // record
    }
    else{
        // done record;
        console.log("Done recording");
        $("#audio_page_info").text("Click to record");
        window.record = false;

        if(recorder)
            recorder.stop(); // stop record

        postAudio(); // post audio to server

        recorder.clear();

        $("#audio_page").hide();
    }
});

// close audio page
$("#close_audio_page").click(function(){
    $("#audio_page").hide();
});
