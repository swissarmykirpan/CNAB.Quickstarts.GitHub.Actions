#!/bin/sh

bundle_dir=$1
invocation_image=$2

set -e

cd ${bundle_dir}

echo "Building Bundle in Solution Directory: $(pwd) using Porter"

porter build

printf "Filter:%s\\n" "${invocation_image}"
invocation_image_tag="$(docker image ls ${invocation_image} --format='{{lower .Tag}}')"
echo "Invocation Image Tag: ${invocation_image_tag}"
echo ::set-output name=invocation_image_tag::${invocation_image_tag}