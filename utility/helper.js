const isBoolean = (l) => {
    return Boolean(l) === false || Boolean(l) === true;
};

function formatLyricResponse(lyricResponse, lyricData, response, _song) {
    if (lyricResponse.data.lyrics !== undefined)
        lyricData.push(lyricResponse.data.lyrics);
    if (response.data[_song.id]["has_lyrics"] && lyricData !== undefined) {
        response.data[_song.id]["lyrics"] = lyricData;
    }
}

function formatLyricResponseForAlbumAndPlaylist(
    lyricResponse,
    lyricData,
    _song
) {
    if (lyricResponse.data.lyrics !== undefined)
        lyricData.push(lyricResponse.data.lyrics);
    if (_song["has_lyrics"] && lyricData !== undefined) {
        _song["lyrics"] = lyricData;
    }
}

function addQuotes(value) {
    var quotedlet = "'" + value + "'";
    return quotedlet;
}

function formatSongResponse(response, _song) {
    let mediaPrevURL = response.data[_song.id].media_preview_url;
    if (mediaPrevURL) {
        mediaPrevURL = mediaPrevURL.replace("preview", "aac");

        if (response.data[_song.id]["320kbps"]) {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_320.mp4");
        } else {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_160.mp4");
        }
        response.data[_song.id].media_url = mediaPrevURL;
    }
    response.data[_song.id]["song"] = format(response.data[_song.id]["song"]);
    response.data[_song.id]["music"] = format(response.data[_song.id]["music"]);
    response.data[_song.id]["singers"] = format(
        response.data[_song.id]["singers"]
    );
    response.data[_song.id]["starring"] = format(
        response.data[_song.id]["starring"]
    );
    response.data[_song.id]["album"] = format(response.data[_song.id]["album"]);
    response.data[_song.id]["primary_artists"] = format(
        response.data[_song.id]["primary_artists"]
    );
    response.data[_song.id]["image"] = response.data[_song.id]["image"].replace(
        "150x150",
        "500x500"
    );
}

function formatSongResponseForAlbumAndPlaylist(_song) {
    let mediaPrevURL = _song.media_preview_url;
    if (mediaPrevURL) {
        mediaPrevURL = mediaPrevURL.replace("preview", "aac");

        if (_song["320kbps"]) {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_320.mp4");
        } else {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_160.mp4");
        }
        _song.media_url = mediaPrevURL;
    }
    _song["song"] = format(_song["song"]);
    _song["music"] = format(_song["music"]);
    _song["singers"] = format(_song["singers"]);
    _song["starring"] = format(_song["starring"]);
    _song["album"] = format(_song["album"]);
    _song["primary_artists"] = format(_song["primary_artists"]);
    _song["image"] = _song["image"].replace("150x150", "500x500");
}

function formatImageForPlaylistAndAlbum(response) {
    response.forEach((_obj) => {
        _obj["image"] = _obj["image"].replace("50x50", "250x250");
    });
}

function format(data) {
    return data
        .replace("&quot;", "'")
        .replace("&amp;", "&")
        .replace("&#039;", "'");
}

module.exports = {
    format,
    formatSongResponseForAlbumAndPlaylist,
    formatSongResponse,
    formatLyricResponseForAlbumAndPlaylist,
    formatLyricResponse,
    formatImageForPlaylistAndAlbum,
    isBoolean,
};