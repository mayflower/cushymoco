#!/bin/bash

defaultBaseURL="http://oxid.openstack/cl=cushymoco"

# Copy files to their desired place
cp -iv ./.setup/tiapp.xml ./
cp -iv ./.setup/manifest ./
cp -iv ./.setup/app/config.json ./app/

if [ $? == 0 ]; then
	# Get tht base URL the app should use (this will be inserted into 'app/config.json')
	read -p "Please enter base URL [${defaultBaseURL}]: " baseURL
	
	# Use a default value if no base URL was entered
	baseURL=${baseURL:-$defaultBaseURL}
	
	# Escape URL for use with sed
	escapedBaseURL="${baseURL//\//\\/}"
	
	echo "Setting base URL to '${baseURL}' in app/config.json"
	sed "s/\#{baseURL}/${escapedBaseURL}/g" ./app/config.json > ./.setup/.tmp/config.json
	mv -f ./.setup/.tmp/config.json ./app/
fi

exit 0
