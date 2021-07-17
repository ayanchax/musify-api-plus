const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const helper = require("../utility/helper");
const messages = require("../utility/messages");
const axiosConfig = require("./config");
dotenv.config();

// Get Songs Detail by Query
router.get("/songs", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let promises = [];
    let mainPromise = [];
    let lyricPromises = [];
    let songs = [];
    let lyricData = [];
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    let l = req.query.lyrics;
    if (!helper.isBoolean(l)) {
        l = false;
    }

    mainPromise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var response_data = response.data;
            let song_response = response_data["songs"]["data"];
            if (song_response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            song_response.forEach((_song) => {
                promises.push(
                    axios
                    .get(process.env.SONG_DETAILS_ENDPOINT + _song.id, axiosConfig)
                    .then((response) => {
                        helper.formatSongResponse(response, _song);
                        if (l === "true") {
                            lyricPromises.push(
                                axios
                                .get(
                                    process.env.LYRICS_DETAIL_ENDPOINT + _song.id,
                                    axiosConfig
                                )
                                .then((lyricResponse) => {
                                    helper.formatLyricResponse(
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
            Promise.all(mainPromise).then(() => {
                Promise.all(promises).then(() => {
                    Promise.all(lyricPromises).then(() => {
                        res.status(200).json(songs);
                    });
                });
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: messages.ERROR, diagnostics: error, error: 500 });
        })
    );
});

// Get Playlists Details
router.get("/playlists", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let playlists = {};
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    mainPromise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var response_data = response.data;
            let playlist_response = response_data["playlists"]["data"];
            if (playlist_response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            helper.formatImageForPlaylistAndAlbum(playlist_response);
            playlists = playlist_response;
            Promise.all(mainPromise).then(() => {
                res.status(200).json(playlists);
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: messages.ERROR, diagnostics: error, error: 500 });
        })
    );
});

// get albums details
router.get("/albums", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let albums = {};
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    mainPromise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var response_data = response.data;
            let album_response = response_data["playlists"]["data"];
            if (album_response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            helper.formatImageForPlaylistAndAlbum(album_response);
            albums = album_response;
            Promise.all(mainPromise).then(() => {
                res.status(200).json(albums);
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: messages.ERROR, diagnostics: error, error: 500 });
        })
    );
});

// get artists Details
router.get("/artists", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let artists = {};
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    mainPromise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var response_data = response.data;
            let artist_Response = response_data["artists"]["data"];
            if (artist_Response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            helper.formatImageForPlaylistAndAlbum(artist_Response);
            artists = artist_Response;
            Promise.all(mainPromise).then(() => {
                res.status(200).json(artists);
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: messages.ERROR, diagnostics: error, error: 500 });
        })
    );
});

// Get Song by song identifier.
router.get("/song", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let lyricPromises = [];
    let song = {};
    let lyricData = [];
    const q = req.query.songid;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    let l = req.query.lyrics;
    if (!helper.isBoolean(l)) {
        l = false;
    }
    mainPromise.push(
        axios
        .get(process.env.SONG_DETAILS_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var song_response = response.data;
            if (song_response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }

            var _song = song_response[q];
            helper.formatSongResponse(response, _song);
            if (l === "true") {
                lyricPromises.push(
                    axios
                    .get(process.env.LYRICS_DETAIL_ENDPOINT + _song.id, axiosConfig)
                    .then((lyricResponse) => {
                        helper.formatLyricResponse(
                            lyricResponse,
                            lyricData,
                            response,
                            _song
                        );
                    })
                );
            }
            song = response.data[q];
            Promise.all(mainPromise).then(() => {
                Promise.all(lyricPromises).then(() => {
                    res.status(200).json(song);
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: messages.ERROR,
                diagnostics: err,
                error: 500,
            });
        })
    );
});

// get album by album identifier
router.get("/album", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let lyricPromises = [];
    let album = {};
    let lyricData = [];
    const q = req.query.albumid;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    let l = req.query.lyrics;
    if (!helper.isBoolean(l)) {
        l = false;
    }

    mainPromise.push(
        axios
        .get(process.env.ALBUM_DETAILS_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var album_Response = response.data;
            if (album_Response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }

            var songs = album_Response.songs;

            songs.forEach((_song) => {
                helper.formatSongResponseForAlbumAndPlaylist(_song);
                if (l === "true") {
                    lyricPromises.push(
                        axios
                        .get(process.env.LYRICS_DETAIL_ENDPOINT + _song.id, axiosConfig)
                        .then((lyricResponse) => {
                            helper.formatLyricResponseForAlbumAndPlaylist(
                                lyricResponse,
                                lyricData,
                                _song
                            );
                        })
                    );
                }
            });
            album = response.data;
            Promise.all(mainPromise).then(() => {
                Promise.all(lyricPromises).then(() => {
                    res.status(200).json(album);
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: messages.ERROR,
                diagnostics: err,
                error: 500,
            });
        })
    );
});

//get playlist by playlist identifier
router.get("/playlist", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let lyricPromises = [];
    let lyricData = [];
    let playlist = {};
    const q = req.query.pid;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    let l = req.query.lyrics;
    if (!helper.isBoolean(l)) {
        l = false;
    }
    mainPromise.push(
        axios
        .get(process.env.PLAYLIST_DETAILS_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var playlist_Response = response.data;
            if (playlist_Response.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }

            var songs = playlist_Response.songs;

            songs.forEach((_song) => {
                helper.formatSongResponseForAlbumAndPlaylist(_song);
                if (l === "true") {
                    lyricPromises.push(
                        axios
                        .get(process.env.LYRICS_DETAIL_ENDPOINT + _song.id, axiosConfig)
                        .then((lyricResponse) => {
                            helper.formatLyricResponseForAlbumAndPlaylist(
                                lyricResponse,
                                lyricData,
                                _song
                            );
                        })
                    );
                }
            });

            playlist = response.data;

            Promise.all(mainPromise).then(() => {
                Promise.all(lyricPromises).then(() => {
                    res.status(200).json(playlist);
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: messages.ERROR,
                diagnostics: err,
                error: 500,
            });
        })
    );
});

// get lyrics by song identifier
router.get("/lyrics", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let mainPromise = [];
    let lyrics = {};
    const q = req.query.songid;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    mainPromise.push(
        axios
        .get(process.env.LYRICS_DETAIL_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var lyricResponse = response.data;
            if (lyricResponse.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            lyrics = lyricResponse;
            Promise.all(mainPromise).then(() => {
                res.status(200).json(lyrics);
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: messages.ERROR,
                diagnostics: err,
                error: 500,
            });
        })
    );
});

// search by query - universal result
router.get("/search", (req, res, next) => {
    axiosConfig.setResponseHeader(res);
    let promise = [];
    const q = req.query.query;
    if (q == null || q === "" || q === undefined) {
        res.status(404).json({
            msg: messages.SUPPLY_VALID_IDENTIFIER,
            diagnostics: messages.AMBIGIOUS,
            error: 404,
        });
    }
    promise.push(
        axios
        .get(process.env.SONG_ENDPOINT + q, axiosConfig)
        .then((response) => {
            var response_data = response.data;
            if (response_data.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            Promise.all(promise).then(() => {
                let _data = [];
                let albums = response_data["albums"]["data"];
                let songs = response_data["songs"]["data"];
                let playlists = response_data["playlists"]["data"];
                let artists = response_data["artists"]["data"];
                let topResult = response_data["topquery"]["data"];
                _data.push({
                    songs,
                    albums,
                    playlists,
                    artists,
                    topResult,
                });
                console.log(_data);
                res.status(200).json(_data);
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ msg: messages.ERROR, diagnostics: error, error: 500 });
        })
    );
});

module.exports = router;