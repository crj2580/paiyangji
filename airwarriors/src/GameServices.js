function UpdateScore(actionid,score,callback) {
    $.ajax({
        url: "/action/updatescore",
        data: {
            actionId: actionid,
            score:score
        },
        success: function( data ) {
            if(data.status == "ok")
            {
                callback();
            }
        }
    });
}