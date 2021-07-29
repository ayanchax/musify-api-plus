const isBoolean = (l) => {
    return Boolean(l) === false || Boolean(l) === true;
};

function formatLyricResponse_V2(lyricResponse, lyricData, response) {
    if (lyricResponse.data !== undefined) lyricData.push(lyricResponse.data);
    if (response.data.songs[0].more_info.has_lyrics && lyricData !== undefined) {
        response.data.songs[0].lyrics = lyricData;
    }
}

function addQuotes(value) {
    var quotedlet = "'" + value + "'";
    return quotedlet;
}

function formatSongResponse_V2(response, l, id, lyricData, axios, axiosConfig) {
    return new Promise(function(resolve, reject) {
        let mediaEncryptedURL =
            response.data.songs[0].more_info.encrypted_media_url;
        if (mediaEncryptedURL) {
            decrypt(mediaEncryptedURL)
                .then((res) => {
                    formatResult(response, res, l, axios, id, axiosConfig, lyricData)
                        .then((_res) => {
                            resolve(_res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((error) => {
                    response.data.songs[0].error = error;
                    resolve(response);
                });
        }
    });
}

function formatResult(response, res, l, axios, id, axiosConfig, lyricData) {
    return new Promise(function(resolve, reject) {
        try {
            if (l === "true") {
                axios
                    .get(process.env.LYRICS_DETAIL_ENDPOINT + id, axiosConfig)
                    .then((lyricResponse) => {
                        formatLyricResponse_V2(lyricResponse, lyricData, response);
                        response.data.songs[0]["image"] = response.data.songs[0][
                            "image"
                        ].replace("150x150", "500x500");
                        response.data.songs[0].more_info.decrypted_media_url = res.replace(
                            /[\n\r]/g,
                            ""
                        );
                        var _primary_artist_labels = [];

                        try {
                            response.data.songs[0].more_info.artistMap.primary_artists.forEach(
                                (_pa) => {
                                    _primary_artist_labels.push(_pa.name);
                                }
                            );
                        } catch (error) {}

                        response.data.songs[0].more_info.primary_artists_label =
                            _primary_artist_labels.toString();
                        resolve(response);
                    });
            } else {
                response.data.songs[0]["image"] = response.data.songs[0][
                    "image"
                ].replace("150x150", "500x500");
                response.data.songs[0].more_info.decrypted_media_url = res.replace(
                    /[\n\r]/g,
                    ""
                );
                var _primary_artist_labels = [];

                try {
                    response.data.songs[0].more_info.artistMap.primary_artists.forEach(
                        (_pa) => {
                            _primary_artist_labels.push(_pa.name);
                        }
                    );
                } catch (error) {}

                response.data.songs[0].more_info.primary_artists_label =
                    _primary_artist_labels.toString();
                resolve(response);
            }
        } catch (error) {
            reject(response);
        }
    });
}

function formatImageForPlaylistAndAlbum(response) {
    response.forEach((_obj) => {
        _obj["image"] = _obj["image"].replace("150x150", "250x250");
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

function cleanWarning(error) {
    return error.replace(
        /Detector is not able to detect the language reliably.\n/g,
        ""
    );
}

const decrypt = (url) => {
    return new Promise(function(resolve, reject) {
        const spawn = require("child_process").spawn;
        const dotenv = require("dotenv");
        dotenv.config();

        const python = spawn(process.env === "prod" ? "python3" : "python", [
            "python/decrypt.py",
            url,
        ]);
        let result = "";
        let resultError = "";
        python.stdout.on("data", (data) => {
            result += data.toString();
        });

        python.stderr.on("data", (data) => {
            resultError = cleanWarning(data.toString());
        });

        python.stdout.on("end", function() {
            if (resultError == "") {
                resolve(result);
            } else {
                console.error(
                    `Python error, you can reproduce the error with: \n${python} python/decrypt.py}`
                );
                const error = new Error(resultError);
                reject(resultError);
            }
        });
    });
};

module.exports = {
    format,
    formatSongResponse_V2,
    formatLyricResponse_V2,
    formatImageForPlaylistAndAlbum,
    isBoolean,
    decrypt,
};