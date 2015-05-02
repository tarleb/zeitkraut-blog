# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "debian-8.0.0-amd64.box"
  config.vm.box_url = "http://static.zeitkraut.de/debian-8.0.0-amd64.box"
  config.vm.box_download_checksum_type = "sha512"
  config.vm.box_download_checksum = (
    "05af0f71a49d78e58f4f260bb7f5a005349a4ff0d9a70c8b2bf82378b83be859" +
    "a3ec8b075e880984e1c50f330d4a08cd5559a2dc9686c7738375832e2bed4aad"
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
