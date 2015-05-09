#!/bin/sh

set -e

# FIXME: should be done by salt
sudo npm install bower -g

cd "${HOME}/hakyll"
cabal install

cd "${HOME}/content"
# Bower gets irritated if the git repo isn't available
rm -rf .git
bower install -q
${HOME}/.cabal/bin/zeitkraut build

rsync --delete -a _site ${HOME}/_build/
