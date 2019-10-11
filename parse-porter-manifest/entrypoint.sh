#!/bin/sh

manifest_path=$1

full_path="$GITHUB_WORKSPACE/$manifest_path"

echo "Full manifest path: $full_path"

echo "Installing yq"
python -m pip install --upgrade pip yq
echo "Installed yq"

name=$(yq .name ${full_path} -r)
echo "name: ${name}"

version=$(yq .version ${full_path} -r)
echo "version: ${version}"

invocation_image=$(yq .invocationImage ${full_path} -r)
echo "invocation_image: ${invocation_image}"

echo ::set-output name=name::${name}
echo ::set-output name=version::${version}
echo ::set-output name=invocation_image::${invocation_image}