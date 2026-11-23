---
title: "EC2 and Nginx Health Checks"
sidebar: "EC2 and Nginx Health Checks"
---

This article covers launching a server inside a VPC, putting a web server on it, and then checking from outside that it is alive.

## EC2 and AMI

**EC2** is AWS's virtual server. There are three main things to choose when creating one.

| What to choose | Meaning | In B3-1 |
|---|---|---|
| AMI | The OS image installed on the server | Ubuntu 22.04 LTS |
| Instance type | CPU and memory size | t2.micro (free tier) |
| Location | Which subnet and which security group | Public subnet, cloud-lab-web-sg |

The disk is attached as an EBS volume. In B3-1, an 8GB gp3 volume was used, and it was set to be deleted along with the instance (`DeleteOnTermination`).

## Key Pairs and SSH

A **key pair** is a pair of a public key and a private key. AWS puts the public key on the server, and your computer connects over SSH with the private key (`.pem`).

```bash
chmod 400 my-cloud-key.pem               # readable only by me
ssh -i my-cloud-key.pem ubuntu@<public-IP>   # the default user for the Ubuntu AMI is ubuntu
```

If other people can read the private key file, SSH refuses to use the key. That permission problem was the cause of the `Permission denied (publickey)` error in B3-1.

## Installing Nginx Automatically with User Data

**User Data** is a script that runs once when the EC2 instance first boots. In B3-1, Nginx installation, a default page ("Hello Cloud!"), and the `/health` setting were put there so the web server would be ready without logging into the server.

```nginx
location /health {
    access_log off;
    return 200 'OK';
    add_header Content-Type text/plain;
}
```

## Health Checks

A **health check** confirms that a server is working properly through a fixed address. Viewing a page in a browser requires a person to check it by eye, but with a health check, a program can decide based on the status code and response.

```bash
curl -s -o /dev/null -w "%{http_code}" http://<public-IP>/health   # 200
curl -s http://<public-IP>/health                                  # OK
```

A load balancer (ALB) works the same way: it periodically calls the health check address of each target server and stops sending requests to servers that fail.

## Interview Questions

### Q. Why build a separate health check endpoint?

This checks whether you designed things so that verification can be automated.

> Checking by a person in a browser can't be automated. If `/health` always returns 200 and `OK`, a script or monitoring tool can decide success or failure just by looking at the status code. A load balancer also checks server status through this address and removes dead servers, so it was also a way to practice the real-world setup ahead of time. In B3-1, it took just a few lines of Nginx configuration, and access logging was turned off for it.

### Follow-up Questions

- Right now `/health` returns OK as long as Nginx is alive. Is that enough?
  → It only tells you whether the web server is alive. If there is an app server or DB behind it, you need a separate health check that also checks those.
- If an SSH connection gives `Permission denied (publickey)`, what do you check?
  → In order: the private key file permissions (400), the right user name for the AMI (`ubuntu` for Ubuntu), and whether the key pair attached to the instance is the right one.

> Source: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
