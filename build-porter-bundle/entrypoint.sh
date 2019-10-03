#!/bin/sh

porter_path=$1
bundle_dir=$2
invocation_image=$3

set -e

cd ${bundle_dir}

echo "Building Bundle in Solution Directory: $(pwd) using Porter"

${porter_path} build

printf "Filter:%s\\n" "${invocation_image}"
invocation_image_tag="$(docker image ls ${invocation_image} --format='{{lower .Tag}}')"
echo "Invocation Image Tag: ${invocation_image_tag}"
echo ::set-output name=invocation_image_tag::${invocation_image_tag}