#!/bin/sh

manifest_path=$1

full_manifest_path="$GITHUB_WORKSPACE/$manifest_path"
quickstart_dir=$(realpath $full_manifest_path/..)

version=$(yq .version ${full_manifest_path} -r)
echo "version: ${version}"

gitversion_config_path=$quickstart_dir/gitversion.yml
contents="next-version: $version"

echo "Writing temporary Gitversion config file with contents '$contents' to path '${gitversion_config_path}'"
echo $contents > $gitversion

cd $quickstart_dir

dotnet /app/GitVersion.dll -nocache -output buildserver -exec /bin/bash -execargs "-c \"echo $GitVersion_FullSemVer > $GITHUB_WORKSPACE/version.txt\""

GitVersion_FullSemVer=$(cat $GITHUB_WORKSPACE/version.txt)

echo ::set-output name=fullsemver::$GitVersion_FullSemVer