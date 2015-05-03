# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "debian-8.0.0-amd64.box"
  config.vm.box_url = "http://static.zeitkraut.de/debian-8.0.0-amd64.box"
  config.vm.box_download_checksum_type = "sha512"
  config.vm.box_download_checksum = (
    "c379b03f8426d409ac1bdc55edbbe027e94e637ed9355d9087e90de71ec5dbf5" +
    "6a7e7cb7ade12b3e709b7070583dd3986c49bf5f790484f44b4bec56e01939b0"
  )

  config.vm.provider :virtualbox do |vb|
    # GHC requires a bit more memory than the VM has by default.
    vb.customize ["modifyvm", :id, "--memory", "2048"]
    # Speed up compilation, this will usually run on a multicore machine
    vb.cpus = 2
  end

  ## SYNCED FOLDERS
  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder "salt/roots/", "/srv/salt/", type: "rsync"
  config.vm.synced_folder "content", "/home/vagrant/content", type: "rsync",
                          rsync__exclude: "content/.git/"
  config.vm.synced_folder "hakyll", "/home/vagrant/hakyll", type: "rsync",
                          rsync__exclude: "hakyll/.git/"

  ## PROVISIONING
  ## ############
  # Ensure the system is current
  config.vm.provision "shell", inline: 'apt-get update && apt-get upgrade -y'

  config.vm.provision :salt do |salt|
    salt.minion_config = "salt/minion"
    salt.run_highstate = true
    salt.bootstrap_script = "salt/bootstrap.sh"
  end
end
