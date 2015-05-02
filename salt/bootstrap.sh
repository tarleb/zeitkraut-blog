#!/bin/sh -

set -e

_TEMP_CONFIG_DIR="null"

while getopts "c:CF" opt
do
    case "${opt}" in
        c ) _TEMP_CONFIG_DIR="$OPTARG" ;;
        C ) echo "Note: ignoring option '-C'" ;;
        F ) echo "Note: ignoring option '-F'" ;;
        \? ) echo "Option does not exist: $OPTARG" && exit 1 ;;
    esac
done
shift $((OPTIND-1))

# Copy salt config files to the correct directory
mv ${_TEMP_CONFIG_DIR}/minion /etc/salt/minion

# Restart the salt minon service
service salt-minion restart

exit 0
