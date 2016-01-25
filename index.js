var _ = require('lodash'),
    util = require('./util.js'),
    SpotifyWebApi = require('spotify-web-api-node');

var pickInputs = {
        'user_id': { key: 'user_id', validate: { req: true } },
        'playlist_id': { key: 'playlist_id', validate: { req: true } }
    },
    pickOutputs = {
        'name': 'body.name',
        'description': 'body.description',
        'external_urls': 'body.external_urls.spotify',
        'collaborative': 'body.collaborative',
        'owner_id': 'body.owner.id',
        'tracks_href': 'body.tracks.href',
        'followers': 'body.followers'
    };

module.exports = {
    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spotifyApi = new SpotifyWebApi(),
            token = dexter.provider('spotify').credentials('access_token'),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        spotifyApi.setAccessToken(token);
        spotifyApi.getPlaylist(inputs.user_id, inputs.playlist_id)
            .then(function(data) {
                this.complete(util.pickOutputs(data, pickOutputs));
            }.bind(this), function(err) {
                this.fail(err);
            }.bind(this));
    }
};
