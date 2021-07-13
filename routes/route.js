const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
router.get("/songs", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    let promises = [];
    let mainPromise = [];
    let lyricPromises = [];
    let songs = [];
    let lyricData = [];
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: "Supply a valid search term",
            diagnostics: "User Input Blank or Null or ambigious",
            error: 404,
        });
    }
    let l = req.query.lyrics;
    if (!isBoolean(l)) {
        l = false;
    }

    mainPromise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q)
        .then((response) => {
            var response_data = response.data;
            let song_response = response_data["songs"]["data"];
            if (song_response.length == 0) {
                res.status(404).json("No search results found");
            }
            song_response.forEach((_song) => {
                promises.push(
                    axios
                    .get(process.env.SONG_DETAILS_ENDPOINT + _song.id)
                    .then((response) => {
                        formatSongResponse(response, _song);
                        if (l === "true") {
                            lyricPromises.push(
                                axios
                                .get(process.env.LYRICS_DETAIL_ENDPOINT + _song.id)
                                .then((lyricResponse) => {
                                    formatLyricResponse(
                                        lyricResponse,
                                        lyricData,
                                        response,
                                        _song
                                    );
                                })
                            );
                        }
                        songs.push(response.data);
                    })
                );
            });
            promify(mainPromise, promises, lyricPromises, res, songs);
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: "Error occured.", diagnostics: error, error: 500 });
        })
    );
});
const isBoolean = (l) => {
    return Boolean(l) === false || Boolean(l) === true;
};

function promify(mainPromise, promises, lyricPromises, res, songs) {
    Promise.all(mainPromise).then(() => {
        Promise.all(promises).then(() => {
            Promise.all(lyricPromises).then(() => {
                res.status(200).json(songs);
            });
        });
    });
}

function formatLyricResponse(lyricResponse, lyricData, response, _song) {
    if (lyricResponse.data.lyrics !== undefined)
        lyricData.push(lyricResponse.data.lyrics);
    if (response.data[_song.id]["has_lyrics"] && lyricData !== undefined) {
        response.data[_song.id]["lyrics"] = lyricData;
    }
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

function format(data) {
    return data
        .replace("&quot;", "'")
        .replace("&amp;", "&")
        .replace("&#039;", "'");
}

module.exports = router;