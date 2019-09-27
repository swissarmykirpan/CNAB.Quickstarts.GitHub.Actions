#!/bin/sh

metadata_path=$1

cd $GITHUB_WORKSPACE
ls

echo "Metadata path: ${metadata_path}"

echo "Installing yq"
python -m pip install --upgrade pip yq
echo "Installed yq"

name=$(yq .name ${metadata_path} -r)
echo "name: ${name}"

invocation_image=$(yq .invocationImage ${metadata_path} -r)
echo "invocation_image: ${invocation_image}"

echo ::set-output name=name::${name}
echo ::set-output name=invocation_image::${invocation_image}