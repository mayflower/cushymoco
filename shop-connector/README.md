Shop Connector
==============

*Directory structure matches Oxid 4.7.0+.*

All required files are located under `OXID/` directory. 




## Setup

### Oxid 4.7.0+
To use the shop connector with *Oxid 4.7.0 (and higher)*, checkout this repository and cd into `shop-connector/OXID/`. From here, copy all files to your Oxid root directory:

    cp -r ./* /path/to/your/oxid/installation/



### Oxid 4.6 (and older)

**Attention:** Users of *Oxid 4.6 (or earlier)* have to use the following directory mapping:

    core/                   -> core/
    application/views/      -> out/
    application/controllers -> views/

Checkout this repository, cd into `shop-connector/OXID/` and move the directories as described above. When you done, copy all files to your Oxid root directory:

    cp -r ./* /path/to/your/oxid/installation/
