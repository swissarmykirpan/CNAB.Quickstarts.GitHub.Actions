#!/bin/sh

repo_name=$1
pr_number=$2
source_version=$3

if [ "${reason}" == "push" ]; then
    commit_uri=https://api.github.com/repos/${repo_name}/commits/${GITHUB_SHA}
    echo "Merge Commit uri: ${commit_uri}"
    files=$(curl "${commit_uri}"|jq '[.files[].filename]') 
fi

if [ "${reason}" == "pull_request" ]; then
    pr_uri="https://api.github.com/repos/${repo_name}/pulls/${pr_number}/files"
    echo "PR uri: ${pr_uri}"
    files=$(curl "${pr_uri}"|jq '[.[].filename]') 
fi

echo "Files changed:"
for file in "${files[@]}"
do
    echo $file
done


# TODO check if changes are in multiple subfolders
# TODO set outputs