const express = require("express");
const router = express.Router();
const axios = require("axios");
router.get("/songs", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    axios
        .get(
            "https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=" +
            req.query.query
        )
        .then((response) => {
            var response_data = response.data;
            let song_response = response_data["songs"]["data"];
            if (song_response.length == 0) {
                res.status(404).json("No search results found");
            }
            let promises = [];
            let songs = [];

            song_response.forEach((_song) => {
                promises.push(
                    axios
                    .get(
                        "https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=" +
                        _song.id
                    )
                    .then((response) => {
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

                        response.data[_song.id]["song"] = format(
                            response.data[_song.id]["song"]
                        );
                        response.data[_song.id]["music"] = format(
                            response.data[_song.id]["music"]
                        );
                        response.data[_song.id]["singers"] = format(
                            response.data[_song.id]["singers"]
                        );
                        response.data[_song.id]["starring"] = format(
                            response.data[_song.id]["starring"]
                        );
                        response.data[_song.id]["album"] = format(
                            response.data[_song.id]["album"]
                        );
                        response.data[_song.id]["primary_artists"] = format(
                            response.data[_song.id]["primary_artists"]
                        );
                        response.data[_song.id]["image"] = response.data[_song.id][
                            "image"
                        ].replace("150x150", "500x500");
                        let lyricPromises = [];
                        if (response.data[_song.id]["has_lyrics"]) {
                            response.data[_song.id]["lyrics"] = "Bhutum";
                        } else {
                            response.data[_song.id]["lyrics"] = "NA";
                        }
                        songs.push(response.data);
                    })
                );
            });
            Promise.all(promises).then(() => {
                res.status(200).json(songs);
            });
        })
        .catch((error) => {
            res.status(500).json("Error" + error);
        });
});

function format(data) {
    return data
        .replace("&quot;", "'")
        .replace("&amp;", "&")
        .replace("&#039;", "'");
}

module.exports = router;