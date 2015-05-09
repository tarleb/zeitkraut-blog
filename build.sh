#!/bin/sh

set -e

cd "${HOME}/hakyll"
cabal install

cd "${HOME}/content"
${HOME}/.cabal/bin/zeitkraut build

rsync --delete -a _site ${HOME}/_build/
