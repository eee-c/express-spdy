INSTALL express-spdy
====================

These instructions will install edge-openssl, node.js and express-spdy in your home directory.  This will *not* overwrite or affect any system libraries.

I work with tarballs in `$HOME/src` and source code controlled code in `$HOME/repos`.

Dependencies
------------

Dependencies are described for a vanilla Debian 64-bit system, but should work equally well for Ubuntu.  It should be relatively easy to extrapolate dependencies for OSX.

If not already installed, you need:

* C and C++ compilers for openssl and node.js
* Zlibh for SPDY compression
* Git to obtain the latest node.js source
* Python to configure node.js
* Curl for installing the Node Package Manager (NPM)

This can be accomplished on Debian / Ubuntu with:

    sudo apt-get install build-essential zlib1g-dev git-core python curl

Edge openssl
------------

SPDY requires Next Protocol Negotiation (NPN) extensions to work properly.  This is only available in edge openssl.  This can be obtained from the openssl CVS repository, but that would require installing CVS.  It is easier to access the [openssl FTP server](ftp://ftp.openssl.org/snapshot/).  Look for tar.gz files that begin with `openssl-SNAP-`.  Following that prefix is a datestamp (the tarball from June 22 was `openssl-SNAP-20110622.tar.gz`).  Unfortunately those tarballs are only available in a rolling 4 day window so permanent links are not possible.

Once you have identified the correct openssl SNAP tarball, download and un-tar it in `$HOME/src`:

    mkdir $HOME/src
    cd $HOME/src
    wget ftp://ftp.openssl.org/snapshot/openssl-SNAP-<datestamp>.tar.gz
    tar zxf openssl-SNAP-<datestamp>.tar.gz
    cd openssl-SNAP-<datestamp>

Next configure openssl for your platform.  For 32-bit linux, use:

    ./Configure shared --prefix=$HOME/local no-idea no-mdc2 no-rc5 zlib  enable-tlsext linux-elf

If you are using 64-bit linux, replace `linux-elf` with `linux-x86_64`.  If unsure what platform to use, run `./Configure` without any options to get a complete list.

After configuring openssl, build and install it:

    make depend
    make
    make install

Stable node.js
----------------

Install the source code in `$HOME/src`:

    mkdir -p $HOME/src
    cd $HOME/src/
    # NOTE: check for latest version at http://nodejs.org/#download
    wget http://nodejs.org/dist/v0.6.16/node-v0.6.16.tar.gz
    tar zxf node-v0.6.16.tar.gz
    cd node-v0.6.16

Configure node to use edge-openssl and to install locally:

    ./configure --openssl-includes=$HOME/local/include --openssl-libpath=$HOME/local/lib --prefix=$HOME/local/node-v0.6.16
    make
    make install

Configure Bash to Use Edge openssl and node.js
----------------------------------------------

Add the following to $HOME/.bashrc:

    # For locally installed binaries
    export LD_LIBRARY_PATH=$HOME/local/lib
    PATH=$HOME/local/bin:$PATH
    PKG_CONFIG_PATH=$HOME/local/lib/pkgconfig
    CPATH=$HOME/local/include
    export MANPATH=$HOME/local/share/man:/usr/share/man

    # For node.js work. For more info, see:
    # http://blog.nodejs.org/2011/04/04/development-environment/
    for i in $HOME/local/*; do
      [ -d $i/bin ] && PATH="${i}/bin:${PATH}"
      [ -d $i/sbin ] && PATH="${i}/sbin:${PATH}"
      [ -d $i/include ] && CPATH="${i}/include:${CPATH}"
      [ -d $i/lib ] && LD_LIBRARY_PATH="${i}/lib:${LD_LIBRARY_PATH}"
      [ -d $i/lib/pkgconfig ] && PKG_CONFIG_PATH="${i}/lib/pkgconfig:${PKG_CONFIG_PATH}"
      [ -d $i/share/man ] && MANPATH="${i}/share/man:${MANPATH}"
    done

Logout and log back in to ensure that your changes are applied correctly.

Install NPM and Express-Spdy
--------------------------

    curl http://npmjs.org/install.sh | clean=yes sh
    npm install -g express-spdy

Create a Sample Express-Spdy App
--------------------------------

    cd $HOME/repos
    express-spdy example-spdy
    cd example-spdy
    npm install

Run the Sample App
------------------

    node app.js

If all has worked, you should see:

    Express server listening on port 3000 in development mode

And you should be able to access the SPDY-ized site at: https://localhost:3000 (proceed past certificate warnings).

To verify that you are seeing a SPDY session and not just a plain-old HTTP session, checkout the SPDY tab in Chrome's `about:net-internals`.
