# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
	config.vm.box = "ubuntu/bionic64"

	config.vm.network "forwarded_port", guest: 4000, host: 4000

	config.vm.provider "virtualbox" do |vb|
		vb.memory = "2048"
	end

	config.vm.provision "shell", inline: <<-SHELL
		apt-get update -y

		curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

		apt-get install -y build-essential software-properties-common nodejs
	SHELL

	config.vm.provision "shell", privileged: false, inline: <<-SHELL
		echo
		echo "Installed packages:"
		echo "  -> NodeJS 10.x"
		echo
		echo "Mapped Ports:"
		echo "  -> VM:4000 > Host:4000"
	SHELL
end