---
title: "Docker (Containers · Images · Deployment)"
sidebar: "Docker"
draft: false
---

This page gathers the Docker basics in one place: what containers and images are, how to build an image yourself and deploy it to Docker Hub, and the difference between `exec` and `attach` for getting into a running container.

## What Are Containers and Images?

A **container** runs an application with only what it needs, packed inside an isolated box. When you run several programs on the same computer, conflicts are easy to run into, such as needing different library versions or overlapping ports. Containers prevent these conflicts.

### Why Isolation Is Needed
As an analogy, it is like several people sharing one fridge in a studio apartment. It would be a mess if nobody could tell who put what in or when things expire. A container gives each person their own fridge (file system, network, and process space).

### How Is It Different from a Virtual Machine (VM)?
A VM builds an entire second computer inside one computer, so it has its own OS kernel. A container, on the other hand, borrows the host's kernel as is and isolates only at the process level. That makes it much lighter and faster.

![Comparison: on the left, the VM runs a separate Guest OS for each app; on the right, containers share a single OS on top of Docker Engine](/images/cloud/docker-vs-vm.jpg)

In the figure, each app on the VM side has a whole **Guest OS** attached to it, while on the container side each app only has its own app and libraries (Bins/Libs), and the OS below is shared by all. This difference leads to the differences in size and startup speed.

| Category | Virtual machine (VM) | Container |
|---|---|---|
| Unit of isolation | Entire OS | Process |
| Size | Several GB | Tens to hundreds of MB |
| Startup speed | Minutes | Seconds |
| Kernel | Has its own kernel | Shares the host kernel |

### What Is an Image?
An **image** is a file that contains everything needed to run a container. Think of the relationship between a waffle iron and a waffle. The image is the iron, and what you make with it is the container.

![Four containers sharing one ubuntu:15.04 image, each adding only a thin read/write layer on top](/images/cloud/docker-sharing-layers.png)
*Image source: [Docker Docs - Storage drivers](https://docs.docker.com/engine/storage/drivers/) (Apache-2.0)*

Even if you make many waffles (containers) with one iron (image), the iron stays the same. Each container gets its own thin writable space (Thin R/W layer) that holds only its own changes, and the image below is shared by everyone as read-only.

To run a Next.js app you need a node environment, and to run a Django app you need a Python environment. Images with these basic environments already set up can simply be downloaded from Docker Hub. There is no need to build the environment from scratch.

### Images Are Stacked in Layers
A single image is actually made of several "layers" stacked on top of each other. That is why you see multiple files being downloaded in order when you pull an image, and why storage can fill up quickly once you have pulled several images.

![A thin read/write container layer on top of the four read-only layers of the ubuntu:15.04 image](/images/cloud/docker-container-layers.png)
*Image source: [Docker Docs - Storage drivers](https://docs.docker.com/engine/storage/drivers/) (Apache-2.0)*

The lower boxes with padlocks are the image layers (read-only), and the dotted box at the top is the writable layer created when the container runs. If you edit or create files inside the container, they are written only to this top box, and when you delete the container, this box disappears with it.

![App 1 and App 2 each have their own source and dependency layers but share the Python and pip and Debian base layers](/images/cloud/docker-image-layer-reuse.png)
*Image source: [Docker Docs - Understanding the image layers](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/) (Apache-2.0)*

Layers are also reused between images. If two apps use the same base (Debian + Python), that part is downloaded only once, and only the app-specific layers stacked on top are downloaded separately.

```
docker image ls              # list downloaded images
docker image rm <image-name>  # delete an unused image
```

## Building an Image and Deploying to Docker Hub

To run your own application in a container, you first have to create an **image** that contains that application. This process is called a **build**.

### Two Things a Build Needs
A build needs a **Dockerfile** and a **build context**. The Dockerfile is the blueprint that describes "how to make the image," and the build context is the starting location from which the ingredients (source code, etc.) are taken according to that blueprint.

### Build Command
Officially, **`docker buildx build`** is the standard instead of the older `docker image build`.

```
docker buildx build -t username/image-name:tag .
```

| Option | Meaning |
|---|---|
| `-t` | Set the image name and tag |
| `--build-arg` | Variables passed in at build time |
| `-f` | Set the Dockerfile path (default is `Dockerfile`) |
| `--pull` | Always pull the latest base image fresh |

### Why Is the Build Context Usually `.`?
The build context is usually set to the top-level path of the source code. Running the build command from that location keeps paths from getting tangled and avoids confusion.

### Reading the Build Log
When you run a build, the log shows progress like `1/4`, `2/4`. This shows each instruction in the Dockerfile creating one layer at a time.

### Checking and Deploying the Image
When the build finishes, check with `docker image ls` that it was created properly on your computer. Deployment is done after logging in to Docker Hub, and if you want to upload several tags at once, use `docker image push -a username/image-name`. After uploading, you can check on the Docker Hub site that the image and tags were uploaded correctly.

**Overall flow**: write a Dockerfile → build the image with `docker buildx build` → check locally → deploy to Docker Hub

![The overall structure: the Client's docker run, build, and pull commands are sent to the daemon on the Docker Host, which manages images and containers and exchanges images with the Registry (Docker Hub)](/images/cloud/docker-architecture.png)
*Image source: [Docker Docs - What is Docker?](https://docs.docker.com/get-started/docker-overview/) (Apache-2.0)*

The `docker` command you type in the terminal (the Client) doesn't do the work itself; it just asks the **Docker daemon** to do it. `build` creates an image on your computer, `run` starts a container from that image, and `pull`/`push` exchange images with the Registry (Docker Hub).

## Difference Between docker exec and docker attach

There are two ways to look inside a container that is already running, **exec** and **attach**. They look similar, but they work in completely different ways.

### exec: Starts One More New Process
`docker exec` runs a new additional process inside a container that is already running. It is like people already working in an office, and you walk in separately through a new door.

```
docker exec -it <container-name> /bin/bash
```

Even if you type `exit` in the terminal opened this way, only the process you created ends; the container itself and the main process that was already running are not affected at all.

### attach: Connects Directly to the Existing Process
`docker attach` connects your current terminal directly to the input/output of the **main process (PID 1)** that started when the container launched. So you can see the logs the main process prints in real time.

The problem is that if you type `exit` here, the main process itself ends, and the container shuts down along with it. To get out without stopping the container, you have to press `Ctrl+P` and then `Ctrl+Q` in that order.

### Comparison at a Glance
| | exec | attach |
|---|---|---|
| Connects to | A newly started process | The existing main process (PID 1) |
| Container when leaving | Not affected | Typing `exit` also stops the container |
| Leaving safely | Just `exit` | `Ctrl+P` → `Ctrl+Q` |
| Main use | Shell access, debugging | Watching logs in real time |

## Summary

| Concept | Key point |
| --- | --- |
| Container | Runs only what is needed in isolation; shares the host kernel, so it is lighter and faster than a VM |
| Image | The mold for making containers, built from stacked layers (managed with `docker image ls` / `rm`) |
| Build | Dockerfile + build context (usually `.`) with `docker buildx build -t ...` |
| Deployment | Log in and push to Docker Hub; for multiple tags, `docker image push -a` |
| exec | Connects with a new process; `exit` doesn't affect the container (shell access, debugging) |
| attach | Connects to the main process (PID 1); leave with `Ctrl+P` → `Ctrl+Q` (watching logs in real time) |

> Reference: personal Notion study notes
