#!/bin/bash

install_path=$1
porter_url=$2
porter_version=$3
feed_url=$4
mixins=$5
mixins_version=$6

install_path="$GITHUB_WORKSPACE/$install_path"
porter_url="${porter_url}/${porter_version}/porter-linux-amd64"

echo "Installing porter from ${porter_url} to ${install_path}"

mkdir -p "${install_path}"

porter_path=${install_path}/porter

wget -O "${porter_path}" "${porter_url}"
chmod +x "${porter_path}"
cp "${porter_path}" "${install_path}/porter-runtime"

echo Installed "$("${porter_path}" version)"


echo "Installing mixins: ${mixins}"

IFS=',' read -ra mixins_array <<< "$mixins"

for mixin in "${mixins_array[@]}"
do
    "${porter_path}" mixin install $mixin --version "${mixins_version}" --feed-url "${feed_url}"
done

echo "Installed mixins"

echo ::add-path::${install_path}
echo ::set-output name=porter_path::${porter_path}