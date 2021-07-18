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

function formatSOngResponseOnSearch(response, id) {
    let mediaPrevURL = response.data[id].media_preview_url;
    if (mediaPrevURL) {
        mediaPrevURL = mediaPrevURL.replace("preview", "aac");

        if (response.data[id]["320kbps"]) {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_320.mp4");
        } else {
            mediaPrevURL = mediaPrevURL.replace("_96_p.mp4", "_160.mp4");
        }
        response.data[id].media_url = mediaPrevURL;
    }
    response.data[id]["song"] = format(response.data[id]["song"]);
    response.data[id]["music"] = format(response.data[id]["music"]);
    response.data[id]["singers"] = format(response.data[id]["singers"]);
    response.data[id]["starring"] = format(response.data[id]["starring"]);
    response.data[id]["album"] = format(response.data[id]["album"]);
    response.data[id]["primary_artists"] = format(
        response.data[id]["primary_artists"]
    );
    response.data[id]["image"] = response.data[id]["image"].replace(
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

const randomKeyWord = (keyword) => {
    if (keyword[Math.floor(Math.random() * keyword.length)] === undefined) {
        return keyword[0];
    }
    return keyword[Math.floor(Math.random() * keyword.length)];
};
const noImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLG67OCTdsrpf_nDsSC03j5j2x7pSK7XOogQ&usqp=CAU";

const splitData = (str, delim) => {
    try {
        let _array = str.split(delim);
        let _returningArray = [];
        _array.forEach((obj) => {
            _returningArray.push({ name: obj });
        });
        return _returningArray;
    } catch (error) {
        _array.push({ name: str });
        return _array;
    }
};

const getRelatedArtists = (artistsMap) => {
    let modified_top_artist_array = splitData(randomKeyWord(artistsMap), ",");

    let found = false;
    const data = require("../routes/data");
    modified_top_artist_array.forEach((modified_Artist, _mindex) => {
        data.artists[0].INDIAN.forEach((artist, index) => {
            if (artist.name.trim() === modified_Artist.name.trim()) {
                modified_top_artist_array[_mindex] = {
                    name: modified_Artist.name.trim(),
                    image: artist.url,
                    type: artist.type,
                };
                found = true;
            }
        });
    });
    if (!found) {
        modified_top_artist_array.forEach((modified_Artist, _mindex) => {
            data.artists[1].WESTERN.forEach((artist) => {
                if (artist.name.trim() === modified_Artist.name.trim()) {
                    modified_top_artist_array[_mindex] = {
                        name: modified_Artist.name.trim(),
                        image: artist.url,
                        type: artist.type,
                    };
                    found = true;
                }
            });
        });
    }

    modified_top_artist_array.forEach((modified_Artist, _mindex) => {
        if (modified_Artist.image === undefined) {
            modified_top_artist_array[_mindex] = {
                name: modified_Artist.name,
                image: noImage,
                type: "Unavailable",
            };
        }
    });
    return modified_top_artist_array;
};
module.exports = {
    format,
    formatSongResponseForAlbumAndPlaylist,
    formatSongResponse,
    formatSOngResponseOnSearch,
    formatLyricResponseForAlbumAndPlaylist,
    formatLyricResponse,
    formatImageForPlaylistAndAlbum,
    isBoolean,
    randomKeyWord,
    noImage,
    splitData,
    getRelatedArtists,
};