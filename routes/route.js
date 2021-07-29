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
                        lyricPromises.push(
                            helper
                            .formatSongResponse_V2(
                                response,
                                l,
                                _song.id,
                                lyricData,
                                axios,
                                axiosConfig
                            )
                            .then((_rs) => {
                                songs.push(_rs.data.songs[0]);
                            })
                        );
                    })
                    .catch((error) => {
                        res.status(500).json({
                            msg: messages.ERROR,
                            diagnostics: error,
                            error: 500,
                        });
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
            console.log(error);
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
            let album_response = response_data["albums"]["data"];
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

            var _song = song_response.songs[0];

            lyricPromises.push(
                helper
                .formatSongResponse_V2(
                    response,
                    l,
                    _song.id,
                    lyricData,
                    axios,
                    axiosConfig
                )
                .then((_rs) => {
                    song = _rs.data.songs[0];
                })
            );
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
    let promises = [];
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

            var songs = album_Response.list;
            var _songs = [];
            var totalDurationOfSongs = 0;
            songs.forEach((_song) => {
                totalDurationOfSongs =
                    parseInt(totalDurationOfSongs) + parseInt(_song.more_info.duration);
                promises.push(
                    axios
                    .get(process.env.SONG_DETAILS_ENDPOINT + _song.id, axiosConfig)
                    .then((response) => {
                        lyricPromises.push(
                            helper
                            .formatSongResponse_V2(
                                response,
                                l,
                                _song.id,
                                lyricData,
                                axios,
                                axiosConfig
                            )
                            .then((_rs) => {
                                _songs.push(_rs.data.songs[0]);
                            })
                        );
                    })
                );
            });
            response.data.list = {};
            response.data.list = _songs;
            album = response.data;
            album["totalDurationOfSongs"] = totalDurationOfSongs;
            Promise.all(mainPromise).then(() => {
                Promise.all(promises).then(() => {
                    Promise.all(lyricPromises).then(() => {
                        res.status(200).json(album);
                    });
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
    let promises = [];
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
                return;
            }

            if (
                playlist_Response.list === undefined ||
                playlist_Response.list === "undefined" ||
                playlist_Response.list === ""
            ) {
                res.status(200).json(playlist_Response);
                return;
            }
            var songs = playlist_Response.list;

            var _songs = [];
            var totalDurationOfSongs = 0;
            songs.forEach((_song) => {
                totalDurationOfSongs =
                    parseInt(totalDurationOfSongs) + parseInt(_song.more_info.duration);
                promises.push(
                    axios
                    .get(process.env.SONG_DETAILS_ENDPOINT + _song.id, axiosConfig)
                    .then((response) => {
                        lyricPromises.push(
                            helper
                            .formatSongResponse_V2(
                                response,
                                l,
                                _song.id,
                                lyricData,
                                axios,
                                axiosConfig
                            )
                            .then((_rs) => {
                                _songs.push(_rs.data.songs[0]);
                            })
                        );
                    })
                );
            });

            response.data.list = {};
            response.data.list = _songs;
            playlist = response.data;
            playlist["totalDurationOfSongs"] = totalDurationOfSongs;
            Promise.all(mainPromise).then(() => {
                Promise.all(promises).then(() => {
                    Promise.all(lyricPromises).then(() => {
                        res.status(200).json(playlist);
                    });
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: messages.ERROR,
                diagnostics: err.message,
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
    let mainPromise = [];
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
            if (response_data.length == 0) {
                res.status(404).json(messages.NO_SEARCH_RESULTS);
            }
            let _data = {};
            let songs = response_data["songs"]["data"];
            let albums = response_data["albums"]["data"];
            let playlists = response_data["playlists"]["data"];
            let artists = response_data["artists"]["data"];
            let topQuery = response_data["topquery"]["data"];
            let shows = response_data["shows"]["data"];
            let episodes = response_data["episodes"]["data"];
            Promise.all(mainPromise).then(() => {
                _data = {
                    songs: songs,
                    playlists: playlists,
                    albums: albums,
                    artists: artists,
                    topQuery: topQuery,
                    shows: shows,
                    episodes: episodes,
                };

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

// get artists, bands, regional section boiler plate data
router.get("/boilerplate", (req, res, next) => {
    const data = require("./data");
    let response = [];
    response.push({
        artists: data.artists,
        bands: data.bands,
        regional: data.regionalSection,
    });
    res.status(200).json(response);
});

router.get("/checkout", (req, res, next) => {
    axios
        .get(
            "https://www.jiosaavn.com/api.php?__call=playlist.getDetails&api_version=4&_format=json&_marker=0&ctx=web6dot0&listid=84576174"
        )
        .then((response) => {
            // console.log(response);
            res.status(200).json(response.data);
        });
});

router.get("/share/media/", (req, res) => {
    const path = require("path");
    const pathToIndex = path
        .join(__dirname, "public/index.html")
        .replace("routes\\", "");
    const fs = require("fs");
    let dataRead = false;
    const raw = fs.readFileSync(
        pathToIndex, { encoding: "utf8", flag: "r" },
        (err, data) => {
            if (data) {
                dataRead = true;
            }
        }
    );
    let _currentUrl =
        req.query.url !== undefined ?
        req.query.url :
        "https://musify-7ba7c.web.app/";
    const _title =
        req.query.title !== undefined ?
        req.query.title.replace(/ /g, ".") :
        "Musify - Enjoy Ad Free Premium Content Music";
    const _image =
        req.query.imageSrc !== undefined ?
        req.query.imageSrc :
        "https://musify-7ba7c.web.app/static/media/logo.6714a076.png";
    const _description =
        req.query.description !== undefined ?
        req.query.description.replace(/ /g, ".") :
        "Tired of listening to ads and premium subscriptions while streaming music? Well you might like my new music streaming app #musify in this case. " +
        "Pls visit https://musify-7ba7c.web.app/ for fresh music content ad free. You just need to sign in using your google credentials and enjoy high quality(320, 640, 1080kbps) ad free music. " +
        "The mobile app for this is coming soon as well.";
    const _hashtag =
        req.query.hashtag !== undefined ? req.query.hashtag : "#musify";
    const meta = `<meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="csrf_token" content="" />
    <meta property="type" content="website" />
    <meta property="url" content=${_currentUrl} />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="_token" content="" />
    <meta name="robots" content="noodp" />
    <meta property="title" content=${_title} />
    <meta name="description" content=${_description} />
    <meta property="image" content=${_image} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content=${_title} />
    <meta property="og:hashtag" content=${_hashtag} />
    <meta property="og:image" content=${_image} />
    <meta content="image/*" property="og:image:type" />
    <meta property="og:url" content=${_currentUrl} />
    <meta property="og:site_name" content="Musify" />
    <meta property="og:description" content=${_description} />
    <title>${req.query.title}</title>`;
    const updated = raw.replace("__PAGE_META__", meta);
    res.send(updated);
});

module.exports = router;