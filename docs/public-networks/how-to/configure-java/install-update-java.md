---
sidebar_position: 1
description: Install or update Java for use with Besu
---

# Install and update Java

There are many flavors of Java and the Java Virtual Machine (JVM) that work with Besu.
They might impact performance, start time, and more.
Consider the options carefully when installing Java on your host machine.
Currently, [we recommend Java 21](../../get-started/system-requirements.md#java-distribution-and-installation).

## Install Java

Download the version of Java you would like to install.
If you are running Besu outside a virtual environment, like Docker, you must have Java installed on
the host machine.

:::tip
Download [OpenJDK 21](https://jdk.java.net/21/).
:::

You can find platform-specific installation instructions with the download.
The following installation examples use OpenJDK.

### Install Java on Ubuntu

You can install OpenJDK on Ubuntu using the `apt-get` command.

1. Ensure `apt` libraries are installed and up-to-date:

    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2. Confirm whether Java is already installed:

    ```bash
    java -version
    ```

    If a version is returned, and you would like to update, see how to [update Java on Ubuntu](#update-java-on-ubuntu).

3. If no version is returned, use `apt` to install the preferred version. 

    ```bash
    sudo apt-get install openjdk-21-jdk
    ```

4. Confirm the installation:

    ```bash
    java -version
    ```
   
5. You might need to update your environment to make Java visible to Besu.
    Edit the `.bashrc` file in your home directory (or create it if needed) and add the following
    lines to the end of the file:

    ```text title=".bashrc"
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
    export PATH=$PATH:$JAVA_HOME/bin
    ```

6. Save your changes and source the file:

    ```bash
    source ~/.bashrc 
    ```

7. Verify that you updated your environment:

    ```bash
    echo $JAVA_HOME
    echo $PATH
    ```

    You should see the JDK versions output.

### Install Java on MacOS 

You can install OpenJDK on MacOS using Homebrew.

1. With `brew` installed, run:

    ```bash
    brew install openjdk@21
    ```

    You can target another version if you prefer. 

2. Confirm the installation:

    ```bash
    java -version
    ```

    The OpenJDK version you install should display.

    If this command returns `command not found: java`, check your terminal logs.
    Brew might prompt you to create a symlink or update your path variables within the logs in the
    terminal output.
    If so, run the prompts provided.

## Update Java 

### Update Java on Ubuntu

To update Java on Ubuntu, uninstall the current versions and follow the instructions to
[install Java on Ubuntu](#install-java-on-ubuntu) with your target version.

If you started with this guide, you can uninstall Java using the following command:

```bash
sudo apt-get purge openjdk-\*
```

### Update Java on MacOS

You can update Java on MacOS using Homebrew.

1. List your Homebrew packages:

    ```bash
    brew ls
    ```

2. To update the JDK version (for example, from 17 to 21), uninstall the old version and reinstall
    the target version:

    ```bash
    brew uninstall openjdk@17
    brew install openjdk@21
    ```

    :::note
    If you installed a version of Java not using Homebrew, it is located at
    `/Library/Java/JavaVirtualMachines` and can be safely deleted from that directory.
    :::

3. To update point versions of Java, run the `upgrade` command:

    ```bash
    brew upgrade openjdk
    ```
