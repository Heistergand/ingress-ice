#!/bin/bash

config_file="/.ingress-ice.conf"
screenshot_folder="/screenshots"
ice_js_file="/ingress-ice/ice/ice.js"

if ! [[ -r "$config_file" ]]
then
    if ! [[ -r "$screenshot_folder$config_file" ]]
	then
        echo "The configuration file does not exist. Please create it first and then specify it as a docker volume or put it into the screenshots directory as $config_file" >&2
        exit 1
    else
        config_file="$screenshot_folder$config_file"
    fi
fi

umask 0000

cd $screenshot_folder

# Update to use node instead of phantomjs
node "$ice_js_file" "$config_file" > ingress-ice.log
