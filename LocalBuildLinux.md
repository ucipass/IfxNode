## Linux Build
--------------
**FYI:** Make sure bit architectures matches for all binary components; if you are using 64bit nodejs make sure you are using 64bit Informix Client-SDK as well.

#### FYI: 
* [Node.js breaking changes between v4 LTS and v6 LTS](https://github.com/nodejs/node/wiki/Breaking-changes-between-v4-LTS-and-v6-LTS)
* [Node.js community wiki](https://github.com/nodejs/node/wiki)


### Prerequisite :
* Informix Client SDK 410 xC2 or above
* Git  
* NodeJS
* Python     2.7
* Node-gyp   (npm install -g node-gyp)
* NAN        (npm install -g nan)

#### Install Node.js
```
# Remove old nodejs installation if any
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm  -y

# Install 8x nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### FYI: Make sure you have the right node.js
```bash  
# rm /work/nodejs
# cd /work/dev

###### if 64bit Linux on x86
# wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
# tar -xvf node-v8.9.4-linux-x64.tar.xz
# sudo ln -s  /work/dev/node-v8.9.4-linux-x64  /work/nodejs

###### if ARM v7 (Raspberry Pi 3)
# sudo wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-armv7l.tar.xz 
# sudo tar -xvf node-v8.9.4-linux-armv7l.tar.xz
# sudo ln -s  /work/dev/node-v8.9.4-linux-armv7l  /work/nodejs

# export PATH=/work/nodejs/bin:$PATH
which node
node -v
```
#### Complile time environment
```bash
# sudo ln -s /home/informix/1210UC9 /work/informix
# Assuming 'CSDK' is installed at /work/informix
export CSDK_HOME=/work/informix  
```

### Fire the build
```bash 
cd /work/t1
git clone https://github.com/OpenInformix/IfxNode.git

cd /work/t1/IfxNode
npm update

rm -rf ./build  
npm install -g node-gyp
# Raspberry Pi 3
# sudo npm install -g node-gyp

node-gyp configure -v  
node-gyp build -v 
```

#### check the build output, if all right then the driver binary is    
```bash
ls -l ./build/Release/ifx_njs_bind.node
```

#### Build Cleanup
```bash
rm /work/t1/IfxNode/build/binding.Makefile
rm /work/t1/IfxNode/build/config.gypi
rm /work/t1/IfxNode/build/ifx_njs_bind.target.mk
rm /work/t1/IfxNode/build/Makefile
rm -rf /work/t1/IfxNode/build/Release/obj.target
rm -rf /work/t1/IfxNode/build/Release/.deps

# apt-get update
# apt-get install zip unzip

cd /work/t1/IfxNode
zip -r build.zip ./build
# mv build.zip ./prebuilt/Linux64/build.zip
# mv build.zip ./prebuilt/Arm/build.zip
```

### Quick test of the local build
---------------------------------

##### Get a sample code 
```bash
cd /work/try
rm -rf /work/try/node_modules
mkdir /work/try/node_modules

ln -s  /work/t1/IfxNode  /work/try/node_modules/ifxnjs
cp /work/t1/IfxNode/test/SampleApp1.js .
```

##### Set runtime environment to pick Informix Client SDK libraries.
```bash
export INFORMIXDIR=/work/informix
export LD_LIBRARY_PATH=${INFORMIXDIR}/lib:${INFORMIXDIR}/lib/esql:${INFORMIXDIR}/lib/cli
```

##### Run the sample 
```bash
cd /work/try

vi SampleApp1.js
# edit connection informaton and then run
node SampleApp1.js
```
