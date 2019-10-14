#!/bin/sh
set -e

manifest_path=$1

full_manifest_path="$GITHUB_WORKSPACE/$manifest_path"
quickstart_dir=$(dirname $full_manifest_path)

version=$(yq .version ${full_manifest_path} -r)
echo "version: ${version}"

gitversion_config_path=$quickstart_dir/GitVersion.yml
contents="next-version: $version"

echo "Writing temporary Gitversion config file with contents '$contents' to path '${gitversion_config_path}'"
echo $contents > $gitversion_config_path

cd $quickstart_dir

echo "Running: dotnet /app/GitVersion.dll"
gv=$(dotnet /app/GitVersion.dll)
echo $gv

FullSemVer=$(echo $gv | jq -r '.FullSemVer')

echo ::set-output name=full_sem_ver::$FullSemVer