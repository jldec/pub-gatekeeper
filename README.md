# pub-gatekeeper

**pub-gatekeeper** is a node express server for mediating access to [pub-server](https://github.com/jldec/pub-server) generated sites.

This makes it possible to edit and publish directly from the browser, without depending on another server to save files and generate the site.

Think of it as a github pages [editor](https://github.com/jldec/pub-pkg-editor) and [generator](https://github.com/jldec/pub-generator) running inside your browser.

### courtesy server
A shared instance of this server is hosted at `https://gatekeeper.pubblz.com/`.

Since this server handles oauth access tokens, some users may prefer to deploy their own private instance for additional security.

### oauth scope
*repo* scope is required for read-write access to a specific github repo.

The server also asks for *user:email* scope so that github identities can be used for role-based authorization with ACLs. Currently all authenticated users have admin rights in the editor.

Details of the oauth2 web flow, are documented in  [pub-pkg-github-oauth](https://github.com/jldec/pub-pkg-github-oauth).


### configuration
To run this server yourself `git clone` and then `npm install`

Register a new github developer application [here](https://github.com/settings/applications/new).

Make sure that you provide a redirect url of the form:
```
https://{your-server-name}/server/auth/github/callback
```
Export the following environment variables before starting the server.

```sh
export GHID={github client ID}
export GHCD={github client secret}
```

Additional setting such as the github timeout can be configured via `pub-gatekeeper-config.js`.

The server is started with the usual `node server` command in the project folder.

Alternatively `npm install -g pub-gatekeeper` and then start the server from any folder using the `pub-gatekeeper` command.
