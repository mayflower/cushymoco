Shop Connector
==============

*Directory structure matches OXID eShop 4.7.0+.*

All required files are located under `OXID/` directory. 

## Setup

### OXID eShop 4.7.0+
To use the shop connector with *OXID eShop 4.7.0 (and higher)*, checkout this repository and cd into `shop-connector/OXID/`. From here, copy all files to your OXID root directory:

    cp -r ./* /path/to/your/oxid/installation/



### OXID eShop 4.6 and older

**Attention:** Users of *OXID eShop 4.6 (or earlier)* have to use the following directory mapping:

    core/                   -> core/
    application/views/      -> out/
    application/controllers -> views/

Checkout this repository, cd into `shop-connector/OXID/` and move the directories as described above. When you done, copy all files to your Oxid root directory:

    cp -r ./* /path/to/your/oxid/installation/

## License

The shop connector code is subject to the GPL-3 for compatibility with OXID eShop Community Edition
(see [LICENSE.txt](LICENSE.txt)) and subject to a proprietary license for the OXID eShop Enterprise Edition.

## Users of OXID Enterprise Edition

If you are a Enterprise Edition user, please [contact us](mailto:sales@mayflower.de) for further information how to use
the shop connector for your Enterprise Edition.
