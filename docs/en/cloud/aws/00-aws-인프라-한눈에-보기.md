---
title: "AWS Infrastructure at a Glance (B3-1)"
sidebar: "AWS Infrastructure at a Glance"
---

In the Codyssey B3-1 mission, I built the network on AWS from scratch, put an Nginx web server on it, and made it reachable from the outside. This page gives a quick tour of the overall structure and concepts first; for details, see the article for each concept.

## What Was Built

I created a new VPC in the AWS Seoul region, launched one EC2 instance in a public subnet inside it, and had Nginx serve a web page and a health check (`/health`). The security group opens only the ports that are needed, and the IAM user used for the work has only the permissions the lab requires. Setup and cleanup were automated with AWS CLI shell scripts.

![B3-1 architecture: from the internet through the IGW, route table, public subnet, and security group to Nginx on EC2](/images/cloud/aws-architecture.png)
*Figure: B3-1 architecture. DENY in the IAM box on the right means it is blocked because it was not put on the allow list, not that a separate Deny statement was written in the policy.*

| Component | Name | Setting |
|---|---|---|
| VPC | cloud-lab-vpc | 10.0.0.0/16 |
| Public subnet | cloud-lab-public-subnet | 10.0.1.0/24 (ap-northeast-2a) |
| Internet gateway | cloud-lab-igw | Attached to the VPC |
| Route table | cloud-lab-public-rt | 0.0.0.0/0 → IGW |
| Security group | cloud-lab-web-sg | HTTP 80 for everyone, SSH 22 for my IP only |
| EC2 | cloud-lab-web-server | t2.micro, Ubuntu 22.04 LTS |
| Web server | Nginx | Port 80, responds on `/health` |

## The Path of an Incoming Request

```
User (internet)
 → Internet gateway (the VPC's entrance)
 → Route table (0.0.0.0/0 → IGW)
 → Public subnet (10.0.1.0/24)
 → Security group (TCP 80 allowed?)
 → EC2 → Nginx → response
```

If even one of these is missing, the server can't be reached from the outside. So when the connection fails, check them one by one in this order.

## One-Line Concept Summary

| Concept | One-line meaning | Details |
|---|---|---|
| Region / Availability Zone | An area where AWS data centers are located / an independent group of data centers within that area | [VPC and Subnets](./01-vpc와-서브넷) |
| VPC | Your own isolated network inside AWS | [VPC and Subnets](./01-vpc와-서브넷) |
| CIDR | A way of writing a network's IP range, like `10.0.0.0/16` | [VPC and Subnets](./01-vpc와-서브넷) |
| Subnet | An IP section carved out of a VPC. There are public and private ones | [VPC and Subnets](./01-vpc와-서브넷) |
| Internet gateway | The entrance that connects a VPC to the internet | [Internet Gateway and Routing](./02-인터넷-게이트웨이와-라우팅) |
| Route table | A table listing where to send packets for each destination | [Internet Gateway and Routing](./02-인터넷-게이트웨이와-라우팅) |
| NAT gateway | A device that lets a private subnet only go out to the internet | [Internet Gateway and Routing](./02-인터넷-게이트웨이와-라우팅) |
| Security group | A firewall in front of an instance that filters incoming and outgoing traffic | [Security Groups and NACLs](./03-보안-그룹과-nacl) |
| NACL | A firewall that filters traffic at the subnet level | [Security Groups and NACLs](./03-보안-그룹과-nacl) |
| IAM | Permission management that decides who can do which AWS actions | [IAM and Least Privilege](./04-iam과-최소-권한) |
| Principle of least privilege | Granting only the permissions a job really needs | [IAM and Least Privilege](./04-iam과-최소-권한) |
| EC2 / AMI | AWS's virtual server / the OS image used to stamp out servers | [EC2 and Nginx Health Checks](./05-ec2와-nginx-헬스체크) |
| Key pair | The public/private key pair used to SSH into EC2 | [EC2 and Nginx Health Checks](./05-ec2와-nginx-헬스체크) |
| Health check | Checking whether a server is alive through a fixed address | [EC2 and Nginx Health Checks](./05-ec2와-nginx-헬스체크) |
| Hypothesis-driven troubleshooting | Listing candidate causes and ruling them out one by one | [Troubleshooting and Resource Cleanup](./06-트러블슈팅과-리소스-정리) |
| Resource cleanup | Deleting things in order after the lab so no charges are incurred | [Troubleshooting and Resource Cleanup](./06-트러블슈팅과-리소스-정리) |

## What B3-1 Left Behind

| Item | Contents |
|---|---|
| Scripts | `setup-iam.sh` (IAM user and policy), `setup-infrastructure.sh` (from VPC to EC2), `cleanup-infrastructure.sh` (bulk deletion by tag) |
| Documents | Troubleshooting report (3 cases), resource cleanup checklist, WHY analysis, architecture diagram |
| Verification | `curl http://<public-IP>/health` → 200, `OK` |
| Biggest limitation | One server in one AZ, so if the server dies, the service stops. Uses only HTTP, no HTTPS |

> Source: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
