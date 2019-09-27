install_path=$1
porter_url=$2
porter_version=$3
feed_url=$4
mixins=$5
mixins_version=$6

install_path="$HOME/${install_path}"

echo "Installing porter to ${install_path}"

mkdir -p ${install_path}
curl -fLo ${install_path} "${porter_url}/${porter_version}/porter-linux-amd64"
chmod +x ${install_path}
cp "${install_path}/porter" "${install_path}/porter-runtime"

echo Installed "$("${install_path}/porter" version)"


echo "Installing mixins: ${mixins}"

IFS=',' read -ra mixins_array <<< "$mixins"

for mixin in "${mixins_array[@]}"
do
    "${install_path}/porter" mixin install $mixin --version "${mixins_version}" --feed-url "${feed_url}"
done

echo "Installed mixins"

echo ::set-output name=install_path::${install_path}